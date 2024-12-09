import React, { useEffect, useRef, useState } from "react";
import Bird from "./Bird";
import ForeGround from "./ForeGround";
import Pipe from "./Pipe";
import { useDispatch, useSelector } from "react-redux";
import { addScore, gameOver, start } from "../redux/gameReducers";
import { fly, fall, birdReset } from "../redux/birdReducers";
import { generatePipe, pipeReset, pipeRun } from "../redux/pipeReducers";

let gameLoop;
let pipeGenerator;

export default function Game() {
    const dispatch = useDispatch();
    const { game } = useSelector((state) => state.game);
    const { bird } = useSelector((state) => state.bird);
    const { pipes, startPosition } = useSelector((state) => state.pipe);
    const wingRef = useRef(null);
    const scareRef = useRef(null);
    const hitRef = useRef(null);
    const pointRef = useRef(null);
    const backgroundMusicRef = useRef(null);
    const [isEasterEgg, setIsEasterEgg] = useState(false);
    const [hasEasterEggOccurred, setHasEasterEggOccurred] = useState(false); // Track if the Easter egg has occurred

    function startGameLoop() {
        gameLoop = setInterval(() => {
            dispatch(fall());
            dispatch(pipeRun());
        }, 150);

        pipeGenerator = setInterval(() => {
            dispatch(generatePipe());
            dispatch(addScore());
            pointRef.current.play();
        }, 3000);
    }

    function stopGameLoop() {
        clearInterval(gameLoop);
        clearInterval(pipeGenerator);
    }

    const handleClick = () => {
        if (game.status === "PLAYING" && !isEasterEgg) {
            dispatch(fly());
            wingRef.current.play();
        }
    };

    const newGameHandler = () => {
        setIsEasterEgg(false);
        setHasEasterEggOccurred(false); // Reset Easter egg flag when starting a new game
        startGameLoop();
        dispatch(start());
        backgroundMusicRef.current.play(); // Start playing background music
    };

    const resumeGameHandler = () => {
        setIsEasterEgg(false);
        startGameLoop();
        backgroundMusicRef.current.play();
    };

    useEffect(() => {
        if (game.status === "GAME_OVER") {
            stopGameLoop();
            backgroundMusicRef.current.pause(); // Stop background music
            backgroundMusicRef.current.currentTime = 0; // Reset the music
        } else if (game.score === 20 && !hasEasterEggOccurred) {
            setIsEasterEgg(true);
            setHasEasterEggOccurred(true); // Set the flag to true after Easter egg occurs
            stopGameLoop();
            backgroundMusicRef.current.pause();
        } else {
            const x = startPosition.x;
            const challenge = pipes
                .map(({ height }, i) => ({
                    x1: x + i * 200,
                    y1: height,
                    x2: x + i * 200,
                    y2: height + 100,
                }))
                .filter(({ x1 }) => x1 > 0 && x1 < 288);

            if (bird.y > 512 - 108) {
                dispatch(gameOver());
                dispatch(birdReset());
                dispatch(pipeReset());
                hitRef.current.play();
            }

            if (challenge.length) {
                const { x1, y1, x2, y2 } = challenge[0];
                if (
                    (x1 < 150 && 150 < x1 + 52 && bird.y < y1) ||
                    (x2 < 150 && 150 < x2 + 52 && bird.y > y2)
                ) {
                    hitRef.current.play();
                    dispatch(gameOver());
                    dispatch(birdReset());
                    dispatch(pipeReset());
                }
            }
        }
    }, [game.status, game.score, startPosition.x, hasEasterEggOccurred]);

    useEffect(() => {
        return () => {
            // Cleanup: stop music when component unmounts
            backgroundMusicRef.current.pause();
            backgroundMusicRef.current.currentTime = 0;
        };
    }, []);

    useEffect(() => {
        if (isEasterEgg && scareRef.current) {
            scareRef.current.play(); // Play sound when the Easter egg is triggered
        }
    }, [isEasterEgg]);

    return (
        <div className="game-div" onClick={handleClick}>
            <audio ref={backgroundMusicRef} src="assets/music/sound.mp3" loop></audio>
            <audio ref={hitRef} src="assets/music/hit.mp3"></audio>
            <audio ref={pointRef} src="assets/music/point.mp3"></audio>
            <audio ref={wingRef} src="assets/music/wing.mp3"></audio>

            {isEasterEgg && (
                <div className="easter-egg-overlay flex flex-col items-center justify-center bg-black bg-opacity-75 fixed top-0 left-0 w-full h-full">
                    <audio ref={scareRef} src="assets/music/jumpscare.mp3"></audio>
                    <img
                        src="assets/images/ghost.png"
                        alt="Ghost"
                        className="w-full mb-4"
                    />
                    <button
                        className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
                        onClick={resumeGameHandler}
                    >
                        Continue
                    </button>
                </div>
            )}

            {game.status === "NEW_GAME" && (
                <>
                    <img
                        className="w-40 mx-auto cursor-pointer hover:scale-110 transition-transform duration-300"
                        src="assets/images/start-button.png"
                        onClick={newGameHandler}
                        alt="Start Button"
                    />
                    <Bird />
                </>
            )}
            {game.status === "GAME_OVER" && (
                <>
                    <div className="relative flex flex-col items-center justify-center h-screen bg-black bg-opacity-50">
                        <img
                            className="w-52 cursor-pointer hover:scale-110 transition-transform duration-300"
                            src="assets/images/start-button.png"
                            onClick={newGameHandler}
                            alt="Start Button"
                        />
                        <h2 className="absolute top-24 text-white text-2xl font-bold">
                            Game Over
                        </h2>
                        <div
                            className="absolute top-40 left-1/2 transform -translate-x-1/2 py-4 px-6 rounded-md flex items-center justify-center"
                            style={{ width: '300px' }}
                        >
                            {/* Your Score */}
                            <div className="flex-1 text-center">
                                <h2 className="text-white text-sm font-semibold">Your Score:</h2>
                                <span className="text-yellow-300 text-2xl font-bold">{game.score}</span>
                            </div>

                            {/* High Score */}
                            <div className="flex-1 text-center">
                                <h2 className="text-white text-sm font-semibold">High Score:</h2>
                                <span className="text-orange-300 text-2xl font-bold">{game.highScore}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {game.status === "PLAYING" && !isEasterEgg && (
                <>
                    <Bird />
                    <Pipe />
                    <ForeGround />
                    <h2
                        className="text-white font-bold text-xl"
                        style={{ position: "absolute", top: 50, left: 150 }}
                    >
                        {game.score}
                    </h2>
                </>
            )}
        </div>
    );
}
