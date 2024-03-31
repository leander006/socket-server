
import { createServer } from "http"
import {Server} from "socket.io"
import express from 'express'
const app = express();
const httpServer = createServer(app);

import {PORT} from "./config"

app.get("/",(req,res) =>{
  return res.json("Socket server is active 😀😍🥰")
})

httpServer.listen(PORT, async () => {
  console.log(`Backend runnig on port ${PORT}`);
});

//Socket //
const io = new Server(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => {

  socket.on("setup", (userData) => {
    console.log(`user with ${userData?.id} connected`);
    
    socket.join(userData?.id);
    socket.emit("connected",userData?.name);
  });

  socket.on("join room", (room) => {
    console.log("user joined room",room);
    socket.join(room);
  });


  socket.on("send_message", ({messageRecieved,room}) => {
    var chat = messageRecieved;
    
    chat.conversation.users.forEach(async (user:any) => {      
      if (user.userId == messageRecieved.sender.id) return;
      socket.to(room).emit("get_Message",messageRecieved)
    });
  });


});