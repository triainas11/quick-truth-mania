import { useState } from "react";
import { useGameLogic, GameSettings } from "@/hooks/useGameLogic";
import GameSetup from "@/components/game/GameSetup";
import GamePlay from "@/components/game/GamePlay";

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const { 
    gameState, 
    initializeGame, 
    startRound, 
    submitAnswer, 
    nextRound, 
    endGame,
    resetGame 
  } = useGameLogic();

  const handleStartGame = (settings: GameSettings) => {
    initializeGame(settings);
    setGameStarted(true);
    // Start first round after a short delay
    setTimeout(() => {
      startRound();
    }, 1000);
  };

  const handleNextRound = () => {
    if (gameState.currentRound >= gameState.totalRounds) {
      endGame();
    } else {
      startRound();
    }
  };

  const handleEndGame = () => {
    // Game will automatically show winner screen
    endGame();
  };

  if (!gameStarted) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  return (
    <GamePlay
      gameState={gameState}
      onPlayerAnswer={submitAnswer}
      onNextRound={handleNextRound}
      onEndGame={handleEndGame}
    />
  );
};

export default Game;