import { createSlice } from "@reduxjs/toolkit";

interface InitailStateType {
    auth: {}[] | null;
    isAuthentication: boolean
}

const initialState: InitailStateType = {
    auth: null,
    isAuthentication: false
}

const authSlice = createSlice({
    name: "auth",
    reducers: {
        SET_AUTH: (state,action) => {
            state.auth = action.payload;
            state.isAuthentication = true;
        }
    },
    initialState
})

export default authSlice
export const { SET_AUTH } = authSlice.actions