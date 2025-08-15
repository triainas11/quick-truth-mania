import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, X, Timer, Trophy, Zap } from "lucide-react";
import { GameState } from "@/hooks/useGameLogic";
import { cn } from "@/lib/utils";

interface GamePlayProps {
  gameState: GameState;
  onPlayerAnswer: (playerId: 1 | 2, answer: boolean) => void;
  onNextRound: () => void;
  onEndGame: () => void;
}

const GamePlay = ({ gameState, onPlayerAnswer, onNextRound, onEndGame }: GamePlayProps) => {
  const { 
    players, 
    currentQuestion, 
    currentRound, 
    totalRounds, 
    timeLeft, 
    isActive, 
    lastAnswer,
    settings,
    winner,
    gamePhase,
    roundsPlayed,
    isTiebreaker
  } = gameState;

  useEffect(() => {
    if (gamePhase === 'gameEnd' && !winner && !isTiebreaker) {
      // Handle tie case - this will be handled by the game logic
    } else if (gamePhase === 'gameEnd') {
      // Game is complete
    }
  }, [gamePhase, winner, isTiebreaker]);

  // Game End Screen
  if (gamePhase === 'gameEnd') {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="animate-bounce mb-6">
            <Trophy className="w-24 h-24 text-accent mx-auto" />
          </div>
          
          {winner ? (
            <>
              <h1 className="text-6xl font-black text-white mb-4 animate-pulse">
                🎉 {winner.name} WINS! 🎉
              </h1>
              <div className="text-2xl text-white/90 mb-6">
                {isTiebreaker ? "Tiebreaker Champion!" : "Victory!"}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-black text-white mb-4">
                🤝 IT'S A TIE! 🤝
              </h1>
              <div className="text-2xl text-white/90 mb-6">
                Amazing match!
              </div>
            </>
          )}
          
          <div className="flex justify-center gap-8 mb-8 p-6 bg-white/10 rounded-2xl backdrop-blur">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{players[0].score}</div>
              <div className="text-xl text-white/80">{players[0].name}</div>
              {settings.scoreMode === 'lives' && (
                <div className="text-sm text-white/60">Lives: {players[0].lives || 0}</div>
              )}
            </div>
            <div className="text-6xl text-white/50">VS</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{players[1].score}</div>
              <div className="text-xl text-white/80">{players[1].name}</div>
              {settings.scoreMode === 'lives' && (
                <div className="text-sm text-white/60">Lives: {players[1].lives || 0}</div>
              )}
            </div>
          </div>
          
          <div className="text-lg text-white/80 mb-6">
            Game Stats: {roundsPlayed} rounds played
            {isTiebreaker && " + Tiebreaker"}
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            variant="action" 
            size="lg"
            className="text-xl px-8"
          >
            🔄 Play Again
          </Button>
        </div>
      </div>
    );
  }

  // Tiebreaker Screen
  if (gamePhase === 'tiebreaker') {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-5xl font-black text-white mb-4 animate-pulse">
            ⚡ TIEBREAKER! ⚡
          </h2>
          <div className="text-2xl text-white/90 mb-6">
            Sudden Death Round!
          </div>
          <div className="text-lg text-white/80 mb-8">
            First wrong answer loses!
          </div>
          <Button onClick={onNextRound} variant="action" size="lg" className="text-xl px-8">
            <Zap className="mr-2 w-6 h-6" />
            Start Tiebreaker!
          </Button>
        </div>
      </div>
    );
  }

  // Round Transition Screen
  if (!currentQuestion && gamePhase === 'playing') {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Level {roundsPlayed + 1} of {totalRounds}
          </h2>
          <Button onClick={onNextRound} variant="action" size="lg" className="text-xl px-8">
            <Zap className="mr-2 w-6 h-6" />
            Next Question!
          </Button>
        </div>
      </div>
    );
  }

  const timeProgress = (timeLeft / settings.timeLimit) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg font-bold">
              Level {roundsPlayed + 1}/{totalRounds}
              {isTiebreaker && " - TIEBREAKER"}
            </Badge>
            <div className="flex items-center gap-2 text-white">
              <Timer className="w-5 h-5" />
              <span className="text-xl font-bold">{timeLeft}s</span>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center text-white">
              <div className="text-2xl font-bold">
                {settings.scoreMode === 'lives' ? `❤️ ${players[0].lives}` : players[0].score}
              </div>
              <div className="text-sm opacity-80">{players[0].name}</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold">
                {settings.scoreMode === 'lives' ? `❤️ ${players[1].lives}` : players[1].score}
              </div>
              <div className="text-sm opacity-80">{players[1].name}</div>
            </div>
          </div>
        </div>
        
        <Progress 
          value={timeProgress} 
          className="w-full mt-3 h-2" 
        />
      </div>

      {/* Split Screen Game Area */}
      <div className="grid grid-cols-2 h-[calc(100vh-120px)]">
        {/* Player 1 Side */}
        <div className="gradient-secondary flex flex-col justify-center items-center p-8 relative">
          <div className="absolute top-8 left-8">
            <h3 className="text-3xl font-black text-background">{players[0].name}</h3>
            <div className="text-5xl font-black text-background">
              {settings.scoreMode === 'lives' ? `❤️ ${players[0].lives}` : players[0].score}
            </div>
          </div>
          
          <div className="space-y-6 w-full max-w-md">
            <Button
              onClick={() => onPlayerAnswer(1, true)}
              disabled={!isActive}
              variant="action"
              size="lg"
              className={cn(
                "w-full h-24 text-4xl font-black shadow-energy",
                lastAnswer?.playerId === 1 && lastAnswer?.answer === true && "animate-pulse",
                lastAnswer?.playerId === 1 && lastAnswer?.correct === true && "bg-secondary",
                lastAnswer?.playerId === 1 && lastAnswer?.correct === false && "bg-destructive"
              )}
            >
              <Check className="mr-4 w-8 h-8" />
              YES
            </Button>
            
            <Button
              onClick={() => onPlayerAnswer(1, false)}
              disabled={!isActive}
              variant="destructive"
              size="lg"
              className={cn(
                "w-full h-24 text-4xl font-black",
                lastAnswer?.playerId === 1 && lastAnswer?.answer === false && "animate-pulse",
                lastAnswer?.playerId === 1 && lastAnswer?.correct === true && "bg-secondary",
                lastAnswer?.playerId === 1 && lastAnswer?.correct === false && "bg-destructive"
              )}
            >
              <X className="mr-4 w-8 h-8" />
              NO
            </Button>
          </div>
        </div>

        {/* Player 2 Side */}
        <div className="gradient-accent flex flex-col justify-center items-center p-8 relative">
          <div className="absolute top-8 right-8 text-right">
            <h3 className="text-3xl font-black text-background">{players[1].name}</h3>
            <div className="text-5xl font-black text-background">
              {settings.scoreMode === 'lives' ? `❤️ ${players[1].lives}` : players[1].score}
            </div>
          </div>
          
          <div className="space-y-6 w-full max-w-md">
            <Button
              onClick={() => onPlayerAnswer(2, true)}
              disabled={!isActive}
              variant="action"
              size="lg"
              className={cn(
                "w-full h-24 text-4xl font-black shadow-energy",
                lastAnswer?.playerId === 2 && lastAnswer?.answer === true && "animate-pulse",
                lastAnswer?.playerId === 2 && lastAnswer?.correct === true && "bg-secondary",
                lastAnswer?.playerId === 2 && lastAnswer?.correct === false && "bg-destructive"
              )}
            >
              <Check className="mr-4 w-8 h-8" />
              YES
            </Button>
            
            <Button
              onClick={() => onPlayerAnswer(2, false)}
              disabled={!isActive}
              variant="destructive"
              size="lg"
              className={cn(
                "w-full h-24 text-4xl font-black",
                lastAnswer?.playerId === 2 && lastAnswer?.answer === false && "animate-pulse",
                lastAnswer?.playerId === 2 && lastAnswer?.correct === true && "bg-secondary",
                lastAnswer?.playerId === 2 && lastAnswer?.correct === false && "bg-destructive"
              )}
            >
              <X className="mr-4 w-8 h-8" />
              NO
            </Button>
          </div>
        </div>
      </div>

      {/* Question Display */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-background/95 backdrop-blur-sm border-2 border-primary rounded-2xl p-6 max-w-3xl mx-4 shadow-glow">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-black mb-2 leading-tight">
              {currentQuestion.statement}
            </h2>
            
            {lastAnswer && (
              <div className={cn(
                "text-xl font-bold mt-2 animate-bounce",
                lastAnswer.correct ? "text-secondary" : "text-destructive"
              )}>
                {lastAnswer.correct ? "CORRECT! 🎉" : "WRONG! 💥"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;