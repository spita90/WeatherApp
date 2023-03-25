import React, { useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { useSelector } from "react-redux";
import { AnimatedTextInput, Button, SlidingModal, Text } from ".";
import { userState } from "../reducers/store";
import { addCity } from "../reducers/userReducer";
import { useTw } from "../theme";
import { capitalize, showToast } from "../utils";

const LAT_LON_MATCHER = new RegExp("^-?\\d+(?:[.,]\\d+)?$");

export interface AddCityModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export function AddCityModal({ visible, setVisible }: AddCityModalProps) {
  const tw = useTw();
  const { cities } = useSelector(userState);

  const [addCityName, setAddCityName] = useState<string>("");
  const [addCityLat, setAddCityLat] = useState<string>("");
  const [addCityLon, setAddCityLon] = useState<string>("");

  const latTextInputRef = useRef(null);
  const lonTextInputRef = useRef(null);

  const fieldsAreValid = () => {
    const allInputsFilled =
      addCityName.trim().length > 0 &&
      addCityLat.trim().length > 0 &&
      addCityLon.trim().length > 0;
    if (!allInputsFilled) {
      showToast("a");
      return false;
    }

    const latLonAreRegexValid =
      LAT_LON_MATCHER.test(addCityLat.trim()) &&
      LAT_LON_MATCHER.test(addCityLon.trim());
    if (!latLonAreRegexValid) {
      showToast("b");
      return false;
    }

    const lat = Number(
      LAT_LON_MATCHER.exec(addCityLat.trim().replaceAll(",", "."))![0]
    );
    const lon = Number(
      LAT_LON_MATCHER.exec(addCityLon.trim().replaceAll(",", "."))![0]
    );
    const latLonAreSemanticallyValid =
      Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
    if (!latLonAreSemanticallyValid) {
      showToast("c");
      return false;
    }

    return true;
  };

  const tryAddCity = () => {
    Keyboard.dismiss();
    const properAddCityName = capitalize(addCityName.trim());
    if (cities.map((city) => city.name).includes(properAddCityName)) {
      return showToast("d");
    }
    if (fieldsAreValid()) {
      addCity({
        name: properAddCityName,
        lat: Number(LAT_LON_MATCHER.exec(addCityLat.trim())![0]),
        lon: Number(LAT_LON_MATCHER.exec(addCityLon.trim())![0]),
      });
      setAddCityName("");
      setAddCityLat("");
      setAddCityLon("");
      setVisible(false);
    }
  };

  return (
    <SlidingModal title="dfsdf" visible={visible} setVisible={setVisible}>
      <View>
        <AnimatedTextInput
          style={tw`mb-sm`}
          label={"NAMMEEE"}
          value={addCityName}
          onChangeText={setAddCityName}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            //@ts-ignore
            latTextInputRef.current.focus();
          }}
        />
        <AnimatedTextInput
          textInputRef={latTextInputRef}
          style={tw`mb-sm`}
          keyboardType="decimal-pad"
          label={"LATT"}
          value={addCityLat}
          onChangeText={setAddCityLat}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            //@ts-ignore
            lonTextInputRef.current.focus();
          }}
        />
        <AnimatedTextInput
          textInputRef={lonTextInputRef}
          style={tw`mb-sm`}
          keyboardType="decimal-pad"
          value={addCityLon}
          onChangeText={setAddCityLon}
          label={"LOOOONN"}
          returnKeyType="done"
          onSubmitEditing={() => tryAddCity()}
        />
        <Button
          style={tw`w-[50%] self-end`}
          color="red"
          onPress={() => tryAddCity()}
        >
          <Text>OKKKK</Text>
        </Button>
      </View>
    </SlidingModal>
  );
}
