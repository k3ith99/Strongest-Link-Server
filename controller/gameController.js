const Game = require("../Models/Game");

//get leaderboard
async function leaderboard(req, res) {
  try {
    const leaderboard = await Game.leaderboard;
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json(err);
  }
}

//games index
async function index(req, res) {
  try {
    const games = await Game.all;
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json(err);
  }
}

//create lobby
async function create(req, res) {
  try {
    const lobbyName = req.body.name;
    const hostUsername = req.body.host;
    const options = req.body.options;
    const game = await Game.createGame(lobbyName, hostUsername, options);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json(err);
  }
}

//join lobby
async function join(req, res) {
  try {
    const game = await Game.findById(req.params.id);
    await game.joinGame(req.body.username);
    res.status(200).json(game);
  } catch (err) {
    res.status(404).json(err);
  }
}

//restart game
async function restart(req, res) {
  try {
    const game = await Game.findById(req.params.id);
    await game.startGame();
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function deleteGame(req, res) {
  try {
    const game = await Game.findById(req.params.id);
    await game.delete();
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  leaderboard, index, create, join, restart, deleteGame
};
