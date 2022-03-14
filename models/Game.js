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

    static get leaderboard() {
        
    }

    static createGame(){

    }

    updateOptions(){
        
    }

    startGame(){

    }
    
    joinGame(user){

    }

    delete(){

    }
}