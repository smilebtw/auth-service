import type { Response, Request, NextFunction, Router } from "express";
import bcrypt from "bcrypt";
import database from "../../database/index";
import { Prisma } from "@prisma/client";

type createUserBody = {
  username: string;
  password: string;
  email: string;
};

const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as createUserBody;
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

const user = (routes: Router) => {
  routes.post("/v1/auth/create", createUser);
};

export default user;
