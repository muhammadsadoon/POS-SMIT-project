"use client";

import ThemeProvider from "@/components/theme-provider";
import DashboardProvider from "@/components/dashboard/dashboard";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Notifications position="bottom-right" />
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </ThemeProvider>
    </Provider>
  );
}
