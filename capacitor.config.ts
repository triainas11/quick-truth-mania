import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.40a2eb24c51140a1b591634e573a6154',
  appName: 'quick-truth-mania',
  webDir: 'dist',
  server: {
    url: 'https://40a2eb24-c511-40a1-b591-634e573a6154.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1a1a2e",
      showSpinner: true,
      spinnerColor: "#8b5cf6"
    },
    AdMob: {
      appId: "ca-app-pub-3940256099942544~3347511713", // Replace with your AdMob App ID
      testingDevices: ["YOUR_TEST_DEVICE_ID"], // Add your test device ID
      initializeForTesting: true
    }
  }
};

export default config;