const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("http");
const server = createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});
global.io = io;
const gameRoutes = require("./controller/gameController");

app.use(cors());
app.use(express.json());
app.use("/games", gameRoutes);
app.get("/", (req, res) => {
  res.send("server is up and running :)");
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("startgame", () => {
    console.log(socket.id);
  });
  socket.on("createroom", (lobbyName) => {
    socket.join(`${lobbyName}`);
  });
  socket.on("joinroom", (lobbyName) => {
    socket.join(`${lobbyName}`);
  });
});

module.exports = server;
