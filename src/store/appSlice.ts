import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AppState {
  isLoading: boolean;
  error: string | null;
  networkStatus: 'online' | 'offline';
  theme: 'light' | 'dark';
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  networkStatus: 'online',
  theme: 'light',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.networkStatus = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {setLoading, setError, setNetworkStatus, setTheme, clearError} =
  appSlice.actions;

export default appSlice.reducer;