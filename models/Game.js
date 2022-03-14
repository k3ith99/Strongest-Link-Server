const gamesData = [];

class Game {
    constructor(data){
        for(let key in data) {
            // change this later
            this[key] = data[key];
        }
    }

    static get all() {
        return new Promise(async (resolve, reject) => {
            try {
                const games = gamesData.map(game => new Game(game));
                resolve(games);
            } catch (err) {
                reject(err);
            }
        });
    }

    static findById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const gameData = gamesData.find(game => game.id === id);
                if(!gameData) throw new Error("Game not found.");
                resolve(new Game(gameData));
            } catch (err) {
                reject(err);
            }
        });
    };

    static get leaderboard() {
        return new Promise(async (resolve, reject) => {
            try {
                // db request to get scores
                resolve(1);
            } catch (err) {
                reject(err);
            }
        });
    }

    static createGame(name, host, options){
        return new Promise(async (resolve, reject) => {
            try {
                const nameExists = !!gamesData.find(game => game.name === name);
                if(nameExists) throw new Error("Sorry that room name is taken.");

                const maxId = Math.max(...gamesData.map(game => game.id));
                const newId = maxId < 0 ? 0 : maxId + 1;

                const newGame = {
                    id: newId,
                    name,
                    options,
                    host,
                    players: [host],
                    questions: null,
                    scores: {},
                    turn: 0,
                    round: 0
                };

                gamesData.push(newGame);
                resolve(new Game(newGame));
            } catch (err) {
                reject(err);
            }
        });
    }

    updateOptions(newOptions){
        this.options = newOptions;
    }

    startGame(){
        return new Promise(async (resolve, reject) => {
            try {
                // trivia api request
                this.turn = 0;
                this.round = 0;
                resolve(this);
            } catch (err) {
                reject(err);
            }
        });
    }
    
    joinGame(user){
        return new Promise(async (resolve, reject) => {
            try {
                //get more questions from trivia db
                this.players.push(user);
            } catch (err) {
                reject(err);
            }
        });
    }

    delete(){
        return new Promise(async (resolve, reject) => {
            try {
                const index = gamesData(game => game.id === this.id);
                if(index < 0) throw new Error("Game no longer exists.");
                gamesData.splice(index, 1);
                resolve("Game successfully deleted.");
            } catch (err) {
                reject(err);
            }
        });
    }
}