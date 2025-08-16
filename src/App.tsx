import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Button,
} from "@mui/material";
import Chat, { Message } from "./components/Chat/Chat";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
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
          }}
        >
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
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
