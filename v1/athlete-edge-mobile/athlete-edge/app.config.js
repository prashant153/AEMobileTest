export default {
  expo: {
    name: "athlete-edge",
    slug: "athlete-edge",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "athleteedge",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      supabaseUrl: "https://lztjvmwxoxmrbvqtvirk.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dGp2bXd4b3htcmJ2cXR2aXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODQ2ODAsImV4cCI6MjA2NzI2MDY4MH0.JcMhcf6b8A1gYPcOZWNOSJxNjiSsaQDoRsVTymSLPBo",
      apiBaseUrl: "https://aeadmin-arhuebhyanfud4eq.canadacentral-01.azurewebsites.net",
    },
  },
};

