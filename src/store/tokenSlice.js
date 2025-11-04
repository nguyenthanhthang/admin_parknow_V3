// tokenSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokenAdmin: localStorage.getItem("tokenAdmin"),
  tokenStaff: localStorage.getItem("tokenStaff"),
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    updateTokenAdmin: (state, action) => {
      state.tokenAdmin = action.payload;
    },
    updateTokenStaff: (state, action) => {
      state.tokenStaff = action.payload;
    },
  },
});

export const { updateTokenAdmin, updateTokenStaff } = tokenSlice.actions;

export default tokenSlice.reducer;
