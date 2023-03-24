import Lottie from "lottie-react-native";
import React from "react";
import { Image, View } from "react-native";
import { Text } from "..";
import { useTw } from "../../theme";

/**
 * Shows a cool animation with the app logo.
 * Uses Lottie for the animation
 */
export const LoadingFragment = () => {
  const tw = useTw();
  const animations = [
    "../../../assets/animations/cloudy.json",
    "../../../assets/animations/rainy.json",
    "../../../assets/animations/sunny.json",
    "../../../assets/animations/thunderstorm.json",
  ];

  return (
    <View style={tw`h-full justify-center items-center`}>
      <Lottie
        style={tw`w-[80%]`}
        source={require(animations[
          Math.floor(Math.random() * animations.length)
        ])}
        loop={true}
        autoPlay
      />
      <View style={tw`w-[50%] h-[100px]`}>
        <Image
          style={[tw`flex flex-1 w-full`, { resizeMode: "contain" }]}
          source={require("../../../assets/favicon.png")}
        />
      </View>
      <Text size={"xl"} ignoreFontFamily>
        {`WeatherApp`}
      </Text>
    </View>
  );
};
