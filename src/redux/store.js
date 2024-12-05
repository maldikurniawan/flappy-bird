import { configureStore } from "@reduxjs/toolkit";
import birdReducers from "./birdReducers";
import gameReducers from './gameReducers'
import pipeReducers from "./pipeReducers";


export const store = configureStore({
    reducer: {
        game: gameReducers,
        bird: birdReducers,
        pipe: pipeReducers
    }
})