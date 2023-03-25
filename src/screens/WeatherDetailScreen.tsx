import { Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { openWeatherMapImageBaseUrl } from "../../App";
import { AddCityButton, Screen, Text } from "../components";
import { RootStackScreenProps } from "../navigation/screens";
import { languageState } from "../reducers/store";
import { useTw } from "../theme";
import { Palette } from "../theme/palette";
import { capitalize, LocalizedDateFormat } from "../utils";

export function WeatherDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"WeatherDetailScreen">) {
  const tw = useTw();
  const { code: langCode } = useSelector(languageState);

  const { cityName, currentWeather } = route.params;
  const icon = currentWeather.weather[0].icon;

  return (
    <Screen>
      <LinearGradient
        style={tw`h-full grow items-center`}
        colors={[Palette.detailStartBlue, Palette.detailEndBlue]}
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
            <TouchableOpacity style={tw`p-xl`}>
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
          </View>
        </View>
      </LinearGradient>
    </Screen>
  );
}
