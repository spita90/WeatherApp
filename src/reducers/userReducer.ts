import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { store } from "./store";

const initialUserState: User = {
  firstUse: true,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    _setFirstUse(state, action: PayloadAction<boolean>) {
      state.firstUse = action.payload;
    },
    _wipe(state) {
      return (state = initialUserState);
    },
  },
});

const { _setFirstUse, _wipe } = userSlice.actions;

/**
 * EXPORTED FUNCTIONS
 */

export const setFirstUse = async (firstUse: boolean) => {
  store.dispatch(_setFirstUse(firstUse));
};

export const wipeUser = () => store.dispatch(_wipe());

export const userReducer = userSlice.reducer;
