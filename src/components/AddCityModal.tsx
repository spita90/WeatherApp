import React, { useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { useSelector } from "react-redux";
import { AnimatedTextInput, Button, SlidingModal, Text } from ".";
import { userState } from "../reducers/store";
import { addCity } from "../reducers/userReducer";
import { useTw } from "../theme";
import { capitalize, showToast } from "../utils";
import { i18n } from "./core/LanguageLoader";

const LAT_LON_MATCHER = new RegExp("^-?\\d+(?:[.,]\\d+)?$");

export interface AddCityModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onCitySuccessfullyAdded?: (cityName: string) => void;
}

export function AddCityModal({
  visible,
  setVisible,
  onCitySuccessfullyAdded,
}: AddCityModalProps) {
  const tw = useTw();
  const { cities } = useSelector(userState);

  const [addCityName, setAddCityName] = useState<string>("");
  const [addCityLat, setAddCityLat] = useState<string>("");
  const [addCityLon, setAddCityLon] = useState<string>("");

  const latTextInputRef = useRef(null);
  const lonTextInputRef = useRef(null);

  /**
   * Handles fields validation and displays toasts if not
   * @returns true if entered fields are valid, otherwise false
   */
  const fieldsAreValid = () => {
    // all fields must be non-empty and non-whitespace
    const allInputsFilled =
      !!addCityName &&
      !!addCityLat &&
      !!addCityLon &&
      addCityName.trim().length > 0 &&
      addCityLat.trim().length > 0 &&
      addCityLon.trim().length > 0;
    if (!allInputsFilled) {
      showToast(i18n.t("l.addCitySomeFieldsAreNotFilled"));
      return false;
    }

    // lat and lon fields must be either integer or decimal
    const latLonAreRegexValid =
      LAT_LON_MATCHER.test(addCityLat.trim()) &&
      LAT_LON_MATCHER.test(addCityLon.trim());
    if (!latLonAreRegexValid) {
      showToast(i18n.t("l.addCityLatLonIncorrectFormat"));
      return false;
    }

    const lat = Number(
      LAT_LON_MATCHER.exec(addCityLat.trim().replaceAll(",", "."))![0]
    );
    const lon = Number(
      LAT_LON_MATCHER.exec(addCityLon.trim().replaceAll(",", "."))![0]
    );
    // lat must be >=-90 and <=90, lon must be >=-180 and <=180
    const latLonAreSemanticallyValid =
      Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
    if (!latLonAreSemanticallyValid) {
      showToast(i18n.t("l.addCityLatLonSemanticallyIncorrect"));
      return false;
    }

    return true;
  };

  const resetFields = () => {
    setAddCityName("");
    setAddCityLat("");
    setAddCityLon("");
  };

  /**
   * Triggers fields validation and, if successful, city entering into redux state
   */
  const tryAddCity = () => {
    Keyboard.dismiss();
    if (!fieldsAreValid()) return;
    const properAddCityName = capitalize(addCityName.trim());
    if (cities.map((city) => city.name).includes(properAddCityName)) {
      return showToast(i18n.t("l.addCityAlreadyPresent"));
    }
    addCity({
      name: properAddCityName,
      lat: Number(LAT_LON_MATCHER.exec(addCityLat.trim())![0]),
      lon: Number(LAT_LON_MATCHER.exec(addCityLon.trim())![0]),
    });
    resetFields();
    setVisible(false);
    onCitySuccessfullyAdded && onCitySuccessfullyAdded(properAddCityName);
  };

  return (
    <SlidingModal
      title={i18n.t("l.addCity")}
      visible={visible}
      setVisible={(visible: boolean) => {
        if (!visible) {
          Keyboard.dismiss();
          resetFields();
        }
        setVisible(visible);
      }}
    >
      <View>
        <AnimatedTextInput
          style={tw`mb-sm`}
          label={i18n.t("l.cityName")}
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
          label={i18n.t("l.latitude")}
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
          label={i18n.t("l.longitude")}
          returnKeyType="done"
          onSubmitEditing={() => tryAddCity()}
        />
        <Button
          style={tw`w-[30%] self-end items-end`}
          color="transparent"
          onPress={() => tryAddCity()}
        >
          <Text>{i18n.t("l.ok")}</Text>
        </Button>
      </View>
    </SlidingModal>
  );
}
