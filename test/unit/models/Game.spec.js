const Game = require("../../../models/Game");

const axios = require("axios");
jest.mock("axios");

const sampleTokenResponse = {
    "response_code": 0,
    "response_message": "Token Generated Successfully!",
    "token": "789e12907772f5e8d66fcd30efd03a16d56ed6060b0fb0b1e76a8292966c3e4f"
};

const sampleQuestionResponse = {
    "response_code": 0,
    "results": [
        {
            "category": "General%20Knowledge", "type": "multiple", "difficulty": "medium",
            "question": "Which%20language%20is%20NOT%20Indo-European%3F",
            "correct_answer": "Hungarian",
            "incorrect_answers": ["Russian","Greek","Latvian"]
        }, 
        {
            "category": "General%20Knowledge", "type": "multiple", "difficulty": "medium", 
            "question": "What%20is%20the%20last%20letter%20of%20the%20Greek%20alphabet%3F", 
            "correct_answer": "Omega", 
            "incorrect_answers": ["Mu", "Epsilon", "Kappa"] 
        }, 
        { 
            "category": "General%20Knowledge", "type": "multiple", "difficulty": "medium", 
            "question": "Which%20iconic%20Disneyland%20attraction%20was%20closed%20in%202017%20to%20be%20remodeled%20as%20a%20%22Guardians%20of%20the%20Galaxy%22%20themed%20ride%3F", 
            "correct_answer": "Twilight%20Zone%20Tower%20of%20Terror", 
            "incorrect_answers": ["The%20Haunted%20Mansion", "Pirates%20of%20the%20Caribbean", "Peter%20Pan%27s%20Flight"] 
        }, 
        {
            "category": "General%20Knowledge", 
            "type": "multiple", "difficulty": "medium", 
            "question": "Whose%20greyscale%20face%20is%20on%20the%20kappa%20emoticon%20on%20Twitch%3F", 
            "correct_answer": "Josh%20DeSeno", 
            "incorrect_answers": ["Justin%20DeSeno", "John%20DeSeno", "Jimmy%20DeSeno"] 
        }, { 
            "category": "General%20Knowledge", "type": "multiple", "difficulty": "medium", 
            "question": "Frank%20Lloyd%20Wright%20was%20the%20architect%20behind%20what%20famous%20building%3F", 
            "correct_answer": "The%20Guggenheim", 
            "incorrect_answers": ["Villa%20Savoye", "Sydney%20Opera%20House", "The%20Space%20Needle"] 
        }
    ]
};

axios.get.mockImplementation((url) => {
    return new Promise((resolve, reject) => {
        if(url === "https://opentdb.com/api_token.php?command=request"){
            resolve({
                data: sampleTokenResponse
            });
        }else if(url.includes("api.php?amount=5")){
            resolve({
                data: sampleQuestionResponse
            });
        }else{
            reject(new Error());
        }
    });
});

describe("Game Model", () => {
    const testOptions = {
        category: 9,
        level: "medium",
        totalQuestions: 5
    };

    let expectedGame = {
        id: 0,
        name: "test_name",
        options: {...testOptions, level: "easy"},
        host: "test_user",
        players: ["test_user"],
        questions: null,
        token: null,
        currentQuestion: 0,
        scores: {},
        active: false
    };

    let gameInstance;

    it("can create a game", async () => {
        const game = await Game.createGame("test_name", "test_user", {...testOptions, level: "easy"});
        expect(game).toMatchObject(expectedGame);
    });

    it("can get a list of all games", async () => {
        const games = await Game.all;
        expect(games).toHaveLength(1);
        expect(games[0]).toMatchObject(expectedGame);
    });

    it("can find a game by id", async () => {
        gameInstance = await Game.findById(0);
        expect(gameInstance).toMatchObject(expectedGame);
    });

    it("can update options", async () => {
        gameInstance.updateOptions(testOptions);
        expectedGame.options = testOptions;
        expect(gameInstance).toMatchObject(expectedGame);
    });

    it("can join a user to a game", async () => {
        await gameInstance.joinGame("test_user2");
        expectedGame.players.push("test_user2");
        expect(gameInstance.players).toHaveLength(2);
        expect(gameInstance).toMatchObject(expectedGame);
    });

    it("throws an error when getting questions without a token", async () => {
        await expect(
            gameInstance.getQuestions(5)
        ).rejects.toThrow();
    });

    it("can send an API request and get a token", async () => {
        const response = await gameInstance.getToken();
        expect(axios.get).toHaveBeenCalledWith("https://opentdb.com/api_token.php?command=request");
        expect(response).toBe(sampleTokenResponse.token);
        expectedGame.token = response;
    });

    it("can send an API request and get questions", async () => {
        gameInstance.token = sampleTokenResponse.token;
        const response = await gameInstance.getQuestions(5);
        expect(axios.get).toHaveBeenCalledWith(
            `https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple&token=${sampleTokenResponse.token}&encode=url3986`
        );
        expect(response).toMatchObject(sampleQuestionResponse.results);
        gameInstance.token = null;
        expectedGame.questions = response;
    });

    it("can start the game", async () => {
        axios.get.mockClear();
        const game = await gameInstance.startGame();
        expectedGame.scores = {
            "test_user": 0,
            "test_user2": 0
        };
        expectedGame.active = true;
        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(game).toMatchObject(expectedGame);
    });

    it("throws an error if user makes a move on the wrong turn", async () => {
        await expect(
            gameInstance.makeTurn("test_user2", "")
        ).rejects.toThrow();
    });

    it("advances game state when user chooses correct answer", async () => {
        await gameInstance.makeTurn("test_user", "Hungarian");
        expectedGame.scores["test_user"] = 1;
        expectedGame.currentQuestion = 1;
        expect(gameInstance).toMatchObject(expectedGame);
    });

    it("advances game state when user chooses incorrect answer", async () => {
        await gameInstance.makeTurn("test_user2", "Hungarian");
        expectedGame.currentQuestion = 2;
        expect(gameInstance).toMatchObject(expectedGame);
    });

    it("responds with the correct object on correct answer", async () => {
        const response = await gameInstance.makeTurn("test_user", "Twilight Zone Tower of Terror");
        expectedGame.scores["test_user"] = 2;
        expectedGame.currentQuestion = 3;
        expect(response).toMatchObject({
            gameEnd: false, correct: true
        });
    });

    it("responds with the correct object on incorrect answer", async () => {
        const response = await gameInstance.makeTurn("test_user2", "Hungarian");
        expectedGame.currentQuestion = 4;
        expect(response).toMatchObject({
            gameEnd: false, correct: false
        });
    });

    it("has the correct response and game state on final turn", async () => {
        const response = await gameInstance.makeTurn("test_user", "Hungarian");
        expectedGame.active = false;
        expect(gameInstance).toMatchObject(expectedGame);
        expect(response).toMatchObject({
            gameEnd: true, correct: false
        });
    });

    it("can delete a game", async () => {
        await gameInstance.delete();
        const games = await Game.all;
        expect(games).toHaveLength(0);
    });
});
