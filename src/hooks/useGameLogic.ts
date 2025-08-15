import { useState, useCallback, useRef } from 'react';
import { Question, getRandomQuestions, resetQuestionHistory } from '@/data/questions';

export interface Player {
  id: 1 | 2;
  name: string;
  score: number;
  lives?: number;
}

export interface GameSettings {
  rounds: number;
  category: string;
  gameMode: 'normal' | 'speed' | 'fakeout';
  timeLimit: number;
  scoreMode: 'points' | 'lives';
  maxLives: number;
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
      { id: 1, name: "Player 1", score: 0 },
      { id: 2, name: "Player 2", score: 0 }
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
      maxLives: 3
    },
    gamePhase: 'setup',
    roundsPlayed: 0,
    isTiebreaker: false
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answerLockRef = useRef<{ playerId: 1 | 2; answer: boolean } | null>(null);

  const initializeGame = useCallback((settings: GameSettings) => {
    resetQuestionHistory(); // Reset question history for new game
    const questions = getRandomQuestions(settings.rounds + 3, settings.category === 'all' ? undefined : settings.category); // Extra questions for potential tiebreakers
    
    setGameState(prev => ({
      ...prev,
      settings,
      totalRounds: settings.rounds,
      questions,
      currentRound: 0,
      roundsPlayed: 0,
      players: [
        { 
          id: 1, 
          name: "Player 1", 
          score: 0,
          lives: settings.scoreMode === 'lives' ? settings.maxLives : undefined
        },
        { 
          id: 2, 
          name: "Player 2", 
          score: 0,
          lives: settings.scoreMode === 'lives' ? settings.maxLives : undefined
        }
      ],
      currentQuestion: null,
      winner: null,
      isActive: false,
      lastAnswer: null,
      gamePhase: 'playing',
      isTiebreaker: false
    }));
  }, []);

  const startRound = useCallback(() => {
    if (gameState.currentRound >= gameState.questions.length) {
      endGame();
      return;
    }

    const question = gameState.questions[gameState.currentRound];
    
    setGameState(prev => ({
      ...prev,
      currentQuestion: question,
      timeLeft: prev.settings.timeLimit,
      isActive: true,
      lastAnswer: null,
      gamePhase: 'playing'
    }));

    answerLockRef.current = null;

    // Start timer
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up - both players get it wrong
          clearInterval(timerRef.current!);
          return {
            ...prev,
            timeLeft: 0,
            isActive: false,
            gamePhase: 'roundEnd',
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
  }, [gameState.currentRound, gameState.questions]);

  const submitAnswer = useCallback((playerId: 1 | 2, answer: boolean) => {
    if (!gameState.isActive || !gameState.currentQuestion) return;

    // First player to answer locks it in
    if (!answerLockRef.current) {
      answerLockRef.current = { playerId, answer };
      
      const correct = answer === gameState.currentQuestion.answer;
      
      setGameState(prev => {
        const newPlayers = [...prev.players] as [Player, Player];
        const playerIndex = playerId - 1;
        
        if (prev.settings.scoreMode === 'lives') {
          if (!correct) {
            newPlayers[playerIndex].lives = Math.max(0, (newPlayers[playerIndex].lives || 0) - 1);
          }
        } else {
          // Points mode
          if (correct) {
            newPlayers[playerIndex].score += 1;
          } else {
            newPlayers[playerIndex].score = Math.max(0, newPlayers[playerIndex].score - 1);
          }
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
          
          // Check if game should end
          if (prev.settings.scoreMode === 'lives') {
            const alivePlayers = prev.players.filter(p => (p.lives || 0) > 0);
            if (alivePlayers.length === 1) {
              return {
                ...prev,
                winner: alivePlayers[0],
                gamePhase: 'gameEnd'
              };
            }
          } else if (newRoundsPlayed >= prev.totalRounds) {
            // Game completed, check for winner or tie
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
          lives: prev.settings.scoreMode === 'lives' ? prev.settings.maxLives : undefined
        },
        { 
          id: 2, 
          name: "Player 2", 
          score: 0,
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