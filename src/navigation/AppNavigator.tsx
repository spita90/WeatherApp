import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { useSelector } from "react-redux";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import Icon from "react-native-ionicons";
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
            tw`bg-black rounded-t-xl`,
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
      <Icon name="home-outline" />
      // <GitHubMarkSvg
      //   width={44}
      //   height={42}
      //   color={"white"}
      //   fillOpacity={focused ? 1 : 0.6}
      // />
    ),
    SearchScreen: (focused: boolean) => <Icon name="home-outline" />,
    LocationScreen: (focused: boolean) => <Icon name="home-outline" />,
  };

  const renderIcon = ({
    name,
    focused,
  }: {
    name: keyof HomeTabParamList;
    focused: boolean;
  }) => {
    const TabMenuIcon = () => tabMenuIcons[name](focused);

    let label = "";
    switch (name) {
      case "MainScreen":
        label = i18n.t("stargazers");
        break;
      case "SearchScreen":
        label = i18n.t("profile");
        break;
      case "LocationScreen":
        label = i18n.t("profile");
        break;
    }

    return (
      <View style={tw`mt-[10px] mb-[6px] items-center`}>
        <TabMenuIcon />
        <Text
          color={focused ? "white" : "white60"}
          size="sm"
          textStyle={tw`text-center`}
          style={tw`mt-[6px] min-w-[50px]`}
        >
          {label}
        </Text>
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
