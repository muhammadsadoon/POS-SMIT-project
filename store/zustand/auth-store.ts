"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, UserRole } from '@/types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { setCookie, deleteCookie } from 'cookies-next';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => () => void;
  updateUserRole: (role: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          // Get Firebase Auth token and set cookie for middleware
          const token = await firebaseUser.getIdToken();
          setCookie("U-t-pos", token);
          
          const user: User = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            role: userData?.role as UserRole || undefined,
            photoURL: firebaseUser.photoURL,
            phoneNumber: firebaseUser.phoneNumber,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Update display name
          await updateProfile(firebaseUser, { displayName: name });
          
          // Create user document in Firestore
          const userData = {
            uid: firebaseUser.uid,
            name,
            email,
            role: 'staff', // Default role for new users
            createdAt: new Date(),
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), userData);
          
          // Get Firebase Auth token and set cookie for middleware
          const token = await firebaseUser.getIdToken();
          setCookie("U-t-pos", token);
          
          const user: User = {
            uid: firebaseUser.uid,
            name,
            email,
            role: 'admin',
            photoURL: firebaseUser.photoURL,
            phoneNumber: firebaseUser.phoneNumber,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await firebaseSignOut(auth);
          deleteCookie("U-t-pos");
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error: any) {
          throw error;
        }
      },

      initializeAuth: () => {
        return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              const userData = userDoc.data();
              
              // Get Firebase Auth token and set cookie for middleware
              const token = await firebaseUser.getIdToken();
              setCookie("U-t-pos", token);
              
              const user: User = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                role: userData?.role as UserRole || undefined,
                photoURL: firebaseUser.photoURL,
                phoneNumber: firebaseUser.phoneNumber,
              };

              set({ user, isAuthenticated: true, isLoading: false });
            } catch (error) {
              console.error('Error fetching user data:', error);
              set({ isLoading: false });
            }
          } else {
            deleteCookie("U-t-pos");
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
      },

      updateUserRole: async (role: string) => {
        const { user } = get();
        if (!user) return;
        
        try {
          await setDoc(
            doc(db, 'users', user.uid),
            { role },
            { merge: true }
          );
          
          set({
            user: { ...user, role: role as UserRole },
          });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
