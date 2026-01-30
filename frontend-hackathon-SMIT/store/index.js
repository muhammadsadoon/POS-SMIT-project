// import authReducer from './slices/authSlice';
// import projectReducer from './slices/projectSlice';
// import productReducer from './slices/productSlice';
// import stockReducer from './slices/stockSlice';
// import { authApi } from '@/services/authService';
// import { projectApi } from '@/services/projectService';
// import { productApi } from '@/services/productService';
// import { stockApi } from '@/services/stockService';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     project: projectReducer,
//     product: productReducer,
//     stock: stockReducer,
//     [authApi.reducerPath]: authApi.reducer,
//     [projectApi.reducerPath]: projectApi.reducer,
//     [productApi.reducerPath]: productApi.reducer,
//     [stockApi.reducerPath]: stockApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       authApi.middleware,
//       projectApi.middleware,
//       productApi.middleware,
//       stockApi.middleware
//     ),
// });
// =======
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import productReducer from './slices/productSlice';
import stockReducer from './slices/stockSlice';
import salesReducer from './slices/salesSlice';
import { authApi } from '@/services/authService';
import { projectApi } from '@/services/projectService';
import { productApi } from '@/services/productService';
import { stockApi } from '@/services/stockService';
import { salesApi } from '@/services/salesService';
import { reportApi } from '@/services/reportService';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    product: productReducer,
    stock: stockReducer,
    sales: salesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [salesApi.reducerPath]: salesApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      projectApi.middleware,
      productApi.middleware,
      stockApi.middleware,
      salesApi.middleware,
      reportApi.middleware
    ),
});
