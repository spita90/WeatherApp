import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { ColorsType } from "../theme/palette";

/**
 * Shows a toast message to the app user
 * @param message the message to display
 * @param color the background color (default red)
 * @param duration ms, time before the toast fades out (default 3000)
 */
export const showToast = (
  message: string,
  color?: ColorsType,
  duration?: number
) => {
  Toast.show(message, {
    duration: duration ?? 3000,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: color ?? "red",
    delay: 0,
  });
};

/**
 * To be used for non-blocking errors (this will not render an ErrorPage)
 * @param error The Error to handle
 * @param fatal Set to true to reset data (default: false)
 * @param showToast Set to false to avoid showing a Toast (default: true)
 */
export const errorHandler = async (
  error: Error | any,
  fatal: boolean = false,
  showToast: boolean = true
) => {
  if (!error) return;
  if (showToast && error.hasOwnProperty("message")) {
    Toast.show(error.message, {
      duration: 5000,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: "red",
      delay: 0,
    });
  }
  if (fatal) {
    await AsyncStorage.clear();
  }
};

export const LocalizedDateFormat: { [langCode: string]: string } = {
  it: "dddd Do, MMMM",
  en: "dddd Do, MMMM",
};

export const capitalize = (string: string) =>
  `${string[0].toUpperCase()}${string.slice(1)}`;
