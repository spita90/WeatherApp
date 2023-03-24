import React, { useCallback } from "react";
import { View } from "react-native";
import { Screen } from "../components";
import { HomeTabScreenProps } from "../navigation/screens";

import { useTw } from "../theme";

export function LocationScreen({
  navigation,
}: HomeTabScreenProps<"LocationScreen">) {
  const tw = useTw();

  const ScreenContent = useCallback(
    () => <View style={tw`flex flex-row justify-center`}></View>,
    []
  );

  return (
    <Screen>
      <View style={tw`flex items-center pt-xl h-full`}>
        <ScreenContent />
      </View>
    </Screen>
  );
}
