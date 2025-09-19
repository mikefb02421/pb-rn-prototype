import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';

import {imageApi} from '../services/imageApi';
import searchSlice from './searchSlice';
import gallerySlice from './gallerySlice';
import appSlice from './appSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['search', 'gallery'], // Only persist these reducers
};

const rootReducer = combineReducers({
  app: appSlice,
  search: searchSlice,
  gallery: gallerySlice,
  [imageApi.reducerPath]: imageApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(imageApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;