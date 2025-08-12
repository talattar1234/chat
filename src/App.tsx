import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Chat, { Message } from "./components/Chat/Chat";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "שלום! ברוך הבא לצ'אט שלנו. אני כאן כדי לעזור לך בכל שאלה או בקשה שיש לך. איך אוכל לסייע לך היום?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const handleMessageEnter = (message: string, files?: File[]) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
      files,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "תודה על ההודעה שלך! אני מעבד את המידע ואחזור אליך בקרוב.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleNewChatClick = () => {
    // Clear all messages and start a new chat
    setMessages([
      {
        id: "1",
        text: "שלום! ברוך הבא לצ'אט החדש שלנו. אני כאן כדי לעזור לך בכל שאלה או בקשה שיש לך. איך אוכל לסייע לך היום?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Container maxWidth="md" sx={{ height: "100vh", p: 0 }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h5" component="h1">
            צ'אט אפליקציה
          </Typography>
          <Typography variant="body2">
            דוגמה לשימוש ברכיב Chat עם MUI ו-TypeScript
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Chat
            messages={messages}
            onMessageEnter={handleMessageEnter}
            onNewChatClick={handleNewChatClick}
            isLoading={false}
            inputDisabled={false} // Set to true to disable all input controls
            allowedFileTypes={[".txt", ".csv", ".pdf", ".doc", ".docx"]}
            maxFileSize={10 * 1024 * 1024} // 10MB
          />
        </Box>
      </Box>
    </Container>
  );
};

export default App;
