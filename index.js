const app = require("./app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`Express just departed from port ${port}!`);
});

io.on("connection", (socket) => {
  console.log("User connected"); // runs when client first connects
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message", (message) => {
    console.log(message);
  });
});
