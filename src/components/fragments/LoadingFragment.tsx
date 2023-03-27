import Lottie from "lottie-react-native";
import React, { useCallback, useMemo } from "react";
import { Image, View } from "react-native";
import { Text } from "..";
import { useTw } from "../../theme";

/**
 * Shows a cool random animation with the app logo.
 * Uses Lottie for the animation
 */
export const LoadingFragment = () => {
  const tw = useTw();
  const animations = [
    require("../../../assets/animations/cloudy.json"),
    require("../../../assets/animations/rainy.json"),
    require("../../../assets/animations/sunny.json"),
    require("../../../assets/animations/thunderstorm.json"),
  ];

  const animationIndex = useMemo(
    () => Math.floor(Math.random() * animations.length),
    []
  );

  const LottieAnimation = useCallback(() => {
    if (!animationIndex && animationIndex !== 0) return null;
    return (
      <View style={tw`rounded-[40px] overflow-hidden`}>
        <Lottie
          style={tw`w-[80%] rounded-lg`}
          source={animations[animationIndex]}
          loop={true}
          autoPlay
        />
      </View>
    );
  }, [animationIndex]);

  return (
    <View style={tw`h-full justify-center items-center`}>
      <LottieAnimation />
      <Text style={tw`mt-lg`} size={"xl"} bold ignoreFontFamily>
        {`WeatherApp`}
      </Text>
    </View>
  );
};
