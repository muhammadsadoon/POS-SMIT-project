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
    reducers: {},
    initialState
})

export default authSlice
export const { } = authSlice