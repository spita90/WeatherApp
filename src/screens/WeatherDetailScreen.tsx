import { Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Screen, Text } from "../components";
import { RootStackScreenProps } from "../navigation/screens";
import { useTw } from "../theme";
import { Palette } from "../theme/palette";

export function WeatherDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"WeatherDetailScreen">) {
  const tw = useTw();

  const { cityName, currentWeather } = route.params;

  return (
    <Screen>
      <LinearGradient
        style={tw`h-full grow items-center`}
        colors={[Palette.detailStartBlue, Palette.detailEndBlue]}
      >
        <View style={tw`w-full`}>
          <View style={tw`flex-row pt-sm pb-md items-center justify-between`}>
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
              <View
                style={tw`w-[32px] h-[32px] border-[2px] border-white rounded-sm items-center justify-center`}
              >
                <Octicons name="plus" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Screen>
  );
}
