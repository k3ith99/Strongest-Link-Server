const app = require("./app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});
const socketController = require("./controller/socketController");

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`Express just departed from port ${port}!`);
});

io.on("connection", socketController.respond); // runs when client first connects
