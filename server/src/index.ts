import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {

  console.log(`log: user connected here -  ${socket?.id}`);

  socket.on("chat message", (msg) => {
    console.log("log: message added: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("log: user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log("log: listening on *:3000");
});
