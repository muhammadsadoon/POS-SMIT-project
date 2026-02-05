"use client";
import { MantineProvider, createTheme } from "@mantine/core";
import React from "react";

const theme = createTheme({
  primaryColor: "green",

  colors: {
    green: [
      "#ecfdf3",
      "#d1fae5",
      "#a7f3d0",
      "#6ee7b7",
      "#34d399",
      "#10b981",
      "#059669",
      "#047857",
      "#065f46",
      "#064e3b",
    ],
  },

  fontFamily: "Inter, sans-serif",

  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "700", // 🔥 Default all headings bold
  },

  shadows: {
    md: "0 4px 12px rgba(0,0,0,0.15)",
    xl: "0 12px 32px rgba(0,0,0,0.25)",
  },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto" // 🌗 Auto light/dark
    >
      {children}
    </MantineProvider>
  );
};

export default ThemeProvider;
