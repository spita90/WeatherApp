import Constants from "expo-constants";

interface Config {
  environment?: string;
  version?: string;
  openWeatherMapAppId?: string;
}

export const config: Config = {
  environment: Constants.expoConfig!.extra?.environment,
  version: Constants.expoConfig!.extra?.version,
  openWeatherMapAppId: Constants.expoConfig!.extra?.owmappid,
};
