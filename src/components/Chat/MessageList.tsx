import React, { useRef, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  SmartToy as AIIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { Message } from "./Chat";

interface MessageListProps {
  messages: Message[];
  lang: "he" | "en";
  copiedMessageId: string | null;
  onCopyMessage: (text: string, messageId: string) => void;
  copyToClipboardLabel: string;
  copiedToClipboardLabel: string;
}

const MessageList = React.memo<MessageListProps>(
  ({
    messages,
    lang,
    copiedMessageId,
    onCopyMessage,
    copyToClipboardLabel,
    copiedToClipboardLabel,
  }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, scrollToBottom]);

    const formatFileSize = useCallback((bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);

    const getFileIcon = useCallback((fileName: string) => {
      const extension = fileName.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "pdf":
          return "📄";
        case "doc":
        case "docx":
          return "📝";
        case "txt":
          return "📄";
        case "csv":
          return "📊";
        default:
          return "📎";
      }
    }, []);

    const handleCopyMessage = useCallback(
      (text: string, messageId: string) => {
        onCopyMessage(text, messageId);
      },
      [onCopyMessage]
    );

    return (
      <List>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              flexDirection: "column",
              alignItems: message.sender === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                maxWidth: "70%",
              }}
            >
              {message.sender === "ai" && (
                <Avatar sx={{ bgcolor: "primary.main", mt: 1 }}>
                  <AIIcon />
                </Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor:
                    message.sender === "user"
                      ? "primary.main"
                      : "background.paper",
                  color:
                    message.sender === "user"
                      ? "primary.contrastText"
                      : "text.primary",
                  borderRadius: 2,
                  maxWidth: "100%",
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {message.text}
                </Typography>

                {/* Display attached files */}
                {message.files && message.files.length > 0 && (
                  <Box
                    sx={{
                      mt: 1,
                      maxHeight: "80px",
                      overflow: "auto",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      p: 0.5,
                      "&::-webkit-scrollbar": { width: "4px" },
                      "&::-webkit-scrollbar-track": {
                        background: "transparent",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background:
                          message.sender === "user"
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.2)",
                        borderRadius: "2px",
                        "&:hover": {
                          background:
                            message.sender === "user"
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.3)",
                        },
                      },
                    }}
                  >
                    {message.files.map((file, index) => (
                      <Chip
                        key={index}
                        icon={<span>{getFileIcon(file.name)}</span>}
                        label={`${file.name} (${formatFileSize(file.size)})`}
                        variant="outlined"
                        size="small"
                        sx={{
                          flexShrink: 0,
                          color:
                            message.sender === "user"
                              ? "inherit"
                              : "text.primary",
                          borderColor:
                            message.sender === "user"
                              ? "rgba(255,255,255,0.3)"
                              : "divider",
                        }}
                      />
                    ))}
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  {message.sender === "ai" && (
                    <Tooltip
                      title={
                        copiedMessageId === message.id
                          ? copiedToClipboardLabel
                          : copyToClipboardLabel
                      }
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleCopyMessage(message.text, message.id)
                        }
                        sx={{
                          p: 0.5,
                          color: "text.secondary",
                          "&:hover": {
                            backgroundColor: "action.hover",
                            color: "text.primary",
                          },
                        }}
                      >
                        <CopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      textAlign: message.sender === "user" ? "left" : "right",
                    }}
                  >
                    {message.timestamp.toLocaleTimeString(
                      lang === "he" ? "he-IL" : "en-US"
                    )}
                  </Typography>
                </Box>
              </Paper>
              {message.sender === "user" && (
                <Avatar sx={{ bgcolor: "secondary.main", mt: 1 }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
    );
  }
);

MessageList.displayName = "MessageList";

export default MessageList;
