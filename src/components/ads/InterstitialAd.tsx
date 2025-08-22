import { useEffect } from 'react';
import { useAdMobContext } from './AdMobProvider';

interface InterstitialAdProps {
  trigger?: boolean;
  onAdShown?: () => void;
  onAdFailed?: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({
  trigger = false,
  onAdShown,
  onAdFailed,
}) => {
  const {
    showInterstitial,
    prepareInterstitial,
    interstitialReady,
    isInitialized,
    adsEnabled,
  } = useAdMobContext();

  useEffect(() => {
    const handleInterstitial = async () => {
      if (trigger && isInitialized && adsEnabled && interstitialReady) {
        try {
          const success = await showInterstitial();
          if (success) {
            onAdShown?.();
            // Prepare next interstitial
            setTimeout(() => {
              prepareInterstitial();
            }, 1000);
          } else {
            onAdFailed?.();
          }
        } catch (error) {
          console.error('Interstitial ad error:', error);
          onAdFailed?.();
        }
      }
    };

    handleInterstitial();
  }, [trigger, isInitialized, adsEnabled, interstitialReady, showInterstitial, onAdShown, onAdFailed, prepareInterstitial]);

  // This component doesn't render anything visible
  return null;
};