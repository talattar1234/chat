import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  IconButton,
  useTheme,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  SupportAgent as AIIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { chatLabels } from "./Chat.labels";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import BubbleBackground from "../BubbleBackground";
import zIndex from "@mui/material/styles/zIndex";

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
  timeFormat?: string; // optional - custom time format string. Supported tokens: yyyy/yy (year), MM/M (month), dd/d (day), HH/H (24h), hh/h (12h), mm/m (minutes), ss/s (seconds), SSS/SS/S (milliseconds), a/A (AM/PM). Defaults to "HH:mm"
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
  timeFormat = "HH:mm",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showNewChatConfirmation, setShowNewChatConfirmation] = useState(false);

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

  const handleNewChat = useCallback(() => {
    setShowNewChatConfirmation(true);
  }, []);

  const handleConfirmNewChat = useCallback(() => {
    setShowNewChatConfirmation(false);
    onNewChatClick?.();
  }, [onNewChatClick]);

  const handleCancelNewChat = useCallback(() => {
    setShowNewChatConfirmation(false);
  }, []);

  const handleExportChat = useCallback(() => {
    // Helper function to format date according to custom format
    const formatDate = (date: Date, format: string): string => {
      const pad = (num: number): string => num.toString().padStart(2, '0');
      const pad3 = (num: number): string => num.toString().padStart(3, '0');
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();
      
      return format
        .replace('yyyy', year.toString())
        .replace('yy', year.toString().slice(-2))
        .replace('MM', pad(month))
        .replace('M', month.toString())
        .replace('dd', pad(day))
        .replace('d', day.toString())
        .replace('HH', pad(hours))
        .replace('H', hours.toString())
        .replace('hh', pad(hours % 12 || 12))
        .replace('h', (hours % 12 || 12).toString())
        .replace('mm', pad(minutes))
        .replace('m', minutes.toString())
        .replace('ss', pad(seconds))
        .replace('s', seconds.toString())
        .replace('SSS', pad3(milliseconds))
        .replace('SS', pad(Math.floor(milliseconds / 10)))
        .replace('S', Math.floor(milliseconds / 100).toString())
        .replace('a', hours >= 12 ? 'PM' : 'AM')
        .replace('A', hours >= 12 ? 'PM' : 'AM');
    };

    // Create a text file with chat history
    const chatHistory = messages
      .map((message) => {
        const timestamp = formatDate(message.timestamp, timeFormat);
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
  }, [messages, lang, timeFormat]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* <div
        style={{
          pointerEvents: "none",
          zIndex: 3,
          position: "absolute",
          top: 0,
          opacity: 0.15,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <BubbleBackground />
      </div> */}

      {/* Messages Area with Integrated Toolbar */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          overflowX: "hidden",
          background: isDark
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 30%, #1e1e1e 70%, #121212 100%), linear-gradient(45deg, #2d2d2d 0%, transparent 20%, transparent 80%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 50%, #fff8f0 100%)",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(0, 0, 0, 0.3)",
            borderRadius: "6px",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.15)"
                : "1px solid rgba(0, 0, 0, 0.2)",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.4)"
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
            background: isDark
              ? "radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.02) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.02) 0%, transparent 50%)"
              : "radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.03) 0%, transparent 50%)",
            animation: "subtleFloat 20s ease-in-out infinite",
            "@keyframes subtleFloat": {
              "0%, 100%": {
                opacity: 0.3,
                transform: "translateY(0px) scale(1)",
              },
              "50%": {
                opacity: 0.5,
                transform: "translateY(-10px) scale(1.02)",
              },
            },
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            background: isDark
              ? "linear-gradient(45deg, transparent 30%, rgba(233, 30, 99, 0.01) 50%, transparent 70%), linear-gradient(-45deg, transparent 30%, rgba(0, 150, 136, 0.01) 50%, transparent 70%)"
              : "linear-gradient(45deg, transparent 30%, rgba(233, 30, 99, 0.02) 50%, transparent 70%), linear-gradient(-45deg, transparent 30%, rgba(0, 150, 136, 0.02) 50%, transparent 70%)",
            animation: "colorShift 15s ease-in-out infinite",
            "@keyframes colorShift": {
              "0%, 100%": {
                opacity: 0.2,
                transform: "rotate(0deg)",
              },
              "50%": {
                opacity: 0.4,
                transform: "rotate(180deg)",
              },
            },
          },
        }}
      >
        {/* Sticky Toolbar inside Messages Area */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.65)"
                : "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 2px 20px rgba(0, 0, 0, 0.15)"
                : "0 2px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Top Toolbar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              minHeight: "48px",
            }}
          >
            <Tooltip title={t.exportChat}>
              <IconButton
                onClick={handleExportChat}
                size="small"
                sx={{
                  p: 1,
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.7)"
                      : "text.secondary",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "text.primary",
                  },
                }}
              >
                <DownloadIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {onNewChatClick && (
              <Tooltip title={t.newChat}>
                <IconButton
                  onClick={handleNewChat}
                  size="small"
                  sx={{
                    p: 1,
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "text.secondary",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.08)",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "text.primary",
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Error Banner */}
          {errorOverlayText && (
            <Box
              sx={{
                px: 2,
                pb: 2,
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
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
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
                    background:
                      "linear-gradient(90deg, #f44336, #ff5722, #f44336)",
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
                          // fontSize: "0.7rem",
                          px: 1.2,
                          py: 0.3,
                          minWidth: "80px",
                          whiteSpace: "nowrap",
                          height: "28px",
                          "& .MuiButton-startIcon": {
                            marginRight: 0.5,
                            // "& .MuiSvgIcon-root": {
                            //   fontSize: "0.8rem",
                            // },
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
                px: 2,
                pb: 2,
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
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
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
                    background:
                      "linear-gradient(90deg, #2196f3, #21cbf3, #2196f3)",
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
        </Box>

        {/* Messages Content */}
        <Box sx={{ p: 2 }}>
          <MessageList
            messages={messages}
            lang={lang}
            timeFormat={timeFormat}
            copiedMessageId={copiedMessageId}
            onCopyMessage={handleCopyMessage}
            copyToClipboardLabel={t.copyToClipboard}
            copiedToClipboardLabel={t.copiedToClipboard}
          />
        </Box>
      </Box>

      {/* AI Typing Indicator - Fixed between messages and input */}
      {isLoading && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: isDark
              ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%), linear-gradient(45deg, rgba(25, 118, 210, 0.08) 0%, rgba(156, 39, 176, 0.08) 50%, rgba(255, 193, 7, 0.08) 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderTop: isDark
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid rgba(0,0,0,0.05)",
            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid rgba(0,0,0,0.05)",
          }}
        >
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
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              position: "relative",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.15)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                  : "0 4px 20px rgba(0, 0, 0, 0.05)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "18px",
                padding: "1px",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
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

      {/* Input Area */}
      <Box
        sx={{
          background: isDark
            ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%), linear-gradient(45deg, rgba(25, 118, 210, 0.08) 0%, rgba(156, 39, 176, 0.08) 50%, rgba(255, 193, 7, 0.08) 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderTop: isDark
            ? "1px solid rgba(255,255,255,0.15)"
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
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)"
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

      {/* New Chat Confirmation Dialog */}
      <Dialog
        open={showNewChatConfirmation}
        onClose={handleCancelNewChat}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
            minWidth: "300px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "start",
            direction: lang === "he" ? "rtl" : "ltr",
            fontWeight: 400,
            fontSize: "1.1rem",
            pb: 1,
          }}
        >
          {t.newChatConfirmationTitle}
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: lang === "he" ? "right" : "left",
            direction: lang === "he" ? "rtl" : "ltr",
            pb: 2,
          }}
        >
          <Typography variant="body1">
            {t.newChatConfirmationMessage}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "flex-end",
            gap: 1,
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={handleCancelNewChat}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
              py: 1,
            }}
          >
            {t.newChatConfirmationCancel}
          </Button>
          <Button
            onClick={handleConfirmNewChat}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
              py: 1,
            }}
          >
            {t.newChatConfirmationOK}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
