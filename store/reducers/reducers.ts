import { combineReducers } from "redux";
import authSlice from "./auth-reducer/auth-reducer";
import { authApi } from "../actions/auth-action/auth-action";

const combineR = combineReducers({
    authState: authSlice,
    [authApi.reducerPath]: authApi.reducer
})

export default combineR;