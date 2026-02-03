import { combineReducers } from "redux";
import authSlice from "./auth-reducer/auth-reducer";

const combineR = combineReducers({
    authState: authSlice.reducer
})

export default combineR;