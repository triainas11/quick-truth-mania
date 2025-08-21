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
    }
  }
};

export default config;