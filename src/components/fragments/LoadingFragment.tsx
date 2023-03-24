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
    require("../../../assets/animations/cloudy.json"),
    require("../../../assets/animations/rainy.json"),
    require("../../../assets/animations/sunny.json"),
    require("../../../assets/animations/thunderstorm.json"),
  ];

  return (
    <View style={tw`h-full justify-center items-center`}>
      <Lottie
        style={tw`w-[80%]`}
        source={animations[Math.floor(Math.random() * animations.length)]}
        loop={true}
        autoPlay
      />
      <View style={tw`w-[50%] h-[100px]`}>
        <Image
          style={[tw`flex-1 w-full`, { resizeMode: "contain" }]}
          source={require("../../../assets/favicon.png")}
        />
      </View>
      <Text size={"xl"} ignoreFontFamily>
        {`WeatherApp`}
      </Text>
    </View>
  );
};
