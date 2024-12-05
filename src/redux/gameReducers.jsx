import { createSlice } from "@reduxjs/toolkit";

const getHighScoreFromLocalStorage = () => {
    const savedScore = localStorage.getItem("highScore");
    return savedScore ? parseInt(savedScore, 10) : 0;
};

const initialState = {
    game: {
        status: "NEW_GAME",
        score: 0,
        highScore: getHighScoreFromLocalStorage(),
    },
};

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        start: (state) => {
            state.game.status = "PLAYING";
            state.game.score = 0;
        },
        gameOver: (state) => {
            state.game.status = "GAME_OVER";
            // Update high score if the current score is higher
            if (state.game.score > state.game.highScore) {
                state.game.highScore = state.game.score;
                localStorage.setItem("highScore", state.game.highScore);
            }
        },
        newGame: (state) => {
            state.game.status = "NEW_GAME";
            state.game.score = 0;
        },
        addScore: (state) => {
            state.game.score += 1;
        },
    },
});

export const { start, gameOver, newGame, addScore } = gameSlice.actions;
export default gameSlice.reducer;
