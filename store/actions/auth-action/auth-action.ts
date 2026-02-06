import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LOGOUT_AUTH, SET_AUTH } from "@/store/reducers/auth-reducer/auth-reducer";
import { deleteCookie, setCookie } from "cookies-next"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({

    // 🔹 LOGIN
    loginUser: builder.mutation({
      async queryFn({ email, password }, { dispatch }) {
        try {
          const decodedPass = atob(password); // decode
          const res = await signInWithEmailAndPassword(auth, email, decodedPass);

          const user = {
            uid: res.user.uid,
            name: res.user.displayName,
            email: res.user.email,
            phone: res.user.phoneNumber,
            provider: "email/password",
          };
          const token = await res.user.getIdToken();
          setCookie("U-t-pos", token)
          dispatch(SET_AUTH(user));
          return { data: user };
        } catch (error: any) {
          return { error: { message: error.message } };
        }
      },
    }),

    // 🔹 SIGNUP
    signupUser: builder.mutation({
      async queryFn({ name, email, password, phone }, { dispatch }) {
        try {
          const decodedPass = atob(password); // decode
          const res = await createUserWithEmailAndPassword(auth, email, decodedPass);

          // Update name
          await updateProfile(res.user, { displayName: name });

          const user = {
            uid: res.user.uid,
            name,
            email,
            phone,
            provider: "email/password",
          };
          const token = await res.user.getIdToken();
          setCookie("U-t-pos", token)
          dispatch(SET_AUTH(user));
          return { data: user };
        } catch (error: any) {
          return { error: { message: error.message } };
        }
      },
    }),

    // 🔹 GOOGLE LOGIN
    googleAuth: builder.mutation({
      async queryFn({ }, { dispatch }) {
        try {
          const provider = new GoogleAuthProvider();
          const res = await signInWithPopup(auth, provider);

          const user = {
            uid: res.user.uid,
            name: res.user.displayName,
            email: res.user.email,
            phone: res.user.phoneNumber,
            photo: res.user.photoURL,
            provider: "google",
          };

          const token = await res.user.getIdToken();
          setCookie("U-t-pos", token)
          dispatch(SET_AUTH(user));
          return { data: user };
        } catch (error: any) {
          return { error: { message: error.message } };
        }
      },
    }),

    // 🔹 LOGOUT
    logoutUser: builder.mutation({
      async queryFn(_, { dispatch }) {
        try {
          await signOut(auth);
          dispatch(LOGOUT_AUTH());
          deleteCookie("U-t-pos")
          return { data: { message: "user logout successfully" } };
        } catch (error: any) {
          return { error: { message: error.message } };
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useGoogleAuthMutation,
  useLogoutUserMutation,
} = authApi;
