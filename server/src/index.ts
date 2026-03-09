import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

//#region Event names
const userRegistered = "user:register";
const chatMessage = "chat:message";
//#endregion

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`log connected-${socket?.id}`);


  socket.on(userRegistered, (username) => {
    socket.data = {
      username
    };

    io.emit(userRegistered, username);
  });

  socket.on(chatMessage, (msg) => {
    io.emit(chatMessage, 
    {
      userId: socket.id, 
      message: msg,
      username: socket?.data?.username
    });

  });

  socket.on("disconnect", () => {
    console.log("log: user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log("log: listening on *:3000");
});
