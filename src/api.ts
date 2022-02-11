require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  (
    err: { status: number },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof SyntaxError && err.status === 400) {
      return res.status(400).json({
        error: {
          message: "Invalid JSON Syntax.",
        },
      });
    }
    next(err);
  }
);
app.use(cookieParser());
app.use(cors({ origin: process.env.ALLOW_ORIGIN }));
app.use(routes);

export default app;
