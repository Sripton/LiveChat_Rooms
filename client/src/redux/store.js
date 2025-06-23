import { configureStore } from "@reduxjs/toolkit";
import counterReducers from "./reducers/counterReducer";
export default configureStore({
  reducer: {
    counter: counterReducers,
  },
});
