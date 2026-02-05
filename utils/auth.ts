"use client";

import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
const useAuthRedux = () => {
    const state = useSelector((state: RootState) => state.authState)

    if(!state.isAuthentication) return {
        isAuthenticaion : false,
        data:null
    }
    return {
        isAuthenticaion: true,
        data: state.auth
    }
}

export default useAuthRedux;