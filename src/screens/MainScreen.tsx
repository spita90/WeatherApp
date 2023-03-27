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
import { NAV_BAR_HEIGHT_PX } from "../navigation/AppNavigator";
import { RootStackScreenProps } from "../navigation/screens";
import { languageState, userState } from "../reducers/store";
import { removeCity } from "../reducers/userReducer";
import { useTw } from "../theme";
import { CurrentWeather } from "../types";
import { errorHandler, showToast } from "../utils";

export function MainScreen({ navigation }: RootStackScreenProps<"MainScreen">) {
  const tw = useTw();
  const { name, cities } = useSelector(userState);
  const { code: langCode } = useSelector(languageState);
  const [currentWeather, setCurrentWeather] = useState<{
    [cityName: string]: CurrentWeather;
  }>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [addCityModalIsOpen, setAddCityModalOpen] = useState<boolean>(false);

  /**
   * Handles the city deletion on long tap
   * @param cityName the name of the deleting city
   */
  const handleRemoveCity = (cityName: string) => {
    removeCity(cityName);
    setCurrentWeather((currentWeather) =>
      Object.fromEntries(
        Object.entries(currentWeather).filter((city) => city[0] !== cityName)
      )
    );
  };

  /**
   * Fetches current weather data in parallel, just for cities that
   * don't have such data associated yet
   */
  const fetchCurrentWeatherData = () => {
    Promise.all(
      cities
        .filter((city) => !currentWeather[city.name])
        .map(async (city) => {
          if (__DEV__) console.log(`Fetching current weather for ${city.name}`);
          await getCurrentWeatherData(city.lat, city.lon, langCode)
            .then((response) =>
              setCurrentWeather((weather) => ({
                ...weather,
                [city.name]: response,
              }))
            )
            .catch((e) => {
              if (rateLimitExcedeed(e))
                return showToast(i18n.t("errors.rateLimitExcedeed"));
              errorHandler(e);
            })
            .finally(() => {
              setRefreshing(false);
            });
        })
    );
  };

  const Header = useCallback(
    () => (
      <View style={tw`mt-md mb-xl items-center`}>
        <Text
          style={tw`mt-xl`}
          textStyle={tw`text-3xl`}
          color={"darkBlue"}
          bold
        >
          {`${i18n.t("l.goodMorning")}`}
        </Text>
        <Text
          style={tw`mt-xs`}
          textStyle={tw`text-3xl`}
          color={"darkBlue"}
          bold
        >
          {`${name}!`}
        </Text>
      </View>
    ),
    []
  );

  const AddCityBanner = useCallback(
    () => (
      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={() => setAddCityModalOpen(true)}
      >
        <AddCityButton color="darkBlue" />
        <Text style={tw`ml-sm`} size="tt">
          {i18n.t("l.addCity")}
        </Text>
      </TouchableOpacity>
    ),
    []
  );

  const CityItemView = useCallback(
    ({ cityName }: { cityName: string }) => (
      <CityItem
        cityName={cityName}
        currentWeather={currentWeather[cityName]}
        onPress={() => {
          navigation.navigate("WeatherDetailScreen", {
            cityName: cityName,
            currentWeather: currentWeather[cityName],
          });
        }}
        onLongPress={() => handleRemoveCity(cityName)}
      />
    ),
    [currentWeather]
  );

  const CitiesList = useCallback(
    () => (
      <FlatList
        style={tw`h-full mt-xxl mx-md rounded-lg overflow-hidden`}
        showsVerticalScrollIndicator={false}
        // currentWeather keys order follows cities array order
        data={Object.keys(currentWeather).sort((a, b) => {
          const cityNames = cities.map((city) => city.name);
          return cityNames.indexOf(a) - cityNames.indexOf(b);
        })}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={
          <View style={tw`mb-[${NAV_BAR_HEIGHT_PX + 20}]`} />
        }
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
          <CityItemView cityName={cityName} />
        )}
      />
    ),
    [currentWeather, refreshing]
  );

  const ScreenContent = useCallback(
    () => (
      <View style={tw`items-center`}>
        <Header />
        <AddCityBanner />
        <CitiesList />
      </View>
    ),
    [cities, currentWeather]
  );

  /**
   * Fetches current weather data if cities changes.
   * If a city is deleted, all other will already have weather data
   * associated to them so nothing new will be fetched.
   * If instead a city is added, just its current weather will be fetched.
   */
  useEffect(() => {
    if (!cities) return;
    fetchCurrentWeatherData();
  }, [cities]);

  /**
   * Fetches updated weather data on pull-to-refresh gesture
   */
  useEffect(() => {
    if (!refreshing) return;
    fetchCurrentWeatherData();
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
