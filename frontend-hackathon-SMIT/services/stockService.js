import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedBaseQuery } from './authService';

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: authenticatedBaseQuery,
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
