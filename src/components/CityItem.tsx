import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Text } from ".";
import { openWeatherMapImageBaseUrl } from "../../App";
import { languageState } from "../reducers/store";
import { useTw } from "../theme";
import { CurrentWeather } from "../types";
import { BG_VARIANTS, LocalizedDateFormat } from "../utils";

export interface CityItemProps {
  cityName: string;
  currentWeather: CurrentWeather;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function CityItem({
  cityName,
  currentWeather,
  onPress,
  onLongPress,
}: CityItemProps) {
  const tw = useTw();
  const { code: langCode } = useSelector(languageState);
  const icon = currentWeather.weather[0].icon;

  if (!cityName || !currentWeather) return null;
  return (
    <LinearGradient
      style={tw`max-w-[100%] mb-md p-md rounded-lg`}
      colors={[
        BG_VARIANTS[currentWeather.weather[0].main].start,
        BG_VARIANTS[currentWeather.weather[0].main].end,
      ]}
      start={{ x: 0.25, y: 0.25 }}
      end={{ x: 0.75, y: 0.75 }}
    >
      <TouchableOpacity
        style={tw`w-full flex-row justify-between`}
        onPress={() => onPress && onPress()}
        onLongPress={() => onLongPress && onLongPress()}
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
        >{`${Math.floor(currentWeather.main.temp)}°`}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
