import { combineReducers } from "redux";
import authSlice from "./auth-reducer/auth-reducer";

const combineR = combineReducers({
    authReducer: authSlice.reducer
})

export default combineR;