import React, { useEffect } from 'react';
import { useAdMobContext } from './AdMobProvider';

interface BannerAdProps {
  className?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ className = '' }) => {
  const { showBanner, hideBanner, isInitialized, adsEnabled } = useAdMobContext();

  useEffect(() => {
    if (isInitialized && adsEnabled) {
      showBanner();
    }

    // Cleanup: hide banner when component unmounts
    return () => {
      if (adsEnabled) {
        hideBanner();
      }
    };
  }, [isInitialized, adsEnabled, showBanner, hideBanner]);

  // Don't render anything - the banner is handled natively
  if (!adsEnabled) {
    return null;
  }

  return (
    <div className={`h-12 bg-muted/20 flex items-center justify-center text-xs text-muted-foreground ${className}`}>
      {/* Placeholder for banner ad space */}
      <span>Advertisement</span>
    </div>
  );
};