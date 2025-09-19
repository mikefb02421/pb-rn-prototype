// API Response Types
export interface ImageUrls {
  thumb: string;
  small: string;
  regular: string;
  full: string;
  raw?: string;
}

export interface ImageUser {
  id: string;
  name: string;
  username: string;
  profile_image?: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ImageResult {
  id: string;
  urls: ImageUrls;
  alt_description: string | null;
  description: string | null;
  width: number;
  height: number;
  color: string;
  user: ImageUser;
  likes: number;
  created_at: string;
  updated_at: string;
  downloads?: number;
  views?: number;
  tags?: ImageTag[];
}

export interface ImageTag {
  title: string;
}

// API Request Types
export interface ImageSearchParams {
  query: string;
  page?: number;
  per_page?: number;
  order_by?: 'latest' | 'oldest' | 'popular' | 'views' | 'downloads';
  collections?: string;
  content_filter?: 'low' | 'high';
  color?: 'black_and_white' | 'black' | 'white' | 'yellow' | 'orange' | 'red' | 'purple' | 'magenta' | 'green' | 'teal' | 'blue';
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

export interface SearchResponse {
  total: number;
  total_pages: number;
  results: ImageResult[];
}

export interface CollectionResponse {
  total: number;
  total_pages: number;
  results: ImageCollection[];
}

export interface ImageCollection {
  id: string;
  title: string;
  description: string | null;
  published_at: string;
  total_photos: number;
  private: boolean;
  share_key: string;
  cover_photo: ImageResult;
  user: ImageUser;
  preview_photos: ImageResult[];
}

// App-specific Types
export interface CachedImage {
  id: string;
  url: string;
  localPath?: string;
  timestamp: number;
  size: number;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  ImageViewer: {
    images: ImageResult[];
    initialIndex: number;
  };
};

export type MainTabParamList = {
  Search: undefined;
  Gallery: undefined;
  Favorites: undefined;
};

// Hook Types
export interface UseImageSearchResult {
  data: SearchResponse | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

export interface UseInfiniteScrollResult<T> {
  data: T[];
  hasNextPage: boolean;
  loadMore: () => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: any;
  refresh: () => void;
}