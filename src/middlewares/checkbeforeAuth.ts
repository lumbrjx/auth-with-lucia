import { auth } from "../config/lucia.js";

import { FastifyRequest, FastifyReply } from "fastify";
export default async function checkBeforeAuth(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const authRequest = auth.handleRequest(req, res);

    const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
    if (session) {
      console.log("u're already signed in");
      return res.code(400).redirect("http://localhost:8080/");
    }

    // Access the Redis client through the fastify instance
  } catch (err) {
    console.log("Error while trying to authenticate, Please login again.");

    return res.code(500).redirect("http://localhost:8080/");
  }
}
