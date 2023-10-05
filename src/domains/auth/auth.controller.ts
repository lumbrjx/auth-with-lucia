import { FastifyReply, FastifyRequest } from "fastify";
import { auth, googleAuth } from "../../config/lucia.js";
import { LoginSchema, RegisterSchema } from "./auth.model.js";
import { serializeCookie, parseCookie } from "lucia/utils";
import { google } from "@lucia-auth/oauth/providers";
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
export async function logoutController(req: FastifyRequest, res: FastifyReply) {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
  if (!session) {
    return res.status(401);
  }
  await auth.invalidateSession(session.sessionId);

  authRequest.setSession(null); // for session cookie

  // redirect back to login page
  return res.status(200).redirect("/");
}
export async function googleOAuthController(
  req: FastifyRequest,
  res: FastifyReply
) {
  const [url, state] = await googleAuth.getAuthorizationUrl();
  const stateCookie = serializeCookie("google_oauth_state", state, {
    httpOnly: true,
    secure: false, // `true` for production
    path: "/",
    maxAge: 60 * 60,
  });

  // console.log(url);
  return res.header("Set-Cookie", stateCookie).redirect(url.toString());
  // auth.createSessionCookie(state);
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

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);
    console.log(googleUser);
    const getUser = async () => {
      const existingUser = await getExistingUser();
      console.log("dsqfqsdfqsdfqsdqsdfqsdfqsdfqsd");
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
    // redirect to profile page
    return res
      .header("Set-Cookie", "google_oauth_state=; Max-Age=0; Path=/;")
      .redirect("/");
  } catch (e) {
    return res.status(500);
  }
}
