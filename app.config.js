module.exports = {
  name: "WeatherApp",
  displayName: "WeatherApp",
  expo: {
    name: "WeatherApp",
    slug: "WeatherApp",
    version: "1.0.0",
    extra: {
      environment: process.env.STAGE,
      version: process.env.APP_VERSION,
      owmappid: "3511b3ec896aaf6fb4a5bd40ca2c2ed5",
    },
    orientation: "portrait",
    icon: "./assets/favicon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/favicon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/favicon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
