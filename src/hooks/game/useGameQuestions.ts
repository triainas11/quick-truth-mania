import { useCallback } from 'react';
import { Question, getRandomQuestions, resetQuestionHistory } from '@/data/questions';
import { GAME_CONFIG } from '@/constants/game';

export const useGameQuestions = () => {
  const getInitialQuestions = useCallback((rounds: number, category: string): Question[] => {
    resetQuestionHistory(); // Reset question history for new game
    return getRandomQuestions(rounds + 5, category === 'mixed' ? 'mixed' : category); // Extra questions for potential tiebreakers
  }, []);

  const getTiebreakerQuestion = useCallback((
    category: string, 
    usedQuestionIds: Set<string>,
    lastQuestionId?: string
  ): Question => {
    console.log("Getting tiebreaker question - Used question IDs:", Array.from(usedQuestionIds));
    
    // Create a combined set of IDs to exclude
    const excludedIds = new Set(usedQuestionIds);
    if (lastQuestionId) {
      excludedIds.add(lastQuestionId);
    }
    
    // Get extra questions beyond the original game questions for tiebreaker
    const extraQuestions = getRandomQuestions(
      GAME_CONFIG.EXTRA_QUESTIONS_FOR_TIEBREAKER, 
      category === 'mixed' ? 'mixed' : category,
      excludedIds
    );
    
    if (extraQuestions.length === 0) {
      console.error("No fresh questions available for tiebreaker!");
      // Reset question history as last resort and get fresh questions
      resetQuestionHistory();
      const fallbackQuestions = getRandomQuestions(
        GAME_CONFIG.EXTRA_QUESTIONS_FOR_TIEBREAKER, 
        category === 'mixed' ? 'mixed' : category,
        usedQuestionIds // Still exclude used IDs even in fallback
      );
      
      if (fallbackQuestions.length === 0) {
        // Absolute last resort - get any question but still try to avoid used ones
        const absoluteFallback = getRandomQuestions(1, category === 'mixed' ? 'mixed' : category);
        return absoluteFallback[0];
      }
      
      return fallbackQuestions[0];
    }
    
    const tiebreakerQuestion = extraQuestions[0];
    console.log("Selected tiebreaker question:", tiebreakerQuestion.id, "-", tiebreakerQuestion.statement);
    
    return tiebreakerQuestion;
  }, []);

  return {
    getInitialQuestions,
    getTiebreakerQuestion,
  };
};