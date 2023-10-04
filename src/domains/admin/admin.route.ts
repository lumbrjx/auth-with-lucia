import { FastifyInstance } from "fastify";

import { adminController } from "./admin.controller.js";
import checkAuthentication from "../../middlewares/validation.js";

export default async function (app: FastifyInstance) {
  app.get("/dashboard", { preHandler: checkAuthentication }, adminController);
}
