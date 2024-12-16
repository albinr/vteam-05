import 'dotenv/config'; // Loads variables from .env file

export default {
  expo: {
    name: "user-app",
    slug: "user-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "user-app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    permissions: ["location"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.vteam05.userapp",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY, // Use API key from .env
        },
      },
    },
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY, // Use API key from .env
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.anonymous.userapp",
    },
    web: {
      bundler: "metro",
      output: "single",
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
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "4433a95d-610b-4b02-95dc-caf0d8749aad",
      },
    },
  },
};
