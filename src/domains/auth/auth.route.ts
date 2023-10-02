// import { auth } from "../../config/lucia";
import { FastifyInstance } from "fastify";
import { registerController } from "./auth.controller.js";

export default async function (app: FastifyInstance) {
  //   app.post("/login", loginController);
  app.post("/register", registerController);
}
