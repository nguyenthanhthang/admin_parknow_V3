import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 1,
  userData: [],
  finalData: [],
};

export const multiStepSlice = createSlice({
  name: "multiStep",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setFinalData: (state, action) => {
      state.finalData = action.payload;
    },
  },
});

export const { setCurrentStep, setUserData, setFinalData } =
  multiStepSlice.actions;

export default multiStepSlice.reducer;
