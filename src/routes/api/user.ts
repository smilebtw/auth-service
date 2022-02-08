require("dotenv").config();
import type { Response, Request, NextFunction, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import database from "../../database/index";
import { Prisma } from "@prisma/client";

type userBody = {
  username: string;
  password: string;
  email: string;
};

const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as userBody;
  if (!username || !email || !password) {
    return res.status(400).json({
      error: {
        message: "Missing some request data",
      },
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  try {
    await database.user.create({
      data: {
        username: username,
        password: hashPassword,
        email: email,
      },
    });
    res.status(201).json({
      message: `${username} was created`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).json({
          error: {
            message: `${username} already exists in our database`,
          },
        });
      }
    }
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as userBody;
  if (!username || !password) {
    return res.status(400).json({
      error: {
        message: "Check your request body",
      },
    });
  }

  const user = await database.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user)
    res.status(404).json({
      error: {
        message: "User not found in database",
      },
    });
  else {
    const secret = process.env.JWT_SECRET;
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid && secret) {
      const token = jwt.sign({ role: user.role }, secret, {
        expiresIn: "8h",
      });
      res.cookie("access_token", token).status(200).json({
        message: "Logged in successfully",
      });
    }
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await database.user.findMany();
  if (!users) {
    res.status(404).json({
      error: {
        message: "No users were found",
      },
    });
  } else {
    res.json(users);
  }
};

const getOneUser = async (req: Request, res: Response) => {
  const user = await database.user.findFirst({
    where: {
      username: req.params.user,
    },
  });

  if (!user) {
    res.status(404).json({
      error: {
        message: "User not found",
      },
    });
  } else {
    res.json(user);
  }
};

const user = (routes: Router) => {
  routes.post("/v1/auth/create", createUser);
  routes.post("/v1/auth/login", loginUser);
  routes.get("/v1/auth/user", getAllUsers);
  routes.get("/v1/auth/user/:user", getOneUser);
};

export default user;
