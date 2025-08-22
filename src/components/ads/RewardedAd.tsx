import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Play } from 'lucide-react';
import { useAdMobContext } from './AdMobProvider';

interface RewardedAdProps {
  onRewardEarned?: (reward: any) => void;
  onAdFailed?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  disabled?: boolean;
}

export const RewardedAd: React.FC<RewardedAdProps> = ({
  onRewardEarned,
  onAdFailed,
  className = '',
  children,
  variant = 'default',
  disabled = false,
}) => {
  const {
    showRewarded,
    prepareRewarded,
    rewardedReady,
    isInitialized,
    adsEnabled,
  } = useAdMobContext();

  const handleWatchAd = async () => {
    if (!isInitialized || !adsEnabled || !rewardedReady) {
      onAdFailed?.();
      return;
    }

    try {
      const result = await showRewarded();
      if (result.rewarded) {
        onRewardEarned?.(result.reward);
        // Prepare next rewarded ad
        setTimeout(() => {
          prepareRewarded();
        }, 1000);
      } else {
        onAdFailed?.();
      }
    } catch (error) {
      console.error('Rewarded ad error:', error);
      onAdFailed?.();
    }
  };

  if (!adsEnabled) {
    return null;
  }

  const isReady = isInitialized && rewardedReady;

  return (
    <Button
      onClick={handleWatchAd}
      disabled={disabled || !isReady}
      variant={variant}
      className={className}
    >
      {children || (
        <>
          <Gift className="w-4 h-4 mr-2" />
          Watch Ad for Reward
          <Play className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
};