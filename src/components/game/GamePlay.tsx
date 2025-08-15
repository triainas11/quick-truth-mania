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
    winner
  } = gameState;

  useEffect(() => {
    if (currentRound >= totalRounds && !winner) {
      onEndGame();
    }
  }, [currentRound, totalRounds, winner, onEndGame]);

  if (winner !== null) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-bounce mb-6">
            <Trophy className="w-24 h-24 text-accent mx-auto" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4">
            {winner ? `${winner.name} WINS!` : "IT'S A TIE!"}
          </h1>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{players[0].score}</div>
              <div className="text-xl text-white/80">{players[0].name}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{players[1].score}</div>
              <div className="text-xl text-white/80">{players[1].name}</div>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="action" 
            size="lg"
            className="text-xl px-8"
          >
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Round {currentRound + 1} of {totalRounds}
          </h2>
          <Button onClick={onNextRound} variant="action" size="lg" className="text-xl px-8">
            <Zap className="mr-2 w-6 h-6" />
            Start Round!
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
              Round {currentRound + 1}/{totalRounds}
            </Badge>
            <div className="flex items-center gap-2 text-white">
              <Timer className="w-5 h-5" />
              <span className="text-xl font-bold">{timeLeft}s</span>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center text-white">
              <div className="text-2xl font-bold">{players[0].score}</div>
              <div className="text-sm opacity-80">{players[0].name}</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold">{players[1].score}</div>
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
            <div className="text-5xl font-black text-background">{players[0].score}</div>
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
            <div className="text-5xl font-black text-background">{players[1].score}</div>
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