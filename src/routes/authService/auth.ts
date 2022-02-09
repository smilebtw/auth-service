import { Router } from "express";
import {
  loginUser,
  decodeToken,
  createUser,
  getAllUsers,
  getOneUser,
} from "../../controllers/auth";

const auth = (routes: Router) => {
  routes.post("/v1/auth/create", createUser);
  routes.post("/v1/auth/login", loginUser);
  routes.post("/v1/auth/verify", decodeToken);
  routes.get("/v1/auth/user", getAllUsers);
  routes.get("/v1/auth/user/:user", getOneUser);
};

export default auth;
