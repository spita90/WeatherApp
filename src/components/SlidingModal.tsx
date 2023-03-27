import { Octicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Platform, View } from "react-native";
import { Button, Text } from ".";
import { SCREEN_AVAILABLE_WIDTH } from "../../App";
import { useTw } from "../theme";
import { ColorsType } from "../theme/palette";

export interface SlidingModalProps {
  title?: string;
  children?: JSX.Element;
  backgroundColor?: ColorsType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

/**
 * Animated modal sliding from the bottom
 * @param title string to show in the component header
 * @param children the modal content
 * @param backgroundColor the background color
 * @param visible if the component is visible
 * @param setVisible function to set component visibility
 */
export const SlidingModal = ({
  title,
  children,
  backgroundColor,
  visible,
  setVisible,
}: SlidingModalProps) => {
  const tw = useTw();

  const VIEW_HIDDEN_Y_POS_PX = Dimensions.get("window").height;

  const resultsViewSlideAnim = useRef(
    new Animated.Value(VIEW_HIDDEN_Y_POS_PX)
  ).current;

  /**
   * Handles the slide up/down animation when visibility
   * is set respectively to true/false
   */
  useEffect(() => {
    Animated.timing(resultsViewSlideAnim, {
      toValue: visible ? 0 : VIEW_HIDDEN_Y_POS_PX,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [visible]);

  const ListHeader = useCallback(
    () => (
      <View
        style={tw`flex-row items-center justify-between rounded-lg pb-sm pl-md bg-${
          backgroundColor ?? "white"
        }`}
      >
        {title ? (
          <Text textStyle={tw`text-xl`} bold>
            {title}
          </Text>
        ) : (
          <View />
        )}
        <Button style={tw`rounded-lg`} onPress={() => setVisible(false)}>
          <Octicons name="x" size={24} color="black" />
        </Button>
      </View>
    ),
    []
  );

  return (
    <Animated.View
      style={[
        tw`absolute h-full w-full bg-black/60 justify-center items-center`,
        { transform: [{ translateY: resultsViewSlideAnim }] },
      ]}
    >
      <View
        style={tw`w-[85%] pb-lg rounded-lg bg-${backgroundColor ?? "white"}`}
      >
        <ListHeader />
        <View style={tw`px-md`}>{children}</View>
      </View>
    </Animated.View>
  );
};
