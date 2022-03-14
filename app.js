const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const gameRoutes = require("./controller/gameController");

app.use("/games", gameRoutes);

app.get("/", (req, res) => {
  res.send("server is up and running :)");
});

module.exports = app;
