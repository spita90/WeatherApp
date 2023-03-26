import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { CurrentWeather } from "../types";

export type RootStackParamList = {
  MainScreen: undefined;
  WeatherDetailScreen: {
    cityName: string;
    currentWeather: CurrentWeather;
  };
};

export type HomeTabParamList = {
  MainStack: undefined;
  SearchScreen: undefined;
  LocationScreen: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
