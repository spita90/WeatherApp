import { Octicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { useSelector } from "react-redux";
import { languageState } from "../reducers/store";
import {
  LocationScreen,
  MainScreen,
  SearchScreen,
  WeatherDetailScreen,
} from "../screens";
import { useTw } from "../theme";
import { Palette } from "../theme/palette";
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

  const tabMenuIcons = {
    MainStack: (focused: boolean) => (
      <Octicons name="home" size={30} color={Palette.black80} />
    ),
    SearchScreen: (focused: boolean) => (
      <Octicons name="search" size={30} color={Palette.black80} />
    ),
    LocationScreen: (focused: boolean) => (
      <Octicons name="location" size={30} color={Palette.black80} />
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
          style={tw`w-[60px] h-[3px] bg-${focused ? "black80" : "transparent"}`}
        />
      </View>
    );
  };

  const MainScreenStack = () => (
    <Stack.Navigator
      detachInactiveScreens={true}
      initialRouteName={"MainScreen"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen
        name="WeatherDetailScreen"
        component={WeatherDetailScreen}
        options={{ presentation: "card" }}
      />
    </Stack.Navigator>
  );

  const TabNavigator = useCallback(
    () => (
      <Tab.Navigator
        initialRouteName={"MainStack"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            renderIcon({ name: route.name, focused }),
          tabBarStyle: [
            tw`absolute bg-white m-md rounded-lg`,
            { height: NAV_BAR_HEIGHT_PX },
          ],
        })}
      >
        <Tab.Screen name="MainStack" component={MainScreenStack} />
        <Tab.Screen name="SearchScreen" component={SearchScreen} />
        <Tab.Screen name="LocationScreen" component={LocationScreen} />
      </Tab.Navigator>
    ),
    [languageCode]
  );

  return (
    <Animated.View
      style={[tw`absolute top-0 w-full h-full`, { opacity: fadeInAnim }]}
    >
      <NavigationContainer
        documentTitle={{
          formatter: () => `WeatherApp`,
        }}
      >
        <TabNavigator />
      </NavigationContainer>
    </Animated.View>
  );
};
