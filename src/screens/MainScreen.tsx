import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import {
  getCurrentWeatherData,
  rateLimitExcedeed,
} from "../api/openWeatherMap";
import {
  AddCityButton,
  AddCityModal,
  CityItem,
  Screen,
  Text,
} from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { HomeTabScreenProps } from "../navigation/screens";
import { languageState, userState } from "../reducers/store";
import { removeCity } from "../reducers/userReducer";
import { useTw } from "../theme";
import { CurrentWeather } from "../types";
import { errorHandler, showToast } from "../utils";

export function MainScreen({ navigation }: HomeTabScreenProps<"MainScreen">) {
  const tw = useTw();
  const { name, cities } = useSelector(userState);
  const { code: langCode } = useSelector(languageState);
  const [currentWeather, setCurrentWeather] = useState<{
    [cityName: string]: CurrentWeather;
  }>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [addCityModalIsOpen, setAddCityModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!langCode) return;
    moment.locale(langCode);
  }, [langCode]);

  const ScreenContent = useCallback(
    () => (
      <View style={tw`items-center`}>
        <Header />
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={() => setAddCityModalOpen(true)}
        >
          <AddCityButton color="darkBlue" />
          <Text style={tw`ml-sm`} size="tt">
            {i18n.t("l.addCity")}
          </Text>
        </TouchableOpacity>
        <FlatList
          style={tw`h-full mt-xxl`}
          showsVerticalScrollIndicator={false}
          data={Object.keys(currentWeather)}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setCurrentWeather({});
              }}
            />
          }
          renderItem={({ item: cityName }) => (
            <View style={tw`px-md`}>
              <CityItem
                cityName={cityName}
                currentWeather={currentWeather[cityName]}
                onPress={() => {
                  navigation.navigate("WeatherDetailScreen", {
                    cityName: cityName,
                    currentWeather: currentWeather[cityName],
                  });
                }}
                onLongPress={() => {
                  removeCity(cityName);
                  setCurrentWeather((currentWeather) =>
                    Object.fromEntries(
                      Object.entries(currentWeather).filter(
                        (city) => city[0] !== cityName
                      )
                    )
                  );
                }}
              />
            </View>
          )}
        />
      </View>
    ),
    [name, currentWeather, cities]
  );

  const Header = useCallback(
    () => (
      <View style={tw`mt-md mb-xl items-center`}>
        <Text
          style={tw`mt-xl`}
          textStyle={tw`text-3xl`}
          color={"darkBlue"}
          bold
        >
          {i18n.t("l.goodMorning")}
        </Text>
        <Text
          style={tw`mt-xs`}
          textStyle={tw`text-3xl`}
          color={"darkBlue"}
          bold
        >
          {name}
        </Text>
      </View>
    ),
    []
  );

  const fetchWeatherData = () => {
    try {
      Promise.all(
        cities
          .filter((city) => !currentWeather[city.name])
          .map(async (city) => {
            console.log(`Fetching current weather for ${city.name}`);
            await getCurrentWeatherData(city.lat, city.lon, langCode).then(
              (response) =>
                setCurrentWeather((weather) => ({
                  ...weather,
                  [city.name]: response,
                }))
            );
          })
      );
    } catch (e) {
      if (rateLimitExcedeed(e))
        return showToast(i18n.t("errors.rateLimitExcedeed"));
      errorHandler(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!cities) return;
    fetchWeatherData();
  }, [cities]);

  useEffect(() => {
    if (!refreshing) return;
    fetchWeatherData();
  }, [refreshing]);

  return (
    <Screen>
      <View style={tw`h-full items-center`}>
        <ScreenContent />
      </View>
      <AddCityModal
        visible={addCityModalIsOpen}
        setVisible={setAddCityModalOpen}
      />
    </Screen>
  );
}
