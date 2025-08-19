import { useState, useCallback, useRef } from 'react';
import { Question, getRandomQuestions, resetQuestionHistory } from '@/data/questions';
import { soundEffects } from '@/utils/soundEffects';

export interface Player {
  id: 1 | 2;
  name: string;
  score: number;
  lives?: number;
  streak: number;
}

export interface GameSettings {
  rounds: number;
  category: string;
  gameMode: 'normal' | 'speed' | 'fakeout' | 'double-speed' | 'misleading';
  timeLimit: number;
  scoreMode: 'points' | 'lives';
  maxLives: number;
  streakBonus: boolean;
  soundEffects: boolean;
  buttonShuffle: boolean;
}

export interface LastAnswer {
  playerId: 1 | 2;
  answer: boolean;
  correct: boolean;
  timestamp: number;
}

export interface GameState {
  players: [Player, Player];
  currentQuestion: Question | null;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  isActive: boolean;
  winner: Player | null;
  lastAnswer: LastAnswer | null;
  questions: Question[];
  settings: GameSettings;
  gamePhase: 'setup' | 'playing' | 'roundEnd' | 'gameEnd' | 'tiebreaker';
  roundsPlayed: number;
  isTiebreaker: boolean;
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [
      { id: 1, name: "Player 1", score: 0, streak: 0 },
      { id: 2, name: "Player 2", score: 0, streak: 0 }
    ],
    currentQuestion: null,
    currentRound: 0,
    totalRounds: 5,
    timeLeft: 10,
    isActive: false,
    winner: null,
    lastAnswer: null,
    questions: [],
    settings: {
      rounds: 5,
      category: 'general',
      gameMode: 'normal',
      timeLimit: 10,
      scoreMode: 'points',
      maxLives: 3,
      streakBonus: true,
      soundEffects: true,
      buttonShuffle: false
    },
    gamePhase: 'setup',
    roundsPlayed: 0,
    isTiebreaker: false
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answerLockRef = useRef<{ playerId: 1 | 2; answer: boolean } | null>(null);

  const initializeGame = useCallback((settings: GameSettings) => {
    console.log("Initializing game with settings:", settings);
    resetQuestionHistory(); // Reset question history for new game
    
    // Auto-set time limit for double-speed mode
    const finalSettings = settings.gameMode === 'double-speed' 
      ? { ...settings, timeLimit: 3 }
      : settings;
    
    const questions = getRandomQuestions(finalSettings.rounds + 3, finalSettings.category === 'all' ? undefined : finalSettings.category); // Extra questions for potential tiebreakers
    
    setGameState(prev => {
      const newState = {
        ...prev,
        settings: finalSettings,
        totalRounds: finalSettings.rounds,
        questions,
        currentRound: 0,
        roundsPlayed: 0,
        players: [
          { 
            id: 1 as const, 
            name: "Player 1", 
            score: 0,
            streak: 0,
            lives: finalSettings.scoreMode === 'lives' ? finalSettings.maxLives : undefined
          },
          { 
            id: 2 as const, 
            name: "Player 2", 
            score: 0,
            streak: 0,
            lives: finalSettings.scoreMode === 'lives' ? finalSettings.maxLives : undefined
          }
        ] as [Player, Player],
        currentQuestion: null,
        winner: null,
        isActive: false,
        lastAnswer: null,
        gamePhase: 'playing' as const,
        isTiebreaker: false
      };
      console.log("New game state after initialization:", newState);
      return newState;
    });
  }, []);

