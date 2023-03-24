import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useTw } from "./src/theme";
import { LanguageLoader } from "./src/components";
import { AppLoader } from "./src/components/core/AppLoader";
import { ErrorFragment } from "./src/components/fragments/ErrorFragment";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { persistor, store } from "./src/reducers/store";
import { City, DomainError } from "./src/types";

export const WEB_APP_MAX_WIDTH_PX = 600;
export const SCREEN_AVAILABLE_WIDTH = Math.min(
  WEB_APP_MAX_WIDTH_PX,
  Dimensions.get("window").width
);

export const BUILTIN_CITIES: City[] = [
  { name: "Prato", lat: 43.87309, lon: 11.08278 },
  { name: "Bologna", lat: 44.498955, lon: 11.327591 },
  { name: "Torino", lat: 45.116177, lon: 7.742615 },
];

const onError = async (error: Error) => {
  if (error instanceof DomainError && error.fatal) {
    await AsyncStorage.clear();
  }
};

export default function App() {
  const tw = useTw();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView
          style={tw`flex-1 flex-row bg-[#EEEEEE] justify-center`}
        >
          <View style={tw`flex-1`}>
            <RootSiblingParent>
              <LanguageLoader />
              <ErrorBoundary
                onError={onError}
                FallbackComponent={({ error, resetErrorBoundary }) => {
                  return (
                    <ErrorFragment
                      error={error}
                      resetErrorBoundary={resetErrorBoundary}
                    />
                  );
                }}
              >
                <AppLoader>
                  <AppNavigator />
                </AppLoader>
              </ErrorBoundary>
            </RootSiblingParent>
          </View>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
