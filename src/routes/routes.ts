import express from "express";
import auth from "./authService/auth";

const routes = express.Router();

auth(routes);

export default routes;
