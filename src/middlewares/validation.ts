import { auth } from "../config/lucia.js";

import { FastifyRequest, FastifyReply } from "fastify";
export default async function checkAuthentication(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const authRequest = auth.handleRequest(req, res);

    // console.log(authRequest);
    const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
    if (!session) {
      return res.code(401).redirect("http://localhost:8080/");
    }
    const user = session.user;
    const username = user.username;
    // ...
    console.log("im user", user);
    console.log("im username", username);

    // Access the Redis client through the fastify instance
  } catch (err) {
    console.log(err);
    console.log("Error while trying to authenticate, Please login again.");

    return res.code(500).redirect("http://localhost:8080/");
  }
}
