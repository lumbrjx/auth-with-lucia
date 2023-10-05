// import { auth } from "../../config/lucia";
import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
  logoutController,
  googleOAuthController,
  callbackController,
} from "./auth.controller.js";
import redisClient from "../../config/redis-client.js";

export default async function (app: FastifyInstance) {
  app.post("/login", loginController);
  app.post("/register", registerController);
  app.get("/logout", logoutController);
  app.get("/login/google", googleOAuthController);
  app.get("/login/google/callback", callbackController);
  app.get("/getAllRecords", async (request: any, reply: any) => {
    try {
      const keys = await redisClient.keys("*"); // Get all keys
      const values = await redisClient.mget(...keys); // Get values for all keys
      const records = keys.reduce((result: any, key: any, index: any) => {
        result[key] = values[index];
        return result;
      }, {});
      reply.send(records);
      return records;
    } catch (err) {
      console.error(err);
      reply.status(500).send("Error fetching records from Redis");
    }
  });
}
