import fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();
const server = fastify({
  logger: false,
});

server.register(import("./domains/auth/auth.route.js")); // credentials auth routes
server.register(import("./domains/admin/admin.route.js"));
server.get("/", async (request, reply) => {
  reply.send(request.headers);
});

const PORT = parseInt(process.env.PORT ?? "") || 8080;

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
