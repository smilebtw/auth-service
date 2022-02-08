require("dotenv").config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.ALLOW_ORIGIN }));
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log("Servidor foi iniciado");
});
