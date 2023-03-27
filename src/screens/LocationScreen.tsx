import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Screen, Text } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { config } from "../config";
import { HomeTabScreenProps } from "../navigation/screens";
import { setLanguage } from "../reducers/languageReducer";
import { wipeUser } from "../reducers/userReducer";
import { useTw } from "../theme";
import { showToast } from "../utils";

const LANGUAGES = ["it", "en"];

export function LocationScreen({
  navigation,
}: HomeTabScreenProps<"LocationScreen">) {
  const tw = useTw();
  const [dataResetCounter, setDataResetCounter] = useState<number>(0);

  /**
   * Handles the data reset key combination.
   * In order to reset data the user must press the
   * reset button 3 times: one long, one short and one long again.
   */
  const dataResetStep = (clickType: "short" | "long") => {
    if (clickType === "short") {
      setDataResetCounter(
        dataResetCounter >= 1 && dataResetCounter < 2 ? dataResetCounter + 1 : 0
      );
    } else if (clickType === "long") {
      setDataResetCounter(
        dataResetCounter >= 1 && dataResetCounter < 2 ? 0 : dataResetCounter + 1
      );
    }
  };

  const Header = useCallback(
    () => (
      <Text style={tw`mt-xl`} textStyle={tw`text-4xl`} bold>
        {i18n.t("l.settings")}
      </Text>
    ),
    []
  );

  const LanguageChanger = useCallback(
    () => (
      <Button
        color="blue"
        style={tw`mt-[50px]`}
        onPress={() => {
          const currentLanguageIndex = LANGUAGES.indexOf(i18n.locale);
          i18n.locale =
            LANGUAGES[(currentLanguageIndex + 1) % LANGUAGES.length];
          setLanguage(i18n.locale);
        }}
      >
        <Text textWhite>{i18n.t("l.changeLanguage")}</Text>
      </Button>
    ),
    []
  );

  const DangerZone = useCallback(
    () => (
      <View style={tw`mt-[100px] mb-xl`}>
        <Button
          style={tw`mt-xl border-2 border-black`}
          color="red"
          onPress={() => {
            if (dataResetCounter === 0) showToast(i18n.t("l.resetDataMessage"));
            dataResetStep("short");
          }}
          onLongPress={() => {
            dataResetStep("long");
          }}
        >
          <Text>{i18n.t("l.resetData")}</Text>
        </Button>
      </View>
    ),
    [dataResetCounter]
  );

  const AppVersion = useCallback(
    () =>
      config.version ? (
        <Text style={tw`absolute right-3 top-[6px]`} size={"sm"} color="grey">
          v{config.version}
        </Text>
      ) : null,
    []
  );

  const ScreenContent = () => (
    <>
      <LanguageChanger />
      <DangerZone />
    </>
  );

  /**
   * Handles profile data reset at correct key-press
   * and shows progress in the while.
   */
  useEffect(() => {
    if (dataResetCounter === 3) {
      wipeUser();
      setDataResetCounter(0);
      showToast(
        `${dataResetCounter.toString()} - ${i18n.t("l.resetDataDone")}`,
        "grey",
        1000
      );
    } else if (dataResetCounter > 0) {
      showToast(dataResetCounter.toString(), "grey", 1000);
    }
  }, [dataResetCounter]);

  return (
    <Screen>
      <View style={tw`h-full items-center`}>
        <Header />
        <ScrollView
          style={tw`w-[80%] mt-xl`}
          showsVerticalScrollIndicator={false}
        >
          <ScreenContent />
        </ScrollView>
      </View>
      <AppVersion />
    </Screen>
  );
}
