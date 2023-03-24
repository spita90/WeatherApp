import React, { useCallback } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Screen, Text } from "../components";
import { HomeTabScreenProps } from "../navigation/screens";
import { userState } from "../reducers/store";

import { useTw } from "../theme";
import { City } from "../types";

export function MainScreen({ navigation }: HomeTabScreenProps<"MainScreen">) {
  const tw = useTw();
  const { name, cities } = useSelector(userState);

  const CityItem = ({ city }: { city: City }) => (
    <TouchableOpacity
      style={tw`m-sm bg-black`}
      onPress={() =>
        navigation.navigate("WeatherDetailScreen", {
          city: city,
        })
      }
    >
      <Text>{city.name}</Text>
    </TouchableOpacity>
  );

  const ScreenContent = useCallback(
    () => (
      <View style={tw`flex-row justify-center`}>
        <Text>{name}</Text>
        <FlatList
          style={tw`bg-red h-full grow`}
          data={cities}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: city }) => <CityItem city={city} />}
        />
      </View>
    ),
    [name, cities]
  );

  return (
    <Screen>
      <View style={tw`items-center pt-xl h-full`}>
        <ScreenContent />
      </View>
    </Screen>
  );
}
