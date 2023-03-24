import React, { useCallback } from "react";
import { View } from "react-native";
import { Screen } from "../components";
import { HomeTabScreenProps } from "../navigation/screens";

import { useTw } from "../theme";

export function SearchScreen({
  navigation,
}: HomeTabScreenProps<"SearchScreen">) {
  const tw = useTw();

  const ScreenContent = useCallback(
    () => <View style={tw`flex-row justify-center`}></View>,
    []
  );

  return (
    <Screen>
      <View style={tw`items-center pt-xl h-full`}>
        <ScreenContent />
      </View>
    </Screen>
  );
}
