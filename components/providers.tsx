"use client";

import ThemeProvider from "@/components/theme-provider";
import DashboardProvider from "@/components/dashboard/dashboard";
import { Provider } from "react-redux";
import store from "@/store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </ThemeProvider>
    </Provider>
  );
}
