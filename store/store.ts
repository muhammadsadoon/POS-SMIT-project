import {configureStore} from "@reduxjs/toolkit"
import combineR from "./reducers/reducers"

const store = configureStore({
    reducer : combineR
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;