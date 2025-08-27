import { useRef, useCallback } from 'react';
import { GAME_DELAYS } from '@/constants/game';

export const useGameTimer = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (roundTransitionTimerRef.current) {
      clearTimeout(roundTransitionTimerRef.current);
      roundTransitionTimerRef.current = null;
    }
  }, []);

  const startGameTimer = useCallback((onTick: () => void, onComplete: () => void) => {
    timerRef.current = setInterval(() => {
      onTick();
    }, 1000);
  }, []);

  const startRoundTransition = useCallback((onComplete: () => void, isFirstRound: boolean = false) => {
    const delay = isFirstRound ? GAME_DELAYS.FIRST_ROUND_START : GAME_DELAYS.ROUND_TRANSITION;
    roundTransitionTimerRef.current = setTimeout(() => {
      onComplete();
    }, delay);
  }, []);

  const startAnswerFeedback = useCallback((onComplete: () => void, correct: boolean, isSuddenDeath: boolean = false) => {
    let delay: number;
    
    if (isSuddenDeath) {
      delay = GAME_DELAYS.SUDDEN_DEATH_FEEDBACK;
    } else if (correct) {
      delay = GAME_DELAYS.CORRECT_ANSWER_FEEDBACK;
    } else {
      delay = GAME_DELAYS.WRONG_ANSWER_FEEDBACK;
    }

    roundTransitionTimerRef.current = setTimeout(() => {
      onComplete();
    }, delay);
  }, []);

  const startTimeoutFeedback = useCallback((onComplete: () => void) => {
    roundTransitionTimerRef.current = setTimeout(() => {
      onComplete();
    }, GAME_DELAYS.TIMEOUT_FEEDBACK);
  }, []);

  return {
    timerRef,
    clearAllTimers,
    startGameTimer,
    startRoundTransition,
    startAnswerFeedback,
    startTimeoutFeedback,
  };
};