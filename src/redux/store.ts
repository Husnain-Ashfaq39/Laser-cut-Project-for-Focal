import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import quotePartsReducer from "./slices/quote-parts-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteParts: quotePartsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
