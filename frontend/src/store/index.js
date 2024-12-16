import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./slices/storeSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";


const store = configureStore({
  reducer: {
    store: storeReducer, auth: authReducer, cart: cartReducer
  },
});

export default store;