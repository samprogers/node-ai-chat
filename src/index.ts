import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import path from "path";
const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
import {getUserChatResponse, getSystemChatResponse} from './chat.js';

//used for storing if any messages are sent
let messages = [];

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, "../public")));
let initialChat = (async () => {
  const response = await getSystemChatResponse('initial-prompt.json');
  io.emit("chat message", response, 'incoming');
  io.emit("chat message complete");
});
let userChat = (async (msg) => {
  const response = await getUserChatResponse('user-prompt.json', msg);
  io.emit("chat message", response, 'incoming');
  io.emit("chat message complete");
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  if (messages.length == 0) {
    //send initial instruction input to chatgpt
    initialChat();
  }

  socket.on("disconnect", () => {
    console.log("User disconnected");
    messages = [];
  });

  socket.on("chat message", (msg: string, msgType: string) => {
    messages.push(msg);
    io.emit("chat message", msg, 'outgoing');

    //send user input request to chatgpt
    userChat(msg);
  });
});

// routes for frontend assets
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/img/:file", (req, res) => {
  let fileName = req.params.file
  res.sendFile(path.join(__dirname, "../public", fileName));
});

app.get("/css/:file", (req, res) => {
  let fileName = req.params.file
  res.sendFile(path.join(__dirname, "../public", fileName));
});

