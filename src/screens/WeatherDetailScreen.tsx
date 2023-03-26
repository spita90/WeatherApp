import { Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { openWeatherMapImageBaseUrl } from "../../App";
import { AddCityButton, AddCityModal, Screen, Text } from "../components";
import { RootStackScreenProps } from "../navigation/screens";
import { languageState } from "../reducers/store";
import { useTw } from "../theme";
import { WeatherType } from "../types";
import {
  BG_VARIANTS,
  capitalize,
  getRandomEnum,
  LocalizedDateFormat,
} from "../utils";

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

const MOCKED_DAILY_FORECASTS_ICONS = [
  "01d",
  "02d",
  "03d",
  "04d",
  "09d",
  "10d",
  "11d",
  "13d",
  "50d",
];

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
        temp:
          Math.floor(currentWeather.main.temp) +
          Math.floor(Math.random() * 6) -
          3,
      });
    }
    return hourlyForecasts;
  };

  const mockDailyForecasts = () => {
    const now = new Date();
    let dailyForecasts: DailyForecast[] = [];
    for (let i = 1; i < 7; i++) {
      dailyForecasts.push({
        time: moment(now).add(i, "days").toDate(),
        temp:
          Math.floor(currentWeather.main.temp) +
          Math.floor(Math.random() * 6) -
          3,
        weatherType: getRandomEnum(WeatherType),
        icon: MOCKED_DAILY_FORECASTS_ICONS[
          Math.floor(Math.random() * MOCKED_DAILY_FORECASTS_ICONS.length)
        ],
      });
    }
    return dailyForecasts;
  };

  useEffect(() => {
    setHourlyForecasts(mockHourlyForecasts());
    setDailyForecasts(mockDailyForecasts());
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
        <View style={tw`w-full`}>
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
          <View style={tw`items-center`}>
            <Text textWhite size="lg">
              {moment(new Date()).format(LocalizedDateFormat[langCode])}
            </Text>
            <Text style={tw`mt-lg`} size="tt" textWhite>
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
            {hourlyForecasts && (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={hourlyForecasts}
                renderItem={({ item: hourlyForecast }) => (
                  <View style={tw`mx-sm items-center`}>
                    <Text>{hourlyForecast.temp}</Text>
                    <Text>{hourlyForecast.time.getHours()}</Text>
                  </View>
                )}
              />
            )}
            {dailyForecasts && (
              <FlatList
                style={tw`mt-xl`}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={dailyForecasts}
                renderItem={({ item: dailyForecast }) => (
                  <View style={tw`mx-sm items-center`}>
                    <Text>{dailyForecast.temp}</Text>
                    <Text>{dailyForecast.time.getDate()}</Text>
                    <Image
                      style={tw`w-[40px] h-[40px]`}
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
      </LinearGradient>
      <AddCityModal
        visible={addCityModalIsOpen}
        setVisible={setAddCityModalOpen}
        onCitySuccessfullyAdded={() => navigation.goBack()}
      />
    </Screen>
  );
}
