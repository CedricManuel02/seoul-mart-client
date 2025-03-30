import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./features/cart-slice";
import CheckoutReducer from "./features/checkout-slice";
import VariantReducer from "./features/variant-slice";
import LocationReducer from "./features/location-slice";
import AccountReducer from "./features/account-slice";

import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blackList: ["variant"]
};

const reducer = combineReducers({
    cart: CartReducer,
    account: AccountReducer,
    checkout: CheckoutReducer,
    variant: VariantReducer,
    location: LocationReducer
})

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);