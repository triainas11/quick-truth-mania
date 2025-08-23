import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAdMob, AdMobConfig } from '@/hooks/useAdMob';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

interface AdMobContextType {
  isInitialized: boolean;
  bannerVisible: boolean;
  interstitialReady: boolean;
  rewardedReady: boolean;
  showBanner: () => Promise<void>;
  hideBanner: () => Promise<void>;
  prepareInterstitial: () => Promise<void>;
  showInterstitial: () => Promise<boolean>;
  prepareRewarded: () => Promise<void>;
  showRewarded: () => Promise<{ rewarded: boolean; reward?: any }>;
  adsEnabled: boolean;
}

const AdMobContext = createContext<AdMobContextType | undefined>(undefined);

interface AdMobProviderProps {
  children: ReactNode;
  config?: AdMobConfig;
}

export const AdMobProvider: React.FC<AdMobProviderProps> = ({ children, config }) => {
  const adMob = useAdMob(config);
  const { user } = useAuth();
  const { subscriptionData } = useSubscription();
  
  // Ads are disabled if user has an active subscription
  const adsEnabled = !subscriptionData.subscribed;

  useEffect(() => {
    // Prepare ads when AdMob is initialized
    if (adMob.isInitialized && adsEnabled) {
      adMob.prepareInterstitial();
      adMob.prepareRewarded();
    }
  }, [adMob.isInitialized, adsEnabled]);

  const contextValue: AdMobContextType = {
    ...adMob,
    adsEnabled,
  };

  return (
    <AdMobContext.Provider value={contextValue}>
      {children}
    </AdMobContext.Provider>
  );
};

export const useAdMobContext = (): AdMobContextType => {
  const context = useContext(AdMobContext);
  if (!context) {
    throw new Error('useAdMobContext must be used within an AdMobProvider');
  }
  return context;
};