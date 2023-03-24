import React from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "../components";
import { RootStackScreenProps } from "../navigation/screens";

import { useTw } from "../theme";

export function WeatherDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"WeatherDetailScreen">) {
  const tw = useTw();

  return (
    <Screen>
      <View style={tw`flex h-full items-center`}>
        <ScrollView style={tw`w-full`}></ScrollView>
      </View>
    </Screen>
  );
}
