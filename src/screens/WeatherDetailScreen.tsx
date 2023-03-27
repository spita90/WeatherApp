import { Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { openWeatherMapImageBaseUrl } from "../../App";
import { AddCityButton, AddCityModal, Screen, Text } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { RootStackScreenProps } from "../navigation/screens";
import { languageState } from "../reducers/store";
import { useTw } from "../theme";
import { WeatherType } from "../types";
import { BG_VARIANTS, capitalize, LocalizedDateFormat } from "../utils";

interface HourlyForecast {
  time: Date;
  temp: number;
}

interface DailyForecast {
  time: Date;
  temp: number;
  weatherType: WeatherType;
  icon: string;
}

const MOCKED_DAILY_FORECASTS_ICONS: { [weatherType in WeatherType]: string } = {
  [WeatherType.Thunderstorm]: "11d",
  [WeatherType.Drizzle]: "09d",
  [WeatherType.Rain]: "10d",
  [WeatherType.Snow]: "13d",
  [WeatherType.Atmosphere]: "50d",
  [WeatherType.Clear]: "01d",
  [WeatherType.Clouds]: "03d",
};

export function WeatherDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"WeatherDetailScreen">) {
  const tw = useTw();
  const { code: langCode } = useSelector(languageState);
  const [addCityModalIsOpen, setAddCityModalOpen] = useState<boolean>(false);
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecast[]>();
  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>();

  const { cityName, currentWeather } = route.params;
  const icon = currentWeather.weather[0].icon;

  const mockHourlyForecasts = () => {
    const now = new Date();
    let hourlyForecasts: HourlyForecast[] = [];
    for (let i = 1; i + now.getHours() < 24; i++) {
      hourlyForecasts.push({
        time: moment(now).add(i, "hours").toDate(),
        temp: currentWeather.main.temp + Math.floor(Math.random() * 6) - 3,
      });
    }
    return hourlyForecasts;
  };

  const mockDailyForecasts = () => {
    const now = new Date();
    let dailyForecasts: DailyForecast[] = [];
    for (let i = 1; i < 7; i++) {
      const weatherType =
        Object.keys(WeatherType)[
          Math.floor(Math.random() * Object.keys(WeatherType).length)
        ];
      dailyForecasts.push({
        time: moment(now).add(i, "days").toDate(),
        temp: currentWeather.main.temp + Math.floor(Math.random() * 6) - 3,
        // @ts-ignore
        weatherType: weatherType,
        // @ts-ignore
        icon: MOCKED_DAILY_FORECASTS_ICONS[weatherType],
      });
    }
    return dailyForecasts;
  };

  useEffect(() => {
    setHourlyForecasts(mockHourlyForecasts());
    setDailyForecasts(mockDailyForecasts);
  }, []);

  return (
    <Screen>
      <LinearGradient
        style={tw`h-full grow items-center`}
        colors={[
          BG_VARIANTS[currentWeather.weather[0].main].start,
          BG_VARIANTS[currentWeather.weather[0].main].end,
        ]}
      >
        <ScrollView style={tw`w-full`} showsVerticalScrollIndicator={false}>
          <View style={tw`flex-row pt-sm items-center justify-between`}>
            <TouchableOpacity
              style={tw`p-xl`}
              onPress={() => {
                navigation.canGoBack() && navigation.goBack();
              }}
            >
              <Octicons name="arrow-left" size={32} color={"white"} />
            </TouchableOpacity>
            <Text textWhite textStyle={tw`text-[36px]`}>
              {cityName}
            </Text>
            <TouchableOpacity
              style={tw`p-xl`}
              onPress={() => setAddCityModalOpen(true)}
            >
              <AddCityButton />
            </TouchableOpacity>
          </View>
          <View>
            <View style={tw`items-center`}>
              <Text textWhite size="lg">
                {moment(new Date()).format(LocalizedDateFormat[langCode])}
              </Text>
              <Text style={tw`mt-lg`} size="lg" color="white/60">
                {capitalize(currentWeather.weather[0].description)}
              </Text>
              {!!icon && (
                <View style={tw`flex-row`}>
                  <Image
                    style={tw`w-[150px] h-[150px]`}
                    source={{
                      uri: `${openWeatherMapImageBaseUrl}/${icon}@4x.png`,
                    }}
                  />
                  <Text
                    style={tw`justify-center`}
                    textStyle={tw`text-8xl`}
                    textWhite
                  >{`${Math.floor(currentWeather.main.temp)}°`}</Text>
                </View>
              )}
            </View>
            <View style={tw`px-lg`}>
              {hourlyForecasts && (
                <View>
                  <LinearGradient
                    style={tw`absolute top-[46%] left-[46px] h-6px w-full`}
                    colors={["white", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[
                      { time: new Date(), temp: currentWeather.main.temp },
                      ...hourlyForecasts,
                    ]}
                    renderItem={({ item: hourlyForecast, index }) => {
                      const firstItem = index === 0;
                      return (
                        <View
                          style={tw`w-[70px] mx-sm justify-between items-center`}
                        >
                          <Text
                            style={tw`h-[30px] justify-end`}
                            size={firstItem ? "tt" : "md"}
                            color={firstItem ? "white" : "white/60"}
                          >
                            {firstItem
                              ? i18n.t("l.now")
                              : hourlyForecast.time.getHours()}
                          </Text>
                          <View
                            style={tw`h-[20px] w-[20px] my-[10px] bg-white rounded-[10px]`}
                          />
                          <Text
                            style={tw`h-[30px] justify-start`}
                            size={firstItem ? "lg" : "md"}
                            color={firstItem ? "white" : "white/60"}
                          >{`${Math.floor(hourlyForecast.temp)}°`}</Text>
                        </View>
                      );
                    }}
                  />
                </View>
              )}
              {dailyForecasts && (
                <FlatList
                  style={tw`mt-xl`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={dailyForecasts}
                  renderItem={({ item: dailyForecast }) => (
                    <View
                      style={tw`w-[150px] mx-sm mb-xl p-md justify-between items-center rounded-xl bg-[${
                        BG_VARIANTS[dailyForecast.weatherType].end
                      }] shadow-lg`}
                    >
                      <Text textWhite size="tt">{`${moment(
                        dailyForecast.time
                      ).format("dddd")}`}</Text>
                      <Text
                        style={tw`mt-sm`}
                        textWhite
                        size="xl"
                      >{`${Math.floor(dailyForecast.temp)}°`}</Text>
                      <Image
                        style={tw`w-[100px] h-[100px]`}
                        source={{
                          uri: `${openWeatherMapImageBaseUrl}/${dailyForecast.icon}@2x.png`,
                        }}
                      />
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <AddCityModal
        visible={addCityModalIsOpen}
        setVisible={setAddCityModalOpen}
        onCitySuccessfullyAdded={() => navigation.goBack()}
      />
    </Screen>
  );
}
