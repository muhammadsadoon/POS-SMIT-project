import { configureStore } from "@reduxjs/toolkit"
import combineR from "./reducers/reducers"
import { authApi } from "./actions/auth-action/auth-action";


const store = configureStore({
    reducer: combineR,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware)
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;