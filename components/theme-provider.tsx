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
    fontWeight: "700",
  },

  // 🔥 Dark + Light background control
  other: {
    lightBg: "#f9fafb",
    darkBg: "#0b0f14", // deep dark
  },

  components: {
    AppShell: {
      styles: (theme:any) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.other.darkBg
              : theme.other.lightBg,
        },
      }),
    },

    Paper: {
      styles: (theme:any) => ({
        root: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? "#111827" // dark gray
              : "#ffffff",
        },
      }),
    },

    Text: {
      styles: (theme:any) => ({
        root: {
          color:
            theme.colorScheme === "dark"
              ? "#e5e7eb" // light text
              : "#111827",
        },
      }),
    },

    Heading: {
      styles: (theme:any) => ({
        root: {
          color:
            theme.colorScheme === "dark"
              ? "#f9fafb"
              : "#111827",
        },
      }),
    },
  },

  shadows: {
    md: "0 4px 12px rgba(0,0,0,0.15)",
    xl: "0 12px 32px rgba(0,0,0,0.25)",
  },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      {children}
    </MantineProvider>
  );
};

export default ThemeProvider;
