import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedBaseQuery } from './authService';

export const salesApi = createApi({
  reducerPath: 'salesApi',
  baseQuery: authenticatedBaseQuery,
  tagTypes: ['Sales'],
  endpoints: (builder) => ({
    getSales: builder.query({
      query: () => '/transactions',
      providesTags: ['Sales'],
    }),
    createSale: builder.mutation({
      query: (data) => ({
        url: '/transactions/sale',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sales'],
    }),
  }),
});

export const { useGetSalesQuery, useCreateSaleMutation } = salesApi;
