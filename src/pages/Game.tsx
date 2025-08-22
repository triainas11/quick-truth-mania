import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameLogic, GameSettings } from "@/hooks/useGameLogic";
import { useAuth } from "@/hooks/useAuth";
import GameSetup from "@/components/game/GameSetup";
import GamePlay from "@/components/game/GamePlay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
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
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 z-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <GameSetup onStartGame={handleStartGame} />
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
      <GamePlay
        gameState={gameState}
        onPlayerAnswer={submitAnswer}
        onNextRound={handleNextRound}
        onEndGame={handleEndGame}
      />
    </div>
  );
};

export default Game;