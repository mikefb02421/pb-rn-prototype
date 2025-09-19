import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageResult} from '../services/types';

export interface GalleryState {
  images: ImageResult[];
  favorites: string[]; // Array of image IDs
  viewedImages: string[]; // Array of image IDs for tracking views
  currentImageIndex: number;
  layoutType: 'grid' | 'list';
  sortBy: 'newest' | 'popular' | 'relevant';
}

const initialState: GalleryState = {
  images: [],
  favorites: [],
  viewedImages: [],
  currentImageIndex: 0,
  layoutType: 'grid',
  sortBy: 'relevant',
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<ImageResult[]>) => {
      state.images = action.payload;
    },
    appendImages: (state, action: PayloadAction<ImageResult[]>) => {
      state.images = [...state.images, ...action.payload];
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    markAsViewed: (state, action: PayloadAction<string>) => {
      if (!state.viewedImages.includes(action.payload)) {
        state.viewedImages.push(action.payload);
      }
    },
    setCurrentImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
    setLayoutType: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layoutType = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'newest' | 'popular' | 'relevant'>) => {
      state.sortBy = action.payload;
    },
    clearGallery: (state) => {
      state.images = [];
      state.currentImageIndex = 0;
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const {
  setImages,
  appendImages,
  addToFavorites,
  removeFromFavorites,
  markAsViewed,
  setCurrentImageIndex,
  setLayoutType,
  setSortBy,
  clearGallery,
  clearFavorites,
} = gallerySlice.actions;

export default gallerySlice.reducer;