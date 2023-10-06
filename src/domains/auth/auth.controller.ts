import { FastifyReply, FastifyRequest } from "fastify";
import { auth, googleAuth } from "../../config/lucia.js";
import { LoginSchema, RegisterSchema } from "./auth.model.js";
import { serializeCookie, parseCookie } from "lucia/utils";
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
        providerId: "username",
        providerUserId: validForm.data.username.toLowerCase(),
        password: validForm.data.password,
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
    auth.createSessionCookie(session);
    return res.code(201).redirect("/");
  } catch (e) {
    return res.status(500).send("An unknown error occurred");
  }
}
export async function loginController(req: FastifyRequest, res: FastifyReply) {
  const validForm = LoginSchema.safeParse(req.body);
  if (validForm.success !== true) {
    return res.code(403).send(validForm.error);
  }
  try {
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
    return res.status(200).redirect("/");
  } catch (e) {
    return res.status(500).send("An unknown error occurred");
  }
}
export async function logoutController(req: FastifyRequest, res: FastifyReply) {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();
  if (!session) {
    return res.status(401);
  }
  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);
  return res.status(200).redirect("/");
}
export async function googleOAuthController(
  req: FastifyRequest,
  res: FastifyReply
) {
  const [url, state] = await googleAuth.getAuthorizationUrl();
  const stateCookie = serializeCookie("google_oauth_state", state, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60,
  });
  return res.header("Set-Cookie", stateCookie).redirect(url.toString());
}
export async function callbackController(
  req: FastifyRequest,
  res: FastifyReply
) {
  const cookies = parseCookie(req.headers.cookie ?? "");
  const storedState = cookies.google_oauth_state;
  const query: any = req.query;
  const code = query.code;
  const state = query.state;
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);
    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          username: googleUser.name,
          email: googleUser.email as string,
          password: googleUser.sub,
        },
      });
      return user;
    };
    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);
    auth.createSessionCookie(session);
    return res
      .header("Set-Cookie", "google_oauth_state=; Max-Age=0; Path=/;")
      .redirect("/");
  } catch (e) {
    return res.status(500);
  }
}
