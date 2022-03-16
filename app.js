const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("http");
const server = createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://amritb.github.io/socketio-client-tool/"
    ]
  }
});
global.io = io;

const gameRoutes = require("./routes/gamesRoutes");
const gameController = require("./controller/gameController");
app.use(cors());
app.use(express.json());
app.use("/games", gameRoutes);
app.get("/", (req, res) => {
  res.send("server is up and running :)");
});

io.on("connection", (socket) => {
  socket.on("startgame", async ({ lobbyName, roomId }) => {
    const game = await gameController.startGame(roomId);
    io.to(lobbyName).emit("game", game);
  });
  socket.on("joinroom", (lobbyName) => {
    socket.join(`${lobbyName}`);
    io.to(lobbyName).emit("game", "sup");
  });
  socket.on("answer", (user, answer) => {
    const response = gameController.makeTurn(
      socket.adapter.rooms[0],
      user,
      answer
    );
    console.log(response);
    io.emit("response", { response });
  });
});

module.exports = server;
