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
    console.log("Last question ID to exclude:", lastQuestionId);
    
    // Create a combined set of IDs to exclude - includes all used questions AND the last question
    const excludedIds = new Set(usedQuestionIds);
    if (lastQuestionId) {
      excludedIds.add(lastQuestionId);
    }
    
    console.log("Total excluded IDs:", Array.from(excludedIds));
    
    // Get extra questions beyond the original game questions for tiebreaker
    // Use a larger pool to ensure we have fresh questions available
    const extraQuestions = getRandomQuestions(
      GAME_CONFIG.EXTRA_QUESTIONS_FOR_TIEBREAKER * 2, // Double the pool for better randomization
      category === 'mixed' ? 'mixed' : category,
      excludedIds
    );
    
    console.log("Available tiebreaker questions:", extraQuestions.length);
    
    if (extraQuestions.length === 0) {
      console.error("No fresh questions available for tiebreaker!");
      // Reset question history as last resort and get fresh questions
      resetQuestionHistory();
      const fallbackQuestions = getRandomQuestions(
        GAME_CONFIG.EXTRA_QUESTIONS_FOR_TIEBREAKER, 
        category === 'mixed' ? 'mixed' : category,
        excludedIds // Still exclude used IDs even in fallback
      );
      
      if (fallbackQuestions.length === 0) {
        // Absolute last resort - get any question but still try to avoid used ones
        const absoluteFallback = getRandomQuestions(1, category === 'mixed' ? 'mixed' : category);
        console.warn("Using absolute fallback question");
        return absoluteFallback[0];
      }
      
      const selectedFallback = fallbackQuestions[0];
      console.log("Using fallback tiebreaker question:", selectedFallback.id);
      return selectedFallback;
    }
    
    // Shuffle the available questions and pick the first one for maximum randomness
    const shuffledQuestions = [...extraQuestions].sort(() => Math.random() - 0.5);
    const tiebreakerQuestion = shuffledQuestions[0];
    
    console.log("Selected tiebreaker question:", tiebreakerQuestion.id, "-", tiebreakerQuestion.statement);
    
    // Double-check that we didn't select an excluded question
    if (excludedIds.has(tiebreakerQuestion.id)) {
      console.error("CRITICAL: Selected question was in excluded list! This should not happen.");
      // Try the next question in the shuffled list
      for (let i = 1; i < shuffledQuestions.length; i++) {
        if (!excludedIds.has(shuffledQuestions[i].id)) {
          console.log("Using alternative question:", shuffledQuestions[i].id);
          return shuffledQuestions[i];
        }
      }
    }
    
    return tiebreakerQuestion;
  }, []);

  return {
    getInitialQuestions,
    getTiebreakerQuestion,
  };
};