const express = require("express");
const router = express.router();
const Game = require("../Models/Game");

router.get("/", async (req, res) => {
  try {
    const games = await Game.all;
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Game.showLeaderboard;
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id/", async (req, res) => {
  try {
    const game = Game.findById(req.params.id);
    res.status(200).json(game);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    Game.start(req.body.options);
    res.status(201).json("Game created");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:id/restart", async (req, res) => {
  try {
    const game = Game.findById(req.params.id);
    game.start(req.body.options);
    res.status(201).send("Game restarted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
