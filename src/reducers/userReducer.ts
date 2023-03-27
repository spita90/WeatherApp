import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { City, User } from "../types";
import { store } from "./store";

const initialUserState: User = {
  firstUse: true,
  name: "",
  cities: [
    // Built-in cities
    { name: "Prato", lat: 43.87309, lon: 11.08278 },
    { name: "Bologna", lat: 44.498955, lon: 11.327591 },
    { name: "Torino", lat: 45.116177, lon: 7.742615 },
  ],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    _setFirstUse(state, action: PayloadAction<boolean>) {
      state.firstUse = action.payload;
    },
    _setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    _addCity(state, action: PayloadAction<City>) {
      state.cities = [action.payload, ...state.cities];
    },
    _removeCity(state, action: PayloadAction<string>) {
      state.cities = state.cities.filter(
        (city) => city.name !== action.payload
      );
    },
    _wipe() {
      return initialUserState;
    },
  },
});

const { _setFirstUse, _setName, _addCity, _removeCity, _wipe } =
  userSlice.actions;

/**
 * EXPORTED FUNCTIONS
 */

export const setFirstUse = async (firstUse: boolean) =>
  store.dispatch(_setFirstUse(firstUse));

export const setName = async (name: string) => store.dispatch(_setName(name));

export const addCity = async (city: City) => store.dispatch(_addCity(city));

export const removeCity = async (cityName: string) =>
  store.dispatch(_removeCity(cityName));

export const wipeUser = () => store.dispatch(_wipe());

export const userReducer = userSlice.reducer;
