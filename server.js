const fastify = require("fastify");
const fastifyIO = require("fastify-socket.io");
const fastifyCors = require("@fastify/cors");
const server = fastify({ logger: true });
const PORT = 3030;

server.register(fastifyCors, {
  origin: "*",

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

server.register(fastifyIO, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

server.get("/", (request, reply) => {
  console.log("테스트테스트");
  //   server.io.emit("hello");
  return reply.send("aaa");
});

server.ready().then(() => {
  server.io.on("connection", (socket) => {
    console.log("connect");
    socket.join("channel1");
    socket.on("send-message", (arg1, callback) => {
      console.log("arg1", arg1);
      callback({
        status: "ok",
      });
      socket.to("channel1").emit("receive-message", arg1);
    });
  });
});

server.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`Server running on port:${PORT}`);
});
