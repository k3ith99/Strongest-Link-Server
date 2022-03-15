const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

//games index
router.get("/", async (req, res) => {
  try {
    const games = await Game.all;
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Game.leaderboard;
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json(err);
  }
});

//create lobby
router.post("/", async (req, res) => {
  try {
    const lobbyName = req.body.name;
    const hostUsername = req.body.host;
    const options = req.body.options;

    const game = await Game.createGame(lobbyName, hostUsername, options);
    await game.startGame();
    //start game via socketio
    res.status(201).json("Game started");
  } catch (err) {
    res.status(500).json(err);
  }
});

//join lobby
router.post("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    await game.joinGame(req.body.username);
    //connect user to game via socketio
  } catch (err) {
    res.status(404).json(err);
  }
});

//restart game
router.post("/:id/restart", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).updateOptions(
      req.body.options
    );
    await game.startGame();
    //start game via socketio
    res.status(201).send("Game restarted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Game.findById(req.params.id).delete();
    res.status(200).json("Game ended");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
