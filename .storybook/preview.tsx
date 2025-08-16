import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const lightTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: ["Segoe UI", "Tahoma", "Arial", "sans-serif"].join(","),
  },
});

const darkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  typography: {
    fontFamily: ["Segoe UI", "Tahoma", "Arial", "sans-serif"].join(","),
  },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    themes: {
      default: "light",
      list: [
        { name: "light", class: "light", color: "#ffffff" },
        { name: "dark", class: "dark", color: "#000000" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? darkTheme : lightTheme;
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ height: "100vh", width: "100vw" }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
