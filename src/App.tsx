import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Chat, { Message } from "./components/Chat/Chat";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Segoe UI", "Tahoma", "Arial", "sans-serif"].join(","),
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: ["Segoe UI", "Tahoma", "Arial", "sans-serif"].join(","),
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeFormat, setTimeFormat] = useState<string>("HH:mm");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "שלום! איך אני יכול לעזור לך היום?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | undefined>(undefined);
  const [pendingText, setPendingText] = useState<string | undefined>(undefined);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleMessageEnter = (message: string) => {
    // Simulate API call
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate API response after 2 seconds
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `תודה על ההודעה: "${message}". אני כאן כדי לעזור!`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSimulateError = () => {
    setErrorText(
      "אירעה שגיאה בחיבור לשרת. אנא בדוק את החיבור לאינטרנט ונסה שוב."
    );
    setPendingText(undefined);
  };

  const handleSimulateNetworkError = () => {
    setErrorText("השירות זמנית לא זמין. אנא נסה שוב מאוחר יותר.");
    setPendingText(undefined);
  };

  const handleSimulatePending = () => {
    setPendingText("מתחבר לשרת... אנא המתן.");
    setErrorText(undefined);
  };

  const handleSimulateSending = () => {
    setPendingText("מתחבר לשרת...");
    setErrorText(undefined);
  };

  const handleErrorRetry = () => {
    setErrorText(undefined);
    // Here you would typically retry the failed operation
    console.log("Retrying operation...");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleTimeFormat = () => {
    const formats = [
      "HH:mm",
      "HH:mm:ss",
      "dd/MM/yyyy HH:mm",
      "MM/dd/yyyy hh:mm a",
      "yyyy-MM-dd HH:mm:ss",
    ];
    const currentIndex = formats.indexOf(timeFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    setTimeFormat(formats[nextIndex]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: "100%", position: "relative" }}>
        {/* Demo Controls */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1001,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleSimulateError}
            sx={{ fontSize: "0.75rem" }}
          >
            שגיאת חיבור
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={handleSimulateNetworkError}
            sx={{ fontSize: "0.75rem" }}
          >
            שגיאת שירות
          </Button>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={handleSimulatePending}
            sx={{ fontSize: "0.75rem" }}
          >
            מתחבר
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSimulateSending}
            sx={{ fontSize: "0.75rem" }}
          >
            שולח הודעה
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={toggleTimeFormat}
            sx={{ fontSize: "0.75rem" }}
          >
            {timeFormat}
          </Button>
        </Box>

        <Chat
          messages={messages}
          onMessageEnter={handleMessageEnter}
          isLoading={isLoading}
          maxFileSize={10 * 1024 * 1024} // 10MB
          allowedFileTypes={[".txt", ".pdf", ".doc", ".docx"]}
          errorOverlayText={errorText}
          onErrorRetryClick={handleErrorRetry}
          pendingOverlayText={pendingText}
          timeFormat={timeFormat}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
