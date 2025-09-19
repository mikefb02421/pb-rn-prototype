import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ImageSearchParams, SearchResponse, ImageResult} from './types';

const API_BASE_URL = 'https://api.unsplash.com';
const ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // This should come from environment variables

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Client-ID ${ACCESS_KEY}`);
      headers.set('Accept-Version', 'v1');
      return headers;
    },
  }),
  tagTypes: ['Images', 'Search'],
  endpoints: (builder) => ({
    searchImages: builder.query<SearchResponse, ImageSearchParams>({
      query: (params) => ({
        url: '/search/photos',
        params: {
          ...params,
          per_page: params.per_page || 20,
          page: params.page || 1,
        },
      }),
      providesTags: ['Search'],
    }),

    getRandomImages: builder.query<ImageResult[], {count?: number}>({
      query: (params) => ({
        url: '/photos/random',
        params: {
          count: params.count || 10,
        },
      }),
      providesTags: ['Images'],
    }),

    getImageById: builder.query<ImageResult, string>({
      query: (id) => `/photos/${id}`,
      providesTags: (result, error, id) => [{type: 'Images', id}],
    }),

    getFeaturedImages: builder.query<ImageResult[], {page?: number; per_page?: number}>({
      query: (params) => ({
        url: '/photos',
        params: {
          page: params.page || 1,
          per_page: params.per_page || 20,
          order_by: 'popular',
        },
      }),
      providesTags: ['Images'],
    }),

    getCollectionImages: builder.query<ImageResult[], {id: string; page?: number; per_page?: number}>({
      query: (params) => ({
        url: `/collections/${params.id}/photos`,
        params: {
          page: params.page || 1,
          per_page: params.per_page || 20,
        },
      }),
      providesTags: (result, error, {id}) => [{type: 'Images', id}],
    }),
  }),
});

export const {
  useSearchImagesQuery,
  useLazySearchImagesQuery,
  useGetRandomImagesQuery,
  useGetImageByIdQuery,
  useGetFeaturedImagesQuery,
  useGetCollectionImagesQuery,
} = imageApi;