import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
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
import { Palette } from "../theme/palette";
import { CurrentWeather } from "../types";
import { LocalizedDateFormat, showToast } from "../utils";

const openWeatherMapImageBaseUrl = "https://openweathermap.org/img/wn";

export function MainScreen({ navigation }: HomeTabScreenProps<"MainScreen">) {
  const tw = useTw();
  const { name, cities } = useSelector(userState);
  const { code: langCode } = useSelector(languageState);
  const [currentWeather, setCurrentWeather] = useState<{
    [cityName: string]: CurrentWeather;
  }>({});
  const [refreshing, setRefreshing] = useState<boolean>(true);

  useEffect(() => {
    if (!langCode) return;
    moment.locale(langCode);
  }, [langCode]);

  const CityItem = useCallback(
    ({ cityName }: { cityName: string }) => {
      const icon = currentWeather[cityName].weather[0].icon;
      return (
        <LinearGradient
          style={tw`mb-md p-md rounded-lg`}
          colors={[Palette.detailStartBlue, Palette.detailEndBlue]}
        >
          <TouchableOpacity
            style={tw`w-full flex-row justify-between`}
            onPress={() =>
              navigation.navigate("WeatherDetailScreen", {
                cityName: cityName,
                currentWeather: currentWeather[cityName],
              })
            }
          >
            <View style={tw`flex-1 justify-start`}>
              <Text textStyle={tw`text-2xl`} textWhite>
                {cityName}
              </Text>
              <Text textWhite>
                {moment(new Date()).format(LocalizedDateFormat[langCode])}
              </Text>
            </View>
            {!!icon && (
              <Image
                style={tw`w-[100px] h-[100px] flex-1`}
                source={{
                  uri: `${openWeatherMapImageBaseUrl}/${icon}@2x.png`,
                }}
              />
            )}
            <Text
              style={tw`flex-1 pr-xs justify-center items-end`}
              textStyle={tw`text-5xl`}
              textWhite
            >{`${Math.floor(currentWeather[cityName].main.temp)}°`}</Text>
          </TouchableOpacity>
        </LinearGradient>
      );
    },
    [langCode, currentWeather]
  );

  const ScreenContent = useCallback(
    () => (
      <View style={tw`items-center`}>
        <Header />
        <Text style={tw`mt-xl`} textStyle={tw`text-4xl`} bold>
          {name}
        </Text>
        <FlatList
          style={tw`h-full`}
          showsVerticalScrollIndicator={false}
          data={Object.keys(currentWeather)}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setCurrentWeather({});
              }}
            />
          }
          renderItem={({ item: city }) => (
            <View style={tw`px-md`}>
              <CityItem cityName={city} />
            </View>
          )}
        />
      </View>
    ),
    [name, currentWeather]
  );

  const Header = useCallback(
    () => (
      <Text style={tw`mt-xl`} textStyle={tw`text-4xl`} bold>
        {"l.profile"}
      </Text>
    ),
    []
  );

  const fetchWeatherData = () => {
    try {
      Promise.all(
        cities
          .filter((city) => !currentWeather[city.name])
          .map((city) =>
            getCurrentWeatherData(city.lat, city.lon, langCode).then(
              (response) =>
                setCurrentWeather((weather) => ({
                  ...weather,
                  [city.name]: response,
                }))
            )
          )
      );
    } catch (e) {
      if (rateLimitExcedeed(e))
        return showToast(i18n.t("errors.rateLimitExcedeed"));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!cities || !refreshing) return;
    fetchWeatherData();
  }, [cities, refreshing]);

  return (
    <Screen>
      <View style={tw`h-full items-center`}>
        <ScreenContent />
      </View>
    </Screen>
  );
}
