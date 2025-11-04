import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const parkingModalSlice = createSlice({
  name: "parkingModal",
  initialState,
  reducers: {
    setNumCarRows: (state, action) => {
      const { floorIndex, numCarRows } = action.payload;
      state[floorIndex].numCarRows = numCarRows;
    },
    setNumCarColumns: (state, action) => {
      const { floorIndex, numCarCols } = action.payload;
      state[floorIndex].numCarCols = numCarCols;
    },
    setCarSlots: (state, action) => {
      const { floorIndex, carSlots } = action.payload;
      state[floorIndex].carSlots = carSlots;
    },
    initializeFloors: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  setNumCarRows,
  setNumCarColumns,
  setCarSlots,
  initializeFloors,
} = parkingModalSlice.actions;

export default parkingModalSlice.reducer;
