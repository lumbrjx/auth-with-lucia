import fastify from "fastify";

const server = fastify({
  logger: false,
});

server.get("/", async (request, reply) => {
  reply.send(request.url);
});

const PORT = parseInt(process.env.PORT ?? "") || 8080;

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
