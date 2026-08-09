import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import dashboardReducer from './dashboard/dashboardSlice';
import productReducer from './products/productSlice';
import productsReducer from './products/productsSlice';
import reviewsReducer from './reviews/reviewsSlice';
import storesReducer from './stores/storesSlice';
import uiReducer from './ui/uiSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'user', 'isLoggedIn'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: cartReducer,
  dashboard: dashboardReducer,
  products: productsReducer,
  product: productReducer,
  stores: storesReducer,
  reviews: reviewsReducer,
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
