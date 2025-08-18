# Chat Component Theme Toggle Usage Example

## New Props Added

The Chat component now supports two new optional props for theme toggle functionality:

- `themeMode?: "light" | "dark"` - The current theme mode
- `onThemeModeChange?: (mode: "light" | "dark") => void` - Callback function when theme mode is changed

## Usage Example

```tsx
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Chat from "./components/Chat/Chat";

function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Create theme based on current mode
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  // Handle theme change
  const handleThemeChange = (mode: "light" | "dark") => {
    setThemeMode(mode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Chat
        messages={messages}
        onMessageEnter={handleMessageEnter}
        maxFileSize={10 * 1024 * 1024} // 10MB
        allowedFileTypes={[".pdf", ".doc", ".docx", ".txt"]}
        lang="he"
        // New theme props
        themeMode={themeMode}
        onThemeModeChange={handleThemeChange}
      />
    </ThemeProvider>
  );
}
```

## Features

1. **Conditional Display**: The theme selector only appears when `onThemeModeChange` is provided
2. **Visual Feedback**: Shows both light and dark mode buttons with the active mode highlighted
3. **Tooltip Support**: Shows helpful tooltips in Hebrew and English for each mode
4. **Positioning**: The theme selector appears on the left side of the toolbar, while export and new chat buttons remain on the right
5. **Consistent Styling**: Matches the existing toolbar button styling

## Notes

- The theme selector is purely visual and doesn't actually change the theme - that's handled by the parent component
- If `onThemeModeChange` is not provided, the theme selector won't be displayed
- The active theme mode is highlighted with the primary color
- Both light and dark mode options are always visible when the selector is shown
