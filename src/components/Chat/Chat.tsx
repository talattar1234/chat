import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  SmartToy as AIIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { chatLabels } from "./Chat.labels";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export interface FileInfo {
  name: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  files?: FileInfo[];
}

export interface ChatProps {
  messages: Message[];
  onMessageEnter?: (message: string, files?: File[]) => void;
  onStopClick?: () => void;
  onNewChatClick?: () => void;
  isLoading?: boolean;
  maxFileSize: number; // required - in bytes
  allowedFileTypes: string[]; // required - no default
  lang?: "he" | "en"; // optional - defaults to "he"
}

const Chat: React.FC<ChatProps> = ({
  messages,
  onMessageEnter,
  onStopClick,
  onNewChatClick,
  isLoading = false,
  maxFileSize,
  allowedFileTypes,
  lang = "he",
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const t = chatLabels[lang];

  // Memoized callbacks
  const handleCopyMessage = useCallback((text: string, messageId: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      })
      .catch(() => {
        console.error("Failed to copy to clipboard");
      });
  }, []);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleNewChat = useCallback(() => {
    handleMenuClose();
    onNewChatClick?.();
  }, [handleMenuClose, onNewChatClick]);

  const handleExportChat = useCallback(() => {
    handleMenuClose();

    // Create a text file with chat history
    const chatHistory = messages
      .map((message) => {
        const timestamp = message.timestamp.toLocaleString(
          lang === "he" ? "he-IL" : "en-US"
        );
        const sender =
          message.sender === "user" ? (lang === "he" ? "משתמש" : "User") : "AI";
        return `[${timestamp}] ${sender}: ${message.text}`;
      })
      .join("\n\n");

    const blob = new Blob([chatHistory], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, lang, handleMenuClose]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Messages Area with Sticky Header */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          pt: 0, // Remove top padding since we have the sticky header inside
        }}
      >
        {/* Sticky Header with Menu */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            p: 0.5,
            mb: 1,
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(1px)",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            borderRadius: 1,
            width: "fit-content",
            alignSelf: "flex-end",
            ml: "auto",
          }}
        >
          <Tooltip title={t.menu}>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                p: 0.5,
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  color: "text.primary",
                },
              }}
            >
              <MoreVertIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 0.5,
                minWidth: 150,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: 2,
              },
            }}
          >
            {onNewChatClick && (
              <MenuItem onClick={handleNewChat}>
                <ListItemIcon>
                  <AddIcon fontSize="small" />
                </ListItemIcon>
                {t.newChat}
              </MenuItem>
            )}
            <MenuItem onClick={handleExportChat}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              {t.exportChat}
            </MenuItem>
          </Menu>
        </Box>

        <MessageList
          messages={messages}
          lang={lang}
          copiedMessageId={copiedMessageId}
          onCopyMessage={handleCopyMessage}
          copyToClipboardLabel={t.copyToClipboard}
          copiedToClipboardLabel={t.copiedToClipboard}
        />

        {/* AI Typing Indicator */}
        {isLoading && (
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 32,
                height: 32,
                animation: "bounce 2s ease-in-out infinite",
                "@keyframes bounce": {
                  "0%, 20%, 50%, 80%, 100%": {
                    transform: "translateY(0)",
                  },
                  "40%": {
                    transform: "translateY(-5px)",
                  },
                  "60%": {
                    transform: "translateY(-3px)",
                  },
                },
              }}
            >
              <AIIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "background.paper",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-2px",
                  borderRadius: "10px",
                  padding: "2px",
                  background:
                    "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff, #5f27cd)",
                  backgroundSize: "400% 400%",
                  animation: "gradientShift 3s ease infinite",
                  zIndex: -1,
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                },
                animation: "slideIn 0.5s ease-out",
                "@keyframes slideIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(10px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
                "@keyframes gradientShift": {
                  "0%": {
                    backgroundPosition: "0% 50%",
                  },
                  "50%": {
                    backgroundPosition: "100% 50%",
                  },
                  "100%": {
                    backgroundPosition: "0% 50%",
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    animation:
                      "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                    animationDelay: "0s, 0s, 0s, 0s",
                    boxShadow: "0 0 8px rgba(25, 118, 210, 0.3)",
                    "@keyframes colorShift": {
                      "0%, 100%": {
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      },
                      "50%": {
                        background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                      },
                    },
                    "@keyframes rotate": {
                      "0%": {
                        transform: "rotate(0deg)",
                      },
                      "100%": {
                        transform: "rotate(360deg)",
                      },
                    },
                    "@keyframes zoom": {
                      "0%, 100%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.2)",
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    animation:
                      "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                    animationDelay: "0.3s, 0s, 0.5s, 0.3s",
                    boxShadow: "0 0 8px rgba(25, 118, 210, 0.3)",
                    "@keyframes colorShift": {
                      "0%, 100%": {
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      },
                      "50%": {
                        background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                      },
                    },
                    "@keyframes rotate": {
                      "0%": {
                        transform: "rotate(0deg)",
                      },
                      "100%": {
                        transform: "rotate(360deg)",
                      },
                    },
                    "@keyframes zoom": {
                      "0%, 100%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.2)",
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    animation:
                      "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                    animationDelay: "0.6s, 0s, 1s, 0.6s",
                    boxShadow: "0 0 8px rgba(25, 118, 210, 0.3)",
                    "@keyframes colorShift": {
                      "0%, 100%": {
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      },
                      "50%": {
                        background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                      },
                    },
                    "@keyframes rotate": {
                      "0%": {
                        transform: "rotate(0deg)",
                      },
                      "100%": {
                        transform: "rotate(360deg)",
                      },
                    },
                    "@keyframes zoom": {
                      "0%, 100%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.2)",
                      },
                    },
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.7,
                  animation: "fadeInOut 2s ease-in-out infinite",
                  "@keyframes fadeInOut": {
                    "0%, 100%": {
                      opacity: 0.7,
                    },
                    "50%": {
                      opacity: 1,
                    },
                  },
                }}
              >
                {t.aiThinking}
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Input Area */}
      <ChatInput
        onMessageEnter={onMessageEnter || (() => {})}
        onStopClick={onStopClick}
        isLoading={isLoading}
        maxFileSize={maxFileSize}
        allowedFileTypes={allowedFileTypes}
        lang={lang}
        placeholder={t.placeholder}
        fileSizeLabel={t.fileSize}
        deleteAllFilesLabel={t.deleteAllFiles}
        uploadFilesLabel={t.uploadFiles}
        supportedFilesLabel={t.supportedFiles}
        totalFilesTooLarge={t.totalFilesTooLarge}
        unsupportedFileTypes={t.unsupportedFileTypes}
        stopGenerationLabel={t.stopGeneration}
      />
    </Box>
  );
};

export default Chat;
