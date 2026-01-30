import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedBaseQuery } from './authService';

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: authenticatedBaseQuery,
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getTopSelling: builder.query({
      query: () => '/reports/top-selling',
      providesTags: ['Reports'],
    }),
    getProfit: builder.query({
      query: () => '/reports/profit',
      providesTags: ['Reports'],
    }),
    getDailyReport: builder.query({
      query: (date) => `/reports/daily/${date}`,
      providesTags: ['Reports'],
    }),
  }),
});

export const { useGetTopSellingQuery, useGetProfitQuery, useGetDailyReportQuery } = reportApi;
