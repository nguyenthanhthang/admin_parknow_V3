import { combineReducers } from "redux";

// reducer import
import customizationReducer from "./customizationReducer";
import multiStepReducer from "./stepReducer";
import modalReducer from "./modalReducer";
import parkingModalReducer from "./parkingModalSlice";
import tokenReducer from "./tokenSlice";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  multiStep: multiStepReducer,
  modal: modalReducer,
  parkingModal: parkingModalReducer,
  token: tokenReducer,
});

export default reducer;
