import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { useSelector } from "react-redux";
import { Octicons } from "@expo/vector-icons";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { languageState } from "../reducers/store";
import React from "react";
import {
  LocationScreen,
  MainScreen,
  SearchScreen,
  WeatherDetailScreen,
} from "../screens";
import { useTw } from "../theme";
import { HomeTabParamList, RootStackParamList } from "./screens";

export const NAV_BAR_HEIGHT_PX = 80;

/**
 * The root level navigator
 */
export const AppNavigator = () => {
  const tw = useTw();

  /**
   * Triggers app re-render on language change
   */
  const { code: languageCode } = useSelector(languageState);

  /**
   * Handles the root level screens
   */
  const Stack = createStackNavigator<RootStackParamList>();

  /**
   * Handles the screens in the bottom navigation bar
   */
  const Tab = createBottomTabNavigator<HomeTabParamList>();

  const fadeInAnim = useRef(new Animated.Value(0)).current;

  /**
   * Handles the fade-in effect after the initial loading screen
   */
  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, []);

  /**
   * The bottom tab navigator
   */
  const TabNavigator = useCallback(
    () => (
      <Tab.Navigator
        initialRouteName={"MainScreen"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            renderIcon({ name: route.name, focused }),
          tabBarStyle: [
            tw`bg-white m-md rounded-xl`,
            { height: NAV_BAR_HEIGHT_PX },
          ],
        })}
      >
        <Tab.Screen name="MainScreen" component={MainScreen} />
        <Tab.Screen name="SearchScreen" component={SearchScreen} />
        <Tab.Screen name="LocationScreen" component={LocationScreen} />
      </Tab.Navigator>
    ),
    [languageCode]
  );

  const tabMenuIcons = {
    MainScreen: (focused: boolean) => (
      <Octicons name="home" size={30} color="black" />
    ),

    SearchScreen: (focused: boolean) => (
      <Octicons name="search" size={30} color="black" />
    ),
    LocationScreen: (focused: boolean) => (
      <Octicons name="location" size={30} color="black" />
    ),
  };

  const renderIcon = ({
    name,
    focused,
  }: {
    name: keyof HomeTabParamList;
    focused: boolean;
  }) => {
    const TabMenuIcon = () => tabMenuIcons[name](focused);

    return (
      <View style={tw`grow justify-between items-center pt-[20%]`}>
        <TabMenuIcon />
        <View
          style={tw`w-[50px] h-[3px] bg-${focused ? "black" : "transparent"}`}
        />
      </View>
    );
  };

  return (
    <Animated.View
      style={[tw`absolute top-0 w-full h-full`, { opacity: fadeInAnim }]}
    >
      <NavigationContainer
        documentTitle={{
          formatter: () => `WeatherApp`,
        }}
      >
        <Stack.Navigator
          detachInactiveScreens={true}
          initialRouteName={"TabNavigation"}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="WeatherDetailScreen"
            component={WeatherDetailScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="TabNavigation" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Animated.View>
  );
};