  const startRound = useCallback(() => {
    setGameState(prev => {
      console.log("startRound called - currentRound:", prev.currentRound, "questions.length:", prev.questions.length);
      
      if (prev.currentRound >= prev.questions.length) {
        console.log("No more questions, calling endGame");
        // Don't call endGame here, just return current state - handle this in the component
        return {
          ...prev,
          gamePhase: 'gameEnd' as const
        };
      }

      const question = prev.questions[prev.currentRound];
      
      return {
        ...prev,
        currentQuestion: question,
        timeLeft: prev.settings.timeLimit,
        isActive: true,
        lastAnswer: null,
        gamePhase: 'playing' as const
      };
    });

    answerLockRef.current = null;

    // Start timer
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up - both players get it wrong
          clearInterval(timerRef.current!);
          
          // Auto advance after showing feedback
          setTimeout(() => {
            setGameState(prevState => {
              const newRoundsPlayed = prevState.roundsPlayed + 1;
              
              // Check if we've completed all rounds (only for points mode)
              if (prevState.settings.scoreMode === 'points' && newRoundsPlayed >= prevState.totalRounds) {
                const [player1, player2] = prevState.players;
                if (player1.score === player2.score) {
                  return {
                    ...prevState,
                    isTiebreaker: true,
                    gamePhase: 'tiebreaker'
                  };
                } else {
                  const winner = player1.score > player2.score ? player1 : player2;
                  return {
                    ...prevState,
                    winner,
                    gamePhase: 'gameEnd'
                  };
                }
              }

              // Continue to next round
              return {
                ...prevState,
                currentRound: prevState.currentRound + 1,
                roundsPlayed: newRoundsPlayed,
                currentQuestion: null,
                gamePhase: 'playing'
              };
            });
          }, 2000); // Show feedback for 2 seconds
          
          return {
            ...prev,
            timeLeft: 0,
            isActive: false,
            gamePhase: 'roundEnd' as const,
            lastAnswer: {
              playerId: 1, // Arbitrary since both failed
              answer: false,
              correct: false,
              timestamp: Date.now()
            }
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);
  }, []);

  const submitAnswer = useCallback((playerId: 1 | 2, answer: boolean) => {
    if (!gameState.isActive || !gameState.currentQuestion) return;

    // First player to answer locks it in
    if (!answerLockRef.current) {
      answerLockRef.current = { playerId, answer };
      
      // Check if we're in reverse logic mode (fakeout) or misleading mode
      const isReverseLogic = gameState.settings.gameMode === 'fakeout';
      const isMisleadingMode = gameState.settings.gameMode === 'misleading';
      let correct: boolean;
      
      if (isReverseLogic) {
        // In reverse logic mode, wrong answer is correct
        correct = answer !== gameState.currentQuestion.answer;
      } else if (isMisleadingMode) {
        // Misleading mode uses questions from "misleading" category with complex phrasing
        correct = answer === gameState.currentQuestion.answer;
      } else {
        // Normal mode
        correct = answer === gameState.currentQuestion.answer;
      }
      
      // Play sound effects
      if (gameState.settings.soundEffects) {
        soundEffects.setSoundEnabled(true);
        if (correct) {
          soundEffects.playCorrect();
        } else {
          soundEffects.playWrong();
        }
      }
      
      setGameState(prev => {
        const newPlayers = [...prev.players] as [Player, Player];
        const playerIndex = playerId - 1;
        const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
        
        if (prev.settings.scoreMode === 'lives') {
          if (!correct) {
            newPlayers[playerIndex].lives = Math.max(0, (newPlayers[playerIndex].lives || 0) - 1);
            newPlayers[playerIndex].streak = 0; // Reset streak on wrong answer
          } else {
            newPlayers[playerIndex].streak += 1;
            // Check for streak bonus (5+ correct in a row)
            if (prev.settings.streakBonus && newPlayers[playerIndex].streak >= 5 && newPlayers[playerIndex].streak % 5 === 0) {
              if (prev.settings.soundEffects) {
                soundEffects.playStreak();
              }
            }
          }
          // Reset other player's streak
          newPlayers[otherPlayerIndex].streak = 0;
        } else {
          // Points mode
          if (correct) {
            let pointsToAdd = 1;
            newPlayers[playerIndex].streak += 1;
            
            // Streak bonus: extra point for every 5 in a row
            if (prev.settings.streakBonus && newPlayers[playerIndex].streak >= 5 && newPlayers[playerIndex].streak % 5 === 0) {
              pointsToAdd += 1; // Bonus point
              if (prev.settings.soundEffects) {
                soundEffects.playStreak();
              }
            }
            
            // Button shuffle score multiplier (10% bonus)
            if (prev.settings.buttonShuffle) {
              pointsToAdd = Math.ceil(pointsToAdd * 1.1);
            }
            
            newPlayers[playerIndex].score += pointsToAdd;
          } else {
            newPlayers[playerIndex].score = Math.max(0, newPlayers[playerIndex].score - 1);
            newPlayers[playerIndex].streak = 0; // Reset streak on wrong answer
          }
          // Reset other player's streak
          newPlayers[otherPlayerIndex].streak = 0;
        }

        return {
          ...prev,
          players: newPlayers,
          isActive: false,
          gamePhase: 'roundEnd',
          lastAnswer: { playerId, answer, correct, timestamp: Date.now() }
        };
      });

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Auto advance after showing feedback (immediate for correct, brief delay for wrong)
      const delay = correct ? 1500 : 2000;
      setTimeout(() => {
        setGameState(prev => {
          const newRoundsPlayed = prev.roundsPlayed + 1;
          
          // Check if game should end based on lives mode
          if (prev.settings.scoreMode === 'lives') {
            const alivePlayers = prev.players.filter(p => (p.lives || 0) > 0);
            if (alivePlayers.length === 1) {
              return {
                ...prev,
                winner: alivePlayers[0],
                gamePhase: 'gameEnd'
              };
            }
          }

          // Check if we've completed all rounds (only for points mode)
          if (prev.settings.scoreMode === 'points' && newRoundsPlayed >= prev.totalRounds) {
            const [player1, player2] = prev.players;
            if (player1.score === player2.score) {
              return {
                ...prev,
                isTiebreaker: true,
                gamePhase: 'tiebreaker'
              };
            } else {
              const winner = player1.score > player2.score ? player1 : player2;
              return {
                ...prev,
                winner,
                gamePhase: 'gameEnd'
              };
            }
          }

          // Continue to next round
          return {
            ...prev,
            currentRound: prev.currentRound + 1,
            roundsPlayed: newRoundsPlayed,
            currentQuestion: null,
            gamePhase: 'playing'
          };
        });
      }, delay);
    }
  }, [gameState.isActive, gameState.currentQuestion]);

