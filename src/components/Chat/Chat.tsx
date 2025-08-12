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
  useTheme,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  SupportAgent as AIIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
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
  inputDisabled?: boolean; // optional - disables all input controls
  maxFileSize: number; // required - in bytes
  allowedFileTypes: string[]; // required - no default
  lang?: "he" | "en"; // optional - defaults to "he"
  errorOverlayText?: string; // optional - error message to display as overlay
  onErrorRetryClick?: () => void; // optional - callback when retry is clicked
  pendingOverlayText?: string; // optional - pending message to display as overlay
}

const Chat: React.FC<ChatProps> = ({
  messages,
  onMessageEnter,
  onStopClick,
  onNewChatClick,
  isLoading = false,
  inputDisabled = false,
  maxFileSize,
  allowedFileTypes,
  lang = "he",
  errorOverlayText,
  onErrorRetryClick,
  pendingOverlayText,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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

    // Create filename with date and time
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    a.download = `chat-history-${dateStr}-${timeStr}.txt`;

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
      {/* Error Banner */}
      {errorOverlayText && (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            mb: 2,
            animation: "slideDown 0.3s ease-out",
            "@keyframes slideDown": {
              "0%": {
                opacity: 0,
                transform: "translateY(-20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: "16px",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #f44336, #ff5722, #f44336)",
                animation: "gradientShift 2s ease-in-out infinite",
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
              },
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": {
                    transform: "scale(1)",
                  },
                  "50%": {
                    transform: "scale(1.1)",
                  },
                },
              },
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
            action={
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {onErrorRetryClick && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={onErrorRetryClick}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      borderColor: "error.main",
                      color: "error.main",
                      fontSize: "0.7rem",
                      px: 1.2,
                      py: 0.3,
                      minWidth: "80px",
                      whiteSpace: "nowrap",
                      height: "28px",
                      "& .MuiButton-startIcon": {
                        marginRight: 0.5,
                        "& .MuiSvgIcon-root": {
                          fontSize: "0.8rem",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "error.main",
                        color: "white",
                        borderColor: "error.main",
                      },
                    }}
                  >
                    {t.retryAction}
                  </Button>
                )}
              </Box>
            }
          >
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.4,
                color: "text.primary",
                textAlign: lang === "he" ? "right" : "left",
                direction: lang === "he" ? "rtl" : "ltr",
                fontWeight: 500,
              }}
            >
              {errorOverlayText}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Pending Banner */}
      {pendingOverlayText && (
        <Box
          sx={{
            position: "sticky",
            top: errorOverlayText ? "80px" : 0,
            zIndex: 999,
            mb: 2,
            animation: "slideDown 0.3s ease-out",
            "@keyframes slideDown": {
              "0%": {
                opacity: 0,
                transform: "translateY(-20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Alert
            severity="info"
            sx={{
              borderRadius: "16px",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #2196f3, #21cbf3, #2196f3)",
                animation: "gradientShift 2s ease-in-out infinite",
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
              },
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
                animation: "spin 2s linear infinite",
                "@keyframes spin": {
                  "0%": {
                    transform: "rotate(0deg)",
                  },
                  "100%": {
                    transform: "rotate(360deg)",
                  },
                },
              },
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
            icon={
              <CircularProgress
                size={24}
                sx={{
                  color: "info.main",
                  animation: "spin 1s linear infinite",
                  "@keyframes spin": {
                    "0%": {
                      transform: "rotate(0deg)",
                    },
                    "100%": {
                      transform: "rotate(360deg)",
                    },
                  },
                }}
              />
            }
          >
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.4,
                color: "text.primary",
                textAlign: lang === "he" ? "right" : "left",
                direction: lang === "he" ? "rtl" : "ltr",
                fontWeight: 500,
              }}
            >
              {pendingOverlayText}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Messages Area with Sticky Header */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          pt: 0, // Remove top padding since we have the sticky header inside
          background: isDark
            ? "linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 30%, #0a0a0a 70%, #0f0f0f 100%), linear-gradient(45deg, #1a1a2e 0%, transparent 20%, transparent 80%, #16213e 100%)"
            : "linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 50%, #fff8f0 100%)",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.3)",
            borderRadius: "6px",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(0, 0, 0, 0.2)",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(0, 0, 0, 0.5)",
            },
          },
          "&::-webkit-scrollbar-corner": {
            background: "transparent",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            pointerEvents: "none",
          },
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
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: "flex-end",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                : "0 4px 20px rgba(0, 0, 0, 0.05)",
            borderRadius: "18px",
            width: "fit-content",
            alignSelf: "flex-end",
            ml: "auto",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              padding: "1px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
                  : "linear-gradient(135deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02))",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              zIndex: -1,
            },
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
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                position: "relative",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                    : "0 4px 20px rgba(0, 0, 0, 0.05)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "18px",
                  padding: "1px",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
                      : "linear-gradient(135deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02))",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  zIndex: -1,
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

      <Divider
        sx={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
          height: "1px",
          border: "none",
        }}
      />

      {/* Input Area */}
      <Box
        sx={{
          background: isDark
            ? "linear-gradient(135deg, #0a0a0a 0%, #0d0d0d 100%), linear-gradient(45deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 50%, rgba(255, 193, 7, 0.05) 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderTop: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
          },
        }}
      >
        <ChatInput
          onMessageEnter={onMessageEnter || (() => {})}
          onStopClick={onStopClick}
          isLoading={isLoading}
          disabled={inputDisabled}
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
    </Box>
  );
};

export default Chat;
