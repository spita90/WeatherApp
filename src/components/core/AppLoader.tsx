import { useFonts } from "expo-font";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform } from "react-native";
import { useSelector } from "react-redux";
import { Screen, WelcomeFragment } from "..";
import { config } from "../../config";
import { userState } from "../../reducers/store";
import { useTw } from "../../theme";
import { LoadingFragment } from "../fragments/LoadingFragment";

/**
 * Manages App initialization before displaying it
 */
export function AppLoader({ children }: { children: JSX.Element }) {
  const tw = useTw();

  const { firstUse } = useSelector(userState);

  const [appInitialized, setappInitialized] = useState(false);
  const [canRenderChildren, setCanRenderChildren] = useState(false);

  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  /**
   * Loads the font to be used across the whole App
   */
  const [fontsLoaded] = useFonts({
    "Circular-Std-Medium": require("../../../assets/fonts/CircularStd-Medium.ttf"),
  });

  const initializeApp = async () => {
    // Eventual initialization code
    setTimeout(() => {
      setappInitialized(true);
    }, 2500);
  };

  useEffect(() => {
    // App entry point
    if (config.environment !== "prod") {
      config.environment && console.log(config.environment);
      config.version && console.log(config.version);
    }

    initializeApp();
  }, []);

  /**
   * Handles the fade-out animation when loading is finished
   */
  useEffect(() => {
    if (!appInitialized || !fontsLoaded) return;
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: Platform.OS !== "web",
    }).start(() => {
      setCanRenderChildren(true);
    });
  }, [appInitialized, fontsLoaded]);

  if (!canRenderChildren) {
    return (
      <Animated.View
        style={[tw`absolute top-0 w-full h-full`, { opacity: fadeOutAnim }]}
      >
        <LoadingFragment />
      </Animated.View>
    );
  }

  return firstUse ? (
    <Screen>
      <WelcomeFragment />
    </Screen>
  ) : (
    children
  );
}
