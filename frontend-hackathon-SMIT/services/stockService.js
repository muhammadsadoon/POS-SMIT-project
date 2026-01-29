import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery,
  tagTypes: ['Stocks'],
  endpoints: (builder) => ({
    getStocks: builder.query({
      query: ({ projectId, ...params } = {}) => ({
        url: '/stock',
        params: { projectId, ...params },
      }),
      providesTags: ['Stocks'],
    }),
    addStock: builder.mutation({
      query: (data) => ({
        url: '/stock/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Stocks'],
    }),
    removeStock: builder.mutation({
      query: (data) => ({
        url: '/stock/remove',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Stocks'],
    }),
    adjustStock: builder.mutation({
      query: (data) => ({
        url: '/stock/adjust',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Stocks'],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useAddStockMutation,
  useRemoveStockMutation,
  useAdjustStockMutation,
} = stockApi;
