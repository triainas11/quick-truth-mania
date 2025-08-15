import { useState, useCallback, useRef } from 'react';
import { Question, getRandomQuestions } from '@/data/questions';

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
}

export interface GameState {
  players: [Player, Player];
  currentQuestion: Question | null;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  isActive: boolean;
  winner: Player | null;
  lastAnswer: { playerId: 1 | 2; answer: boolean; correct: boolean } | null;
  questions: Question[];
  settings: GameSettings;
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
      timeLimit: 10
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answerLockRef = useRef<{ playerId: 1 | 2; answer: boolean } | null>(null);

  const initializeGame = useCallback((settings: GameSettings) => {
    const questions = getRandomQuestions(settings.rounds, settings.category === 'all' ? undefined : settings.category);
    
    setGameState(prev => ({
      ...prev,
      settings,
      totalRounds: settings.rounds,
      questions,
      currentRound: 0,
      players: [
        { id: 1, name: "Player 1", score: 0 },
        { id: 2, name: "Player 2", score: 0 }
      ],
      currentQuestion: null,
      winner: null,
      isActive: false,
      lastAnswer: null
    }));
  }, []);

  const startRound = useCallback(() => {
    if (gameState.currentRound >= gameState.totalRounds) {
      endGame();
      return;
    }

    const question = gameState.questions[gameState.currentRound];
    
    setGameState(prev => ({
      ...prev,
      currentQuestion: question,
      timeLeft: prev.settings.timeLimit,
      isActive: true,
      lastAnswer: null
    }));

    answerLockRef.current = null;

    // Start timer
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up!
          clearInterval(timerRef.current!);
          return {
            ...prev,
            timeLeft: 0,
            isActive: false
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);
  }, [gameState.currentRound, gameState.totalRounds, gameState.questions, gameState.settings.timeLimit]);

  const submitAnswer = useCallback((playerId: 1 | 2, answer: boolean) => {
    if (!gameState.isActive || !gameState.currentQuestion) return;

    // First player to answer locks it in
    if (!answerLockRef.current) {
      answerLockRef.current = { playerId, answer };
      
      const correct = answer === gameState.currentQuestion.answer;
      
      setGameState(prev => {
        const newPlayers = [...prev.players] as [Player, Player];
        const playerIndex = playerId - 1;
        
        if (correct) {
          newPlayers[playerIndex].score += 1;
        } else {
          newPlayers[playerIndex].score = Math.max(0, newPlayers[playerIndex].score - 1);
        }

        return {
          ...prev,
          players: newPlayers,
          isActive: false,
          lastAnswer: { playerId, answer, correct }
        };
      });

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Auto advance to next round after showing result
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentRound: prev.currentRound + 1
        }));
      }, 2000);
    }
  }, [gameState.isActive, gameState.currentQuestion]);

  const nextRound = useCallback(() => {
    if (gameState.currentRound >= gameState.totalRounds) {
      endGame();
    } else {
      startRound();
    }
  }, [gameState.currentRound, gameState.totalRounds, startRound]);

  const endGame = useCallback(() => {
    const [player1, player2] = gameState.players;
    let winner: Player | null = null;
    
    if (player1.score > player2.score) {
      winner = player1;
    } else if (player2.score > player1.score) {
      winner = player2;
    }

    setGameState(prev => ({
      ...prev,
      winner,
      isActive: false
    }));

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [gameState.players]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setGameState(prev => ({
      ...prev,
      currentRound: 0,
      players: [
        { id: 1, name: "Player 1", score: 0 },
        { id: 2, name: "Player 2", score: 0 }
      ],
      currentQuestion: null,
      isActive: false,
      winner: null,
      lastAnswer: null
    }));
  }, []);

  return {
    gameState,
    initializeGame,
    startRound,
    submitAnswer,
    nextRound,
    resetGame,
    endGame
  };
};