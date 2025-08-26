import { Question } from '@/data/questions';

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
  gameMode: 'normal' | 'double-speed' | 'misleading';
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

export type GamePhase = 'setup' | 'roundIntro' | 'playing' | 'roundEnd' | 'gameEnd' | 'tiebreaker';

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
  gamePhase: GamePhase;
  roundsPlayed: number;
  isTiebreaker: boolean;
  usedQuestionIds: Set<string>;
}