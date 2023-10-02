import { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../../config/lucia.js";
import { RegisterSchema } from "./auth.model.js";

export async function registerController(
  req: FastifyRequest,
  res: FastifyReply
) {
  const validForm = RegisterSchema.safeParse(req.body);
  if (validForm.success !== true) {
    return res.code(403).send(validForm.error);
  }

  try {
    const user = await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: validForm.data.username.toLowerCase(), // unique id when using "username" auth method
        password: validForm.data.password, // hashed by Lucia
      },
      attributes: {
        username: validForm.data.username,
        email: validForm.data.email,
        password: validForm.data.password,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);
    // redirect to profile page
    return res.status(302).redirect("/");
  } catch (e) {
    // this part depends on the database you're using
    // check for unique constraint error in user table
    console.log(e);
    return res.status(500).send("An unknown error occurred");
  }
}
