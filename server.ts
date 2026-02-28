import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res).catch((err: unknown) => {
      console.error("Error handling request", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    });
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
      credentials: true,
    },
  });

  // Make io available to tRPC routers via global
  (globalThis as Record<string, unknown>).socketIo = io;

  io.on("connection", (socket) => {
    socket.on("join:restaurant", () => {
      void socket.join("restaurant");
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err: unknown) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
