import { useState, useEffect } from 'react';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export interface AdMobConfig {
  appId: string;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  rewardedAdUnitId: string;
}

// Test ad unit IDs for development - replace with your actual AdMob unit IDs
const TEST_CONFIG: AdMobConfig = {
  appId: 'ca-app-pub-3940256099942544~3347511713', // Test app ID
  bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111', // Test banner
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test rewarded
};

export const useAdMob = (config: AdMobConfig = TEST_CONFIG) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [interstitialReady, setInterstitialReady] = useState(false);
  const [rewardedReady, setRewardedReady] = useState(false);

  // Initialize AdMob
  useEffect(() => {
    const initializeAdMob = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.log('AdMob: Not running on native platform, skipping initialization');
        return;
      }

      try {
      await AdMob.initialize({
        testingDevices: ['YOUR_TEST_DEVICE_ID'], // Add your test device ID
        initializeForTesting: true,
      });
        setIsInitialized(true);
        console.log('AdMob initialized successfully');
      } catch (error) {
        console.error('Failed to initialize AdMob:', error);
      }
    };

    initializeAdMob();
  }, []);

  // Show banner ad
  const showBanner = async () => {
    if (!isInitialized || !Capacitor.isNativePlatform()) return;

    try {
      const options: BannerAdOptions = {
        adId: config.bannerAdUnitId,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true, // Set to false in production
      };

      await AdMob.showBanner(options);
      setBannerVisible(true);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Failed to show banner:', error);
    }
  };

  // Hide banner ad
  const hideBanner = async () => {
    if (!isInitialized || !Capacitor.isNativePlatform()) return;

    try {
      await AdMob.hideBanner();
      setBannerVisible(false);
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Failed to hide banner:', error);
    }
  };

  // Prepare interstitial ad
  const prepareInterstitial = async () => {
    if (!isInitialized || !Capacitor.isNativePlatform()) return;

    try {
      const options = {
        adId: config.interstitialAdUnitId,
        isTesting: true, // Set to false in production
      };

      await AdMob.prepareInterstitial(options);
      setInterstitialReady(true);
      console.log('Interstitial ad prepared');
    } catch (error) {
      console.error('Failed to prepare interstitial:', error);
    }
  };

  // Show interstitial ad
  const showInterstitial = async (): Promise<boolean> => {
    if (!isInitialized || !interstitialReady || !Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      await AdMob.showInterstitial();
      setInterstitialReady(false);
      console.log('Interstitial ad shown');
      return true;
    } catch (error) {
      console.error('Failed to show interstitial:', error);
      return false;
    }
  };

  // Prepare rewarded ad
  const prepareRewarded = async () => {
    if (!isInitialized || !Capacitor.isNativePlatform()) return;

    try {
      const options: RewardAdOptions = {
        adId: config.rewardedAdUnitId,
        isTesting: true, // Set to false in production
      };

      await AdMob.prepareRewardVideoAd(options);
      setRewardedReady(true);
      console.log('Rewarded ad prepared');
    } catch (error) {
      console.error('Failed to prepare rewarded ad:', error);
    }
  };

  // Show rewarded ad
  const showRewarded = async (): Promise<{ rewarded: boolean; reward?: any }> => {
    if (!isInitialized || !rewardedReady || !Capacitor.isNativePlatform()) {
      return { rewarded: false };
    }

    try {
      const result = await AdMob.showRewardVideoAd();
      setRewardedReady(false);
      console.log('Rewarded ad completed:', result);
      return { rewarded: true, reward: result };
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return { rewarded: false };
    }
  };

  return {
    isInitialized,
    bannerVisible,
    interstitialReady,
    rewardedReady,
    showBanner,
    hideBanner,
    prepareInterstitial,
    showInterstitial,
    prepareRewarded,
    showRewarded,
  };
};