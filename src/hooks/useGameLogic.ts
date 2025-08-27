import { useState, useCallback, useRef } from 'react';
import { GameState, GameSettings, LastAnswer, Player } from '@/types/game';
import { useGameTimer } from '@/hooks/game/useGameTimer';
import { useGameScoring } from '@/hooks/game/useGameScoring';
import { useGameQuestions } from '@/hooks/game/useGameQuestions';
import { GAME_CONFIG, GAME_PHASES } from '@/constants/game';
import { soundEffects } from '@/utils/soundEffects';

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
    isTiebreaker: false,
    usedQuestionIds: new Set()
  });

  const { 
    timerRef, 
    clearAllTimers, 
    startGameTimer, 
    startRoundTransition, 
    startAnswerFeedback, 
    startTimeoutFeedback 
  } = useGameTimer();
  
  const { updatePlayerScore, updatePlayersForTimeout, determineWinner } = useGameScoring();
  const { getInitialQuestions, getTiebreakerQuestion } = useGameQuestions();
  
  const answerLockRef = useRef<{ playerId: 1 | 2; answer: boolean } | null>(null);

  const initializeGame = useCallback((settings: GameSettings) => {
    console.log("Initializing game with settings:", settings);
    
    // Auto-set time limit for double-speed mode
    const finalSettings = settings.gameMode === 'double-speed' 
      ? { ...settings, timeLimit: 3 }
      : settings;
    
    const questions = getInitialQuestions(finalSettings.rounds, finalSettings.category);
    
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
        gamePhase: 'roundIntro' as const,
        isTiebreaker: false,
        usedQuestionIds: new Set(questions.map(q => q.id))
      };
      console.log("New game state after initialization:", newState);
      return newState;
    });

    // Do not auto-start - wait for nextRound() or auto-fallback
  }, [startRoundTransition]);

  const startRound = useCallback(() => {
    setGameState(prev => {
      console.log("startRound called - currentRound:", prev.currentRound, "questions.length:", prev.questions.length);
      
      if (prev.currentRound >= prev.questions.length) {
        console.log("No more questions, ending game");
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
        gamePhase: 'playing' as const,
        usedQuestionIds: new Set([...prev.usedQuestionIds, question.id])
      };
    });

    answerLockRef.current = null;

    // Start countdown timer
    startGameTimer(
      () => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            clearAllTimers();
            handleTimeOut();
            return {
              ...prev,
              timeLeft: 0,
              isActive: false,
              gamePhase: 'roundEnd' as const,
              lastAnswer: {
                playerId: 1,
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
      },
      () => {} // Timer completion handled in tick function
    );
  }, [startGameTimer, clearAllTimers]);

  const handleTimeOut = useCallback(() => {
    startTimeoutFeedback(() => {
      setGameState(prevState => {
        const newRoundsPlayed = prevState.roundsPlayed + 1;
        const updatedPlayers = updatePlayersForTimeout(prevState.players, prevState.settings);
        
        // Check if game should end based on lives mode (KO rule)
        if (prevState.settings.scoreMode === 'lives') {
          const alivePlayers = updatedPlayers.filter(p => (p.lives || 0) > 0);
          if (alivePlayers.length <= 1) {
            return {
              ...prevState,
              players: updatedPlayers,
              winner: alivePlayers.length === 1 ? alivePlayers[0] : null,
              gamePhase: 'gameEnd' as const
            };
          }
        }
        
        return checkGameCompletion(prevState, updatedPlayers, newRoundsPlayed);
      });
    });
  }, [startTimeoutFeedback, updatePlayersForTimeout]);

  const submitAnswer = useCallback((playerId: 1 | 2, answer: boolean) => {
    if (!gameState.isActive || !gameState.currentQuestion) return;

    // First player to answer locks it in
    if (!answerLockRef.current) {
      answerLockRef.current = { playerId, answer };
      
      const correct = answer === gameState.currentQuestion.answer;
      
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
        const newPlayers = updatePlayerScore(prev.players, playerId, correct, prev.settings);
        
        return {
          ...prev,
          players: newPlayers,
          isActive: false,
          gamePhase: 'roundEnd' as const,
          lastAnswer: { playerId, answer, correct, timestamp: Date.now() }
        };
      });

      clearAllTimers();

      // Handle sudden death logic - immediate win/lose
      if (gameState.gamePhase === 'tiebreaker') {
        const currentPlayerIndex = playerId - 1;
        const otherPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        
        startAnswerFeedback(() => {
          setGameState(prev => ({
            ...prev,
            winner: correct ? prev.players[currentPlayerIndex] : prev.players[otherPlayerIndex],
            gamePhase: 'gameEnd' as const
          }));
        }, correct, true);
        return;
      }

      // Auto advance after showing feedback
      startAnswerFeedback(() => {
        setGameState(prev => {
          const newRoundsPlayed = prev.roundsPlayed + 1;
          
          // Check if game should end based on lives mode (KO rule)
          if (prev.settings.scoreMode === 'lives') {
            const alivePlayers = prev.players.filter(p => (p.lives || 0) > 0);
            if (alivePlayers.length <= 1) {
              return {
                ...prev,
                winner: alivePlayers.length === 1 ? alivePlayers[0] : null,
                gamePhase: 'gameEnd' as const
              };
            }
          }

          return checkGameCompletion(prev, prev.players, newRoundsPlayed);
        });
      }, correct);
    }
  }, [gameState.isActive, gameState.currentQuestion, gameState.gamePhase, gameState.settings, updatePlayerScore, clearAllTimers, startAnswerFeedback]);

  const checkGameCompletion = useCallback((
    state: GameState, 
    players: [Player, Player], 
    roundsPlayed: number
  ): GameState => {
    // Check if we've completed all rounds
    if (roundsPlayed >= state.totalRounds) {
      console.log("Game completed - checking scores");
      const winner = determineWinner(players, state.settings);
      
      if (winner === null) {
        console.log("Scores tied, going to tiebreaker");
        return {
          ...state,
          players,
          gamePhase: 'tiebreaker' as const
        };
      } else {
        console.log("Winner determined:", winner.name);
        return {
          ...state,
          players,
          winner,
          gamePhase: 'gameEnd' as const
        };
      }
    }

    // Continue to next round
    return {
      ...state,
      players,
      currentRound: state.currentRound + 1,
      roundsPlayed,
      currentQuestion: null,
      gamePhase: 'roundIntro' as const
    };
  }, [determineWinner]);

  const nextRound = useCallback(() => {
    // Prevent multiple calls if game is already ending
    if (gameState.gamePhase === 'gameEnd') {
      return;
    }

    if (gameState.gamePhase === 'tiebreaker') {
      startTiebreaker();
    } else if (gameState.gamePhase === 'roundIntro') {
      startRoundTransition(() => {
        startRound();
      });
    } else if (gameState.roundsPlayed >= gameState.totalRounds) {
      // Use roundsPlayed instead of currentRound for accurate completion check
      endGame();
    } else {
      startRound();
    }
  }, [gameState.gamePhase, gameState.roundsPlayed, gameState.totalRounds, startRound, startRoundTransition]);

  const startTiebreaker = useCallback(() => {
    setGameState(prev => {
      const tiebreakerQuestion = getTiebreakerQuestion(prev.settings.category, prev.usedQuestionIds);
      
      return {
        ...prev,
        currentQuestion: tiebreakerQuestion,
        timeLeft: GAME_CONFIG.SUDDEN_DEATH_TIME,
        isActive: true,
        lastAnswer: null,
        gamePhase: 'playing' as const,
        isTiebreaker: true,
        usedQuestionIds: new Set([...prev.usedQuestionIds, tiebreakerQuestion.id])
      };
    });

    answerLockRef.current = null;

    // Start timer for sudden death
    startGameTimer(
      () => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            clearAllTimers();
            
            // Handle tiebreaker timeout - both players lose
            startTimeoutFeedback(() => {
              setGameState(prevState => {
                // Prevent duplicate endGame calls
                if (prevState.gamePhase === 'gameEnd') {
                  return prevState;
                }
                return {
                  ...prevState,
                  gamePhase: 'gameEnd' as const,
                  winner: null // Both lost
                };
              });
            });
            
            return {
              ...prev,
              timeLeft: 0,
              isActive: false,
              gamePhase: 'roundEnd' as const,
              lastAnswer: {
                playerId: 1,
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
      },
      () => {} // Timer completion handled in tick function
    );
  }, [getTiebreakerQuestion, startGameTimer, clearAllTimers, startTimeoutFeedback]);

  const endGame = useCallback(() => {
    // Prevent multiple endGame calls
    if (gameState.gamePhase === 'gameEnd') {
      return;
    }

    console.log("endGame called, current gameState:", gameState);
    const winner = determineWinner(gameState.players, gameState.settings);

    console.log("endGame setting winner:", winner);

    setGameState(prev => ({
      ...prev,
      winner,
      isActive: false,
      gamePhase: 'gameEnd' as const
    }));

    clearAllTimers();
  }, [gameState.gamePhase, gameState.players, gameState.settings, determineWinner, clearAllTimers]);

  const resetGame = useCallback(() => {
    console.log("resetGame called - clearing all state");
    clearAllTimers();
    answerLockRef.current = null;
    
    // Reset question history to ensure fresh questions for new games
    const { resetQuestionHistory } = require('@/data/questions');
    resetQuestionHistory();
    
    setGameState({
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
      gamePhase: 'setup' as const,
      roundsPlayed: 0,
      isTiebreaker: false,
      usedQuestionIds: new Set()
    });
  }, [clearAllTimers]);

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