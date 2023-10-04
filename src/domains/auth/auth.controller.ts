import { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../../config/lucia.js";
import { LoginSchema, RegisterSchema } from "./auth.model.js";

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
    auth.createSessionCookie(session);

    return res.code(201).redirect("/");
  } catch (e) {
    // this part depends on the database you're using
    // check for unique constraint error in user table
    console.log(e);
    return res.status(500).send("An unknown error occurred");
  }
}

export async function loginController(req: FastifyRequest, res: FastifyReply) {
  console.log("body form front", req.body);
  const validForm = LoginSchema.safeParse(req.body);
  if (validForm.success !== true) {
    return res.code(403).send(validForm.error);
  }
  try {
    // find user by key
    // and validate password
    const key = await auth.useKey(
      "username",
      validForm.data.username.toLowerCase(),
      validForm.data.password
    );
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);
    // auth.createSessionCookie(session);

    // redirect to profile page
    return res.status(200).redirect("/");
  } catch (e) {
    // check for unique constraint error in user table
    console.log(e);
    return res.status(500).send("An unknown error occurred");
  }
}
