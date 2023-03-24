import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, View } from "react-native";
import { Button, Text } from "../";
import { SCREEN_AVAILABLE_WIDTH } from "../../../App";
import { setFirstUse } from "../../reducers/userReducer";
import { useTw } from "../../theme";
import { i18n } from "../core/LanguageLoader";

export function WelcomeFragment() {
  const tw = useTw();

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(0);
  const [finishing, setFinishing] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hiSlideAnim = useRef(
    new Animated.Value(3 * SCREEN_AVAILABLE_WIDTH)
  ).current;
  const slideAnim = useRef(
    new Animated.Value(3 * SCREEN_AVAILABLE_WIDTH)
  ).current;

  const goPrev = (page: number) => setCurrentPageNumber(page - 1);

  const goNext = (page: number) => {
    if (page < 2) return setCurrentPageNumber(page + 1);
    setFinishing(true);
  };

  const finish = () => setFirstUse(false);

  const Page0 = useCallback(() => {
    return (
      <View
        style={[
          tw`items-center justify-center`,
          { width: SCREEN_AVAILABLE_WIDTH },
        ]}
      >
        <Animated.View style={[{ transform: [{ translateX: hiSlideAnim }] }]}>
          <Text textStyle={tw`text-7xl mb-[60px]`}>{i18n.t("l.hi")}</Text>
        </Animated.View>
      </View>
    );
  }, []);

  const Page1 = useCallback(() => {
    return (
      <View
        style={[
          tw`items-center justify-center`,
          { width: SCREEN_AVAILABLE_WIDTH },
        ]}
      ></View>
    );
  }, []);

  const Page2 = useCallback(() => {
    return (
      <View
        style={[
          tw`items-center justify-center`,
          { width: SCREEN_AVAILABLE_WIDTH },
        ]}
      ></View>
    );
  }, []);

  /**
   * Manages the initial "Hi!" animation and the pages slide
   * effect when navigating prev/next
   */
  useEffect(() => {
    Animated.timing(hiSlideAnim, {
      toValue: 0,
      duration: 850,
      easing: Easing.elastic(0.9),
      useNativeDriver: Platform.OS !== "web",
    }).start();

    Animated.timing(slideAnim, {
      toValue: -(currentPageNumber - 1) * SCREEN_AVAILABLE_WIDTH,
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [currentPageNumber]);

  /**
   * Manages the initial fade in and the closure fade out
   */
  useEffect(() => {
    if (currentPageNumber === 0) {
      return Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
    if (finishing)
      return Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== "web",
      }).start(() => finish());
  }, [currentPageNumber, finishing]);

  const Navigation = useCallback(
    () => (
      <View style={tw`flex-row flex-1 py-md px-xl justify-between items-end`}>
        {currentPageNumber > 0 ? (
          <Button onPress={() => goPrev(currentPageNumber)}>
            <Text
              color="white"
              textStyle={tw`${Platform.OS == "web" ? `text-2xl` : "text-xl"}`}
            >
              {i18n.t("l.prev")}
            </Text>
          </Button>
        ) : (
          <View style={tw`flex-1`} />
        )}
        <Button onPress={() => goNext(currentPageNumber)}>
          <Text
            color="white"
            textStyle={tw`${Platform.OS == "web" ? `text-2xl` : "text-xl"}`}
          >
            {i18n.t(currentPageNumber < 2 ? "l.next" : "l.end")}
          </Text>
        </Button>
      </View>
    ),
    [currentPageNumber]
  );

  return (
    <Animated.View
      style={[
        tw`flex-1 overflow-hidden`,
        { width: SCREEN_AVAILABLE_WIDTH },
        { opacity: fadeAnim },
      ]}
    >
      <Animated.View
        style={[
          tw`flex-row flex-8 justify-center`,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Page0 />
        <Page1 />
        <Page2 />
      </Animated.View>
      <Navigation />
    </Animated.View>
  );
}
