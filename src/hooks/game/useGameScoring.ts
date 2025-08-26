import { useCallback } from 'react';
import { Player, GameSettings } from '@/types/game';
import { GAME_CONFIG } from '@/constants/game';
import { soundEffects } from '@/utils/soundEffects';

export const useGameScoring = () => {
  const updatePlayerScore = useCallback((
    players: [Player, Player], 
    playerId: 1 | 2, 
    correct: boolean, 
    settings: GameSettings
  ): [Player, Player] => {
    const newPlayers = [...players] as [Player, Player];
    const playerIndex = playerId - 1;
    const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
    
    if (settings.scoreMode === 'lives') {
      if (!correct) {
        // Wrong answer: lose 1 life, opponent gains 1 point
        newPlayers[playerIndex].lives = Math.max(0, (newPlayers[playerIndex].lives || 0) - 1);
        newPlayers[playerIndex].streak = 0; // Reset streak on wrong answer
        newPlayers[otherPlayerIndex].score += 1; // Opponent gains point automatically
        // Don't reset opponent's streak - they didn't answer
      } else {
        // Correct answer: gain 1 point, no life lost
        newPlayers[playerIndex].score += 1;
        newPlayers[playerIndex].streak += 1;
        // Don't reset opponent's streak - they didn't answer
        
        // Check for streak bonus (5+ correct in a row)
        if (settings.streakBonus && newPlayers[playerIndex].streak >= GAME_CONFIG.STREAK_BONUS_THRESHOLD && 
            newPlayers[playerIndex].streak % GAME_CONFIG.STREAK_BONUS_THRESHOLD === 0) {
          if (settings.soundEffects) {
            soundEffects.playStreak();
          }
        }
      }
    } else {
      // Points mode
      if (correct) {
        let pointsToAdd = 1;
        newPlayers[playerIndex].streak += 1;
        
        // Streak bonus: extra point for every 5 in a row
        if (settings.streakBonus && newPlayers[playerIndex].streak >= GAME_CONFIG.STREAK_BONUS_THRESHOLD && 
            newPlayers[playerIndex].streak % GAME_CONFIG.STREAK_BONUS_THRESHOLD === 0) {
          pointsToAdd += 1; // Bonus point
          if (settings.soundEffects) {
            soundEffects.playStreak();
          }
        }
        
        newPlayers[playerIndex].score += pointsToAdd;
      } else {
        // Reset only the answering player's streak on wrong answer
        newPlayers[playerIndex].streak = 0;
      }
      // Don't reset other player's streak - they didn't answer
    }

    return newPlayers;
  }, []);

  const updatePlayersForTimeout = useCallback((
    players: [Player, Player], 
    settings: GameSettings
  ): [Player, Player] => {
    const newPlayers = [...players] as [Player, Player];
    
    if (settings.scoreMode === 'lives') {
      // Both players lose 1 life for timeout
      newPlayers[0].lives = Math.max(0, (newPlayers[0].lives || 0) - 1);
      newPlayers[1].lives = Math.max(0, (newPlayers[1].lives || 0) - 1);
    }
    
    // Reset both players' streaks on timeout
    newPlayers[0].streak = 0;
    newPlayers[1].streak = 0;
    
    return newPlayers;
  }, []);

  const determineWinner = useCallback((players: [Player, Player], settings: GameSettings): Player | null => {
    const [player1, player2] = players;
    
    if (settings.scoreMode === 'lives') {
      const alivePlayers = players.filter(p => (p.lives || 0) > 0);
      if (alivePlayers.length === 1) {
        return alivePlayers[0];
      }
      // If both alive or both dead, check points then lives
      if (player1.score > player2.score) {
        return player1;
      } else if (player2.score > player1.score) {
        return player2;
      } else {
        // Points tied, check lives
        const player1Lives = player1.lives || 0;
        const player2Lives = player2.lives || 0;
        if (player1Lives > player2Lives) {
          return player1;
        } else if (player2Lives > player1Lives) {
          return player2;
        }
        // Still tied
        return null;
      }
    } else {
      // Points mode
      if (player1.score > player2.score) {
        return player1;
      } else if (player2.score > player1.score) {
        return player2;
      }
      // Tied
      return null;
    }
  }, []);

  return {
    updatePlayerScore,
    updatePlayersForTimeout,
    determineWinner,
  };
};