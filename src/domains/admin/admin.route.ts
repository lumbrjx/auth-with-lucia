import { FastifyInstance } from "fastify";
import { adminController } from "./admin.controller.js";
import checkAuthentication from "../../middlewares/validation.js";
import * as routeConfig from "../../config/default.json";
export default async function (app: FastifyInstance) {
  app.get(
    routeConfig.default.dashboard,
    { preHandler: checkAuthentication },
    adminController
  );
}
