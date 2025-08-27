import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameLogic } from "@/hooks/useGameLogic";
import type { GameSettings } from "@/types/game";
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
    // Ensure clean state before starting new game
    resetGame();
    initializeGame(settings);
    setGameStarted(true);
    // Game logic now handles the 5-second delay automatically
  };

  // Remove local handler - pass nextRound directly to ensure proper transitions

  const handleEndGame = () => {
    // Game will automatically show winner screen
    endGame();
  };

  // Cleanup on component unmount or navigation away
  useEffect(() => {
    return () => {
      resetGame();
    };
  }, [resetGame]);

  if (!gameStarted) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetGame(); // Clean up game state when going back
            navigate("/");
          }}
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
          onClick={() => {
            resetGame(); // Clean up game state when going back
            navigate("/");
          }}
          className="absolute top-4 left-4 z-10"
        >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
      <GamePlay
        gameState={gameState}
        onPlayerAnswer={submitAnswer}
        onNextRound={nextRound}
        onEndGame={handleEndGame}
      />
    </div>
  );
};

export default Game;