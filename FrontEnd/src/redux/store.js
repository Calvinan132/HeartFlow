import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/slices/counterSlice";
import userReducer from "./features/slices/userSlice";
import friendReducer from "./features/slices/friendSlice";
import partnerReducer from "./features/slices/partnerSlice";
import cartReducer from "./features/slices/shopSlice/cartSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    friend: friendReducer,
    partner: partnerReducer,
    cart: cartReducer,
  },
});
