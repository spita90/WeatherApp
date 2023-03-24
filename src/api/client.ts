import axios, { AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";

const openWeatherMapApiBaseUrl = "https://api.openWeatherMap.org/data/2.5";

let _openWeatherMapClient: AxiosInstance;

/**
 * The OpenWeatherMap client
 */
export const getOpenWeatherMapClient = () => {
  if (!_openWeatherMapClient) {
    _openWeatherMapClient = axios.create({
      baseURL: openWeatherMapApiBaseUrl,
    });

    _openWeatherMapClient.interceptors.request.use(async (request) => {
      // do something if needed (e.g. log)
      return request;
    });

    _openWeatherMapClient.interceptors.response.use(
      async (response) => {
        // do something if needed (e.g. log)
        return response;
      },
      async (error) => {
        return Promise.reject(error);
      }
    );

    // Manages requests retry, useful when connection condition is poor
    axiosRetry(_openWeatherMapClient, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    });
  }
  return _openWeatherMapClient;
};

export const noResponse = (response: AxiosResponse) => {
  return response === undefined || response.data === undefined;
};
