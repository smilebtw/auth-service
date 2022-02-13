require('dotenv').config()
import type { Response, Request, NextFunction, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import database from "../database/index";
import { Prisma } from "@prisma/client";

type userBody = {
  username: string;
  password: string;
  email: string;
};

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as userBody;
  if (!username || !email || !password) {
    return res.status(400).json({
      error: {
        message: "Check your request body",
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

export const loginUser = async (req: Request, res: Response) => {
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
      const token = jwt.sign(
        { username: user.username, role: user.role },
        secret,
        {
          expiresIn: "8h",
        }
      );
      res.cookie("access_token", token).status(200).json({
        message: "Logged in successfully",
      });
    } else {
      res.status(401).json({
        error: {
          message: "Incorrect password"
        },
      });
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await database.user.findMany();
  if (!users) {
    res.status(404).json({
      error: {
        message: "No users were found",
      },
    });
  } else {
    res.status(200).json(users);
  }
};

export const getOneUser = async (req: Request, res: Response) => {
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
    res.status(200).json(user);
  }
};

export const decodeToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: {
        message: "Check your request body",
      },
    });
  }

  const secret = process.env.JWT_SECRET;
  if (secret) {
    try {
      const decodedToken = jwt.verify(token, secret);
      res.status(200).json(decodedToken);
    } catch (error) {
      res.status(401).json({
        error: {
          message: "Unauthorized token",
        },
      });
    }
  }
};
