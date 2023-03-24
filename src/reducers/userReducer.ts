import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BUILTIN_CITIES } from "../../App";
import { City, User } from "../types";
import { store } from "./store";

const initialUserState: User = {
  firstUse: true,
  name: "",
  cities: BUILTIN_CITIES,
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
      state.cities.push(action.payload);
    },
    _removeCity(state, action: PayloadAction<string>) {
      state.cities = state.cities.filter(
        (city) => city.name !== action.payload
      );
    },
    _wipe(state) {
      return (state = initialUserState);
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
