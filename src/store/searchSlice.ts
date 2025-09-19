import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageResult} from '../services/types';

export interface SearchState {
  query: string;
  results: ImageResult[];
  searchHistory: string[];
  filters: {
    category: string | null;
    orientation: 'landscape' | 'portrait' | 'squarish' | null;
    color: string | null;
  };
  pagination: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
  };
  isSearching: boolean;
}

const initialState: SearchState = {
  query: '',
  results: [],
  searchHistory: [],
  filters: {
    category: null,
    orientation: null,
    color: null,
  },
  pagination: {
    page: 1,
    totalPages: 1,
    hasNextPage: false,
  },
  isSearching: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<ImageResult[]>) => {
      state.results = action.payload;
    },
    appendSearchResults: (state, action: PayloadAction<ImageResult[]>) => {
      state.results = [...state.results, ...action.payload];
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory = [query, ...state.searchHistory.slice(0, 9)]; // Keep last 10 searches
      }
    },
    clearHistory: (state) => {
      state.searchHistory = [];
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<SearchState['filters']>>,
    ) => {
      state.filters = {...state.filters, ...action.payload};
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        orientation: null,
        color: null,
      };
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<SearchState['pagination']>>,
    ) => {
      state.pagination = {...state.pagination, ...action.payload};
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.pagination = initialState.pagination;
      state.isSearching = false;
    },
  },
});

export const {
  setQuery,
  setSearchResults,
  appendSearchResults,
  addToHistory,
  clearHistory,
  setFilters,
  clearFilters,
  setPagination,
  setSearching,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;