import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: [],
  bookingId: null,
  staffId: null,
  accept: false,
  cancel: false,
  checkIn: false,
  checkOut: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modals.push(action.payload);
      //   state.id = action.payload.id;
    },
    closeModal: (state, action) => {
      state.modals = state.modals.filter(
        (modalType) => modalType !== action.payload
      );
      //   state.id = null;
    },
    setBookingId: (state, action) => {
      state.bookingId = action.payload;
    },
    setAccept: (state, action) => {
      state.accept = action.payload;
    },
    setCancel: (state, action) => {
      state.cancel = action.payload;
    },
    setCheckIn: (state, action) => {
      state.checkIn = action.payload;
    },
    setCheckOut: (state, action) => {
      state.checkOut = action.payload;
    },
    setStaffId: (state, action) => {
      state.staffId = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  setBookingId,
  setAccept,
  setCancel,
  setCheckIn,
  setCheckOut,
  setStaffId,
} = modalSlice.actions;

export default modalSlice.reducer;
