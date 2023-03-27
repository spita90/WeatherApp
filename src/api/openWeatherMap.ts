import axios, { AxiosError } from "axios";
import { config } from "../config";
import { DomainError, CurrentWeather } from "../types";
import { getOpenWeatherMapClient, noResponse } from "./client";

const OPENWEATHERMAP_APPID = config.openWeatherMapAppId;

/**
 * Returns the current and forecast weather data
 * @param lat the location latitude
 * @param lon the location longitude
 * @param lang the app/UI language
 */
export const getCurrentWeatherData = async (
  lat: number,
  lon: number,
  lang: string
): Promise<CurrentWeather> =>
  getOpenWeatherMapClient()
    .get<CurrentWeather>(`weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: OPENWEATHERMAP_APPID,
        units: "metric",
        lang: lang,
      },
    })
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("errors.cannotGetCurrentWeatherData");
      }
      return response.data;
    });

// useful response/error validation methods
export const isError404NotFound = (e: any) => {
  return (
    axios.isAxiosError(e) &&
    e.code === AxiosError.ERR_BAD_REQUEST &&
    e.response &&
    e.response.status === 404
  );
};

export const rateLimitExcedeed = (e: any) => {
  return (
    axios.isAxiosError(e) &&
    e.code === AxiosError.ERR_BAD_REQUEST &&
    e.response &&
    e.response.status === 429
  );
};
