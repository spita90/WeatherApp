import { AVAILABLE_CITIES } from "../App";

/**
 * A custom Error class
 * @param messageLocaleKey the key string for the i18n translatable message
 * @param fatal if true, local data will be erased
 */
export class DomainError extends Error {
  constructor(messageLocaleKey: string, fatal: boolean = false) {
    super(messageLocaleKey);
    this.name = "DomainError";
    this.stack = messageLocaleKey;
    this.fatal = fatal;
  }
  fatal: boolean;
}

export type User = {
  firstUse: boolean;
};

export interface WeatherResponse {
  // Check https://openweathermap.org/current#:~:text=%3A%20200%0A%7D-,Fields%20in%20API%20response,-coord
  coord: {
    lon: number; // longitude
    lat: number; // latitude
  };
  weather: [
    // Check https://openweathermap.org/weather-conditions
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number; // Temperature in chosen units
    feels_like: number; // Felt temperature in chosen units
    temp_min: number; // Minimum temperature in chosen units
    temp_max: number; // Maximum temperature in chosen units
    pressure: number; // Atmospheric pressure in hPa
    humidity: number; // Humidity in %
  };
  dt: number; // Time of data calculation in UTC
  sys: {
    country: string; // Country code
    sunrise: number; // Sunrise time in UTC
    sunset: number; // Sunrset time in UTC
  };
  cod: number; // Internal parameter
}

export type AvailableCity = keyof typeof AVAILABLE_CITIES;