  const nextRound = useCallback(() => {
    if (gameState.gamePhase === 'tiebreaker') {
      startTiebreaker();
    } else if (gameState.currentRound >= gameState.totalRounds) {
      endGame();
    } else {
      startRound();
    }
  }, [gameState.currentRound, gameState.totalRounds, gameState.gamePhase]);

  const startTiebreaker = useCallback(() => {
    const tiebreakerQuestion = gameState.questions[gameState.currentRound];
    setGameState(prev => ({
      ...prev,
      currentQuestion: tiebreakerQuestion,
      timeLeft: prev.settings.timeLimit,
      isActive: true,
      lastAnswer: null,
      gamePhase: 'playing'
    }));

    answerLockRef.current = null;

    // Start timer for tiebreaker
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          return {
            ...prev,
            timeLeft: 0,
            isActive: false,
            gamePhase: 'gameEnd',
            winner: null // Still a tie
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);
  }, [gameState.questions, gameState.currentRound]);

  const endGame = useCallback(() => {
    console.log("endGame called, current gameState:", gameState);
    const [player1, player2] = gameState.players;
    let winner: Player | null = null;
    
    if (gameState.settings.scoreMode === 'lives') {
      const alivePlayers = gameState.players.filter(p => (p.lives || 0) > 0);
      if (alivePlayers.length === 1) {
        winner = alivePlayers[0];
      }
    } else {
      if (player1.score > player2.score) {
        winner = player1;
      } else if (player2.score > player1.score) {
        winner = player2;
      }
      // winner stays null for ties
    }

    console.log("endGame setting winner:", winner, "scores:", player1.score, player2.score);

    setGameState(prev => ({
      ...prev,
      winner,
      isActive: false,
      gamePhase: 'gameEnd'
    }));

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [gameState.players, gameState.settings.scoreMode]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    resetQuestionHistory();
    
    setGameState(prev => ({
      ...prev,
      currentRound: 0,
      roundsPlayed: 0,
      players: [
        { 
          id: 1, 
          name: "Player 1", 
          score: 0,
          streak: 0,
          lives: prev.settings.scoreMode === 'lives' ? prev.settings.maxLives : undefined
        },
        { 
          id: 2, 
          name: "Player 2", 
          score: 0,
          streak: 0,
          lives: prev.settings.scoreMode === 'lives' ? prev.settings.maxLives : undefined
        }
      ],
      currentQuestion: null,
      isActive: false,
      winner: null,
      lastAnswer: null,
      gamePhase: 'setup',
      isTiebreaker: false
    }));
  }, []);

  return {
    gameState,
    initializeGame,
    startRound,
    submitAnswer,
    nextRound,
    resetGame,
    endGame,
    startTiebreaker
  };
};