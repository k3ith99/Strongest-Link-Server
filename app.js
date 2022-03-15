const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const gameRoutes = require("./routes/gamesRoutes");

app.use("/games", gameRoutes);

app.get("/", (req, res) => {
  res.send("server is up and running :)");
});

module.exports = app;
