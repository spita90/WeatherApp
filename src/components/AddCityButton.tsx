import { Octicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { useTw } from "../theme";
import { ColorsType, Palette } from "../theme/palette";

export interface AddCityButtonProps {
  color?: ColorsType;
}

export function AddCityButton({ color }: AddCityButtonProps) {
  const tw = useTw();

  return (
    <View
      style={tw`w-[32px] h-[32px] border-[2px] border-${
        color ?? "white"
      } rounded-sm items-center justify-center`}
    >
      <Octicons
        name="plus"
        size={24}
        color={color ? Palette[color] : "white"}
      />
    </View>
  );
}
