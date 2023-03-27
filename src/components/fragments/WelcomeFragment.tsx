import { Octicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  Platform,
  View,
} from "react-native";
import { AddCityButton, AnimatedTextInput, Button, CityItem, Text } from "../";
import { SCREEN_AVAILABLE_WIDTH } from "../../../App";
import { setFirstUse, setName } from "../../reducers/userReducer";
import { useTw } from "../../theme";
import { CurrentWeather, WeatherType } from "../../types";
import { i18n } from "../core/LanguageLoader";

export function WelcomeFragment() {
  const tw = useTw();

  // state
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(0);
  const [finishing, setFinishing] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();

  // animations refs
  const cityItemAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hiSlideAnim = useRef(
    new Animated.Value(3 * SCREEN_AVAILABLE_WIDTH)
  ).current;
  const slideAnim = useRef(
    new Animated.Value(3 * SCREEN_AVAILABLE_WIDTH)
  ).current;

  // page navigation management
  const goPrev = (page: number) => setCurrentPageNumber(page - 1);

  const goNext = (page: number) => {
    if (page < 2) return setCurrentPageNumber(page + 1);
    setFinishing(true);
  };

  const finish = () => setFirstUse(false);

  // username management
  const onUsernameInputValueChanged = (text: string) => {
    setUsername(text);
  };

  const usernameIsValid = useMemo(
    () => !!username && username.trim().length > 0,
    [username]
  );

  // pages
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
        <Text style={tw`mb-xl px-lg`} textStyle={tw`text-xl`}>
          {i18n.t("l.welcome")}
        </Text>
        <Text style={tw`px-[10%]`} center>
          {i18n.t("l.welcomeCaption")}
        </Text>
        <Image
          style={[tw`mt-xl h-[25%]`, { resizeMode: "contain" }]}
          source={require("../../../assets/favicon.png")}
        />
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
      >
        <Text size="lg" style={tw`px-lg`} textStyle={tw`leading-10`} center>
          {i18n.t("l.insertName")}
        </Text>
        <AnimatedTextInput
          style={tw`mt-xl w-[80%]`}
          textStyle={tw`text-2xl font-bold`}
          labelStyle={tw`text-lg`}
          label={i18n.t("l.insertNameInputCaption")}
          value={username}
          onChangeText={onUsernameInputValueChanged}
          returnKeyType="done"
        />
      </View>
    );
  }, []);

  // dummy animated city item data to display in last page (tutorial)
  const dummyCurrentWeather: CurrentWeather = {
    weather: [
      {
        main: WeatherType.Clear,
        description: "Weather description",
        icon: "01d",
      },
    ],
    main: {
      temp: 24,
    },
  };

  const Page2 = useCallback(() => {
    return (
      <View style={[tw`items-center`, { width: SCREEN_AVAILABLE_WIDTH }]}>
        <Text style={tw`mt-[20%]`} textStyle={tw`text-5xl`} bold>
          {i18n.t("l.tutorial")}
        </Text>
        <View style={tw`my-xl flex-row items-center`}>
          <Text style={tw`mr-sm`}>{i18n.t("l.tapIconToAddCity")}</Text>
          <AddCityButton color="black" />
        </View>
        <View style={tw`mt-xl px-lg`}>
          <Text center>{i18n.t("l.tapCityToCheckOutDetail")}</Text>
          <Animated.View style={[tw`mt-md`, { opacity: cityItemAnim }]}>
            <CityItem cityName={"Dummy"} currentWeather={dummyCurrentWeather} />
          </Animated.View>
        </View>
        <View style={tw`mt-lg`}>
          <Text center>{i18n.t("l.longTapCityToDelete")}</Text>
        </View>
        <View style={tw`flex-1 justify-end`}>
          <Text size="tt">{i18n.t("l.goAheadToBegin")}</Text>
        </View>
      </View>
    );
  }, []);

  const Navigation = useCallback(
    () => (
      <View style={tw`flex-row flex-1 py-md px-xl justify-between items-end`}>
        {currentPageNumber > 0 ? (
          <Button onPress={() => goPrev(currentPageNumber)}>
            <Octicons name="arrow-left" size={32} color={"black"} />
          </Button>
        ) : (
          <View style={tw`flex-1`} />
        )}
        {(currentPageNumber !== 1 || usernameIsValid) && (
          <Button
            onPress={() => {
              if (currentPageNumber === 1) {
                Keyboard.dismiss();
                setName(username!.trim());
              }
              goNext(currentPageNumber);
            }}
          >
            <Octicons name="arrow-right" size={32} color={"black"} />
          </Button>
        )}
      </View>
    ),
    [currentPageNumber, username]
  );

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

  /**
   * Handles city item animation
   */
  useEffect(() => {
    setTimeout(() => {
      if (currentPageNumber === 2) {
        const animationRef = Animated.timing(cityItemAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: Platform.OS !== "web",
        });
        cityItemAnim.addListener((animation) => {
          if (animation.value === 0) {
            setTimeout(() => {
              cityItemAnim.setValue(1);
              setTimeout(() => {
                animationRef.start();
              }, 1000);
            }, 1000);
          }
        });
        animationRef.start();
      } else {
        cityItemAnim.setValue(1);
      }
    }, 1000);
    return () => {
      cityItemAnim.removeAllListeners();
    };
  }, [currentPageNumber]);

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
