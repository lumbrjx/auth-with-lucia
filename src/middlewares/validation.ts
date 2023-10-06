import { auth } from "../config/lucia.js";

import { FastifyRequest, FastifyReply } from "fastify";
export default async function checkAuthentication(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (!session) {
      return res.code(401).redirect("http://localhost:8080/");
    }
  } catch (err) {
    return res.code(500).send(err).redirect("http://localhost:8080/");
  }
}
