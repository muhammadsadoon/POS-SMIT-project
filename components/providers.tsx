"use client";

import { useEffect } from 'react';
import ThemeProvider from "@/components/theme-provider";
import DashboardProvider from "@/components/dashboard/dashboard";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { useAuthStore } from '@/store/zustand/auth-store';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeAuth]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Notifications position="bottom-right" />
        <DashboardProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </DashboardProvider>
      </ThemeProvider>
    </Provider>
  );
}
