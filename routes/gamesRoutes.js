const express = require("express");
const router = express.Router();

const gameController = require("../controller/gameController");

router.get("/leaderboard", gameController.leaderboard);

router.get("/", gameController.index);
<<<<<<< HEAD
router.get("/:id/restart", gameController.restart);
=======
router.get("/:name", gameController.show);
>>>>>>> 0dc54e0e63d8706356254c3ecc308819737f3377
router.post("/", gameController.create);
router.post("/:name", gameController.join);
router.delete("/:id", gameController.deleteGame);

module.exports = router;
