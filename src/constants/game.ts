// Game timing constants
export const GAME_DELAYS = {
  FIRST_ROUND_START: 5000,      // 5 seconds before first round starts
  ROUND_TRANSITION: 5000,       // 5 seconds for round transition screen
  CORRECT_ANSWER_FEEDBACK: 1500, // 1.5 seconds to show correct answer feedback
  WRONG_ANSWER_FEEDBACK: 2000,   // 2 seconds to show wrong answer feedback  
  SUDDEN_DEATH_FEEDBACK: 1500,   // 1.5 seconds for sudden death feedback
  TIMEOUT_FEEDBACK: 2000,        // 2 seconds to show timeout feedback
} as const;

// Game configuration constants
export const GAME_CONFIG = {
  SUDDEN_DEATH_TIME: 5,          // 5 seconds for sudden death questions
  STREAK_BONUS_THRESHOLD: 5,     // Bonus every 5 correct answers in a row
  EXTRA_QUESTIONS_FOR_TIEBREAKER: 10, // Extra questions to ensure unique tiebreakers
} as const;

// Game phases
export const GAME_PHASES = {
  SETUP: 'setup',
  ROUND_INTRO: 'roundIntro',     // New phase for round transitions
  PLAYING: 'playing',
  ROUND_END: 'roundEnd',
  TIEBREAKER: 'tiebreaker',
  GAME_END: 'gameEnd',
} as const;