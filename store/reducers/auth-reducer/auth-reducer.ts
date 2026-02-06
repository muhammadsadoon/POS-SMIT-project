import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserType {
  uid: string;
  email: string | null;
}

interface InitialStateType {
  auth: UserType | null;
  isAuthentication: boolean;
}

const initialState: InitialStateType = {
  auth: null,
  isAuthentication: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_AUTH: (state, action: PayloadAction<UserType>) => {
      state.auth = action.payload;
      state.isAuthentication = true;
    },
    LOGOUT_AUTH: (state) => {
      state.auth = null;
      state.isAuthentication = false;
    },
  },
});

export const { SET_AUTH, LOGOUT_AUTH } = authSlice.actions;
export default authSlice.reducer;
