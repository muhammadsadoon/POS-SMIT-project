"use client";
import { MantineProvider, createTheme, ColorSchemeScript } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import React, { useEffect } from "react";

const theme = createTheme({
  primaryColor: "blue",

  colors: {
    blue: [
      "#e7f5ff",
      "#d0ebff",
      "#a5d8ff",
      "#74c0fc",
      "#4dabf7",
      "#339af0",
      "#228be6",
      "#1c7ed6",
      "#1971c2",
      "#1864ab",
    ],
  },

  fontFamily: "Inter, system-ui, -apple-system, sans-serif",

  headings: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontWeight: "700",
  },

  // Dark + Light background control
  other: {
    lightBg: "#ffffff",
    darkBg: "#1a1b1e",
  },

  defaultRadius: "md",

  components: {
    AppShell: {
      styles: (theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }),
    },

    Paper: {
      styles: (theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.white,
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
        },
      }),
    },

    Card: {
      styles: (theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.white,
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
        },
      }),
    },

    Text: {
      styles: (theme) => ({
        root: {
          color:
            theme.colorScheme === "dark"
              ? theme.colors.gray[0]
              : theme.colors.dark[9],
        },
      }),
    },

    Title: {
      styles: (theme) => ({
        root: {
          color:
            theme.colorScheme === "dark"
              ? theme.colors.gray[0]
              : theme.colors.dark[9],
        },
      }),
    },

    Button: {
      styles: (theme) => ({
        root: {
          transition: "all 0.2s ease",
        },
      }),
    },

    NavLink: {
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.md,
          "&[dataActive]": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.blue[9]
                : theme.colors.blue[1],
            color:
              theme.colorScheme === "dark"
                ? theme.white
                : theme.colors.blue[9],
          },
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[1],
          },
        },
      }),
    },

    Input: {
      styles: (theme) => ({
        input: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.white,
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[4],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.gray[0]
              : theme.colors.dark[9],
          "&:focus": {
            borderColor: theme.colors.blue[6],
          },
        },
      }),
    },

    Modal: {
      styles: (theme) => ({
        content: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.white,
        },
        header: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.white,
        },
        body: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.white,
        },
      }),
    },

    Table: {
      styles: (theme) => ({
        root: {
          "& thead tr th": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[1],
            color:
              theme.colorScheme === "dark"
                ? theme.colors.gray[0]
                : theme.colors.dark[9],
          },
          "& tbody tr": {
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          },
        },
      }),
    },
  },

  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.05)",
    md: "0 4px 12px rgba(0, 0, 0, 0.15)",
    xl: "0 12px 32px rgba(0, 0, 0, 0.25)",
  },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      {children}
    </MantineProvider>
  );
};

export { ColorSchemeScript };
export default ThemeProvider;
