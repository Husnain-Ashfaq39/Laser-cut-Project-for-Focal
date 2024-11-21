import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import quotePartsReducer from './slices/quote-parts-slice';
// import blogsReducer from './slices/blogs-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteParts: quotePartsReducer,
    // blogs: blogsReducer,
  },
});

// Correctly typing RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
