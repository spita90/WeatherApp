import React, { useCallback } from "react";
import { View } from "react-native";
import { Screen, Text } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { HomeTabScreenProps } from "../navigation/screens";

import { useTw } from "../theme";

export function SearchScreen({
  navigation,
}: HomeTabScreenProps<"SearchScreen">) {
  const tw = useTw();

  const ScreenContent = useCallback(
    () => (
      <Text
        style={tw`grow px-lg justify-center`}
        textStyle={tw`leading-10`}
        size="xl"
        center
      >
        {i18n.t("l.emptyScreenPlaceholder")}
      </Text>
    ),
    []
  );

  return (
    <Screen>
      <View style={tw`h-full items-center`}>
        <ScreenContent />
      </View>
    </Screen>
  );
}
