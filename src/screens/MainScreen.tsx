import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Image } from "react-native";
import { useSelector } from "react-redux";
import {
  getCurrentWeatherData,
  rateLimitExcedeed,
} from "../api/openWeatherMap";
import { Screen, Text } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { HomeTabScreenProps } from "../navigation/screens";
import { languageState, userState } from "../reducers/store";

import { useTw } from "../theme";
import { WeatherResponse } from "../types";
import { showToast } from "../utils";

const openWeatherMapImageBaseUrl = "https://openweathermap.org/img/wn";

export function MainScreen({ navigation }: HomeTabScreenProps<"MainScreen">) {
  const tw = useTw();
  const { name, cities } = useSelector(userState);
  const { code: langCode } = useSelector(languageState);
  const [weather, setWeather] = useState<{
    [cityName: string]: WeatherResponse;
  }>({});

  const CityItem = ({
    cityName,
    weatherResponse,
  }: {
    cityName: String;
    weatherResponse: WeatherResponse;
  }) => {
    const icon = weatherResponse.weather[0].icon;
    return (
      <TouchableOpacity
        style={tw`m-sm p-md flex-row justify-between border-[1px] border-black rounded-lg`}
        onPress={() =>
          navigation.navigate("WeatherDetailScreen", {
            city: cities.find((city) => city.name === cityName),
          })
        }
      >
        <View style={tw`justify-center`}>
          <Text textStyle={tw`text-4xl`}>{cityName}</Text>
          <Text>{new Date().toLocaleDateString(langCode)}</Text>
        </View>
        {!!icon && (
          <Image
            style={tw`w-[100px] h-[100px]`}
            source={{
              uri: `${openWeatherMapImageBaseUrl}/${icon}@2x.png`,
            }}
          />
        )}
        <Text
          style={tw`justify-center`}
          textStyle={tw`text-5xl`}
        >{`${Math.floor(weatherResponse.main.temp)}°`}</Text>
      </TouchableOpacity>
    );
  };

  const ScreenContent = useCallback(
    () => (
      <View>
        <Header />
        <Text style={tw`mt-xl`} textStyle={tw`text-4xl`} bold>
          {name}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={Object.keys(weather)}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: city }) => (
            <CityItem cityName={city} weatherResponse={weather[city]} />
          )}
        />
      </View>
    ),
    [name, weather]
  );

  const Header = useCallback(
    () => (
      <Text style={tw`mt-xl`} textStyle={tw`text-4xl`} bold>
        {"l.profile"}
      </Text>
    ),
    []
  );

  const fetchWeatherData = async () => {
    try {
      Promise.all(
        cities
          .filter((city) => !weather[city.name])
          .map((city) => {
            getCurrentWeatherData(city.lat, city.lon, langCode).then(
              (response) =>
                setWeather((weather) => ({
                  ...weather,
                  [city.name]: response,
                }))
            );
          })
      );
    } catch (e) {
      if (rateLimitExcedeed(e))
        return showToast(i18n.t("errors.rateLimitExcedeed"));
    }
  };

  useEffect(() => {
    if (!cities) return;
    fetchWeatherData();
  }, [cities]);

  return (
    <Screen>
      <View style={tw`h-full items-center`}>
        <ScreenContent />
      </View>
    </Screen>
  );
}
