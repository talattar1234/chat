import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Alert,
  Button,
  InputAdornment,
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  SmartToy as AIIcon,
  Warning as WarningIcon,
  DeleteSweep as DeleteSweepIcon,
  Mic as MicIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import { chatLabels } from "./Chat.labels";

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
  onNewChatClick?: () => void;
  isLoading?: boolean;
  maxFileSize: number; // required - in bytes
  allowedFileTypes: string[]; // required - no default
  lang?: "he" | "en"; // optional - defaults to "he"
}

const Chat: React.FC<ChatProps> = ({
  messages,
  onMessageEnter,
  onNewChatClick,
  isLoading = false,
  maxFileSize,
  allowedFileTypes,
  lang = "he",
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const t = chatLabels[lang];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleNewChat = () => {
    handleMenuClose();
    onNewChatClick?.();
  };

  const handleExportChat = () => {
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
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update total file size when selected files change
  React.useEffect(() => {
    const totalSize = selectedFiles.reduce(
      (total, file) => total + file.size,
      0
    );
    setTotalFileSize(totalSize);
  }, [selectedFiles]);

  // Update error message when total file size changes
  React.useEffect(() => {
    if (totalFileSize > maxFileSize) {
      const totalSizeMB = (totalFileSize / (1024 * 1024)).toFixed(2);
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
      setError(
        t.totalFilesTooLarge
          .replace("{totalSize}", totalSizeMB)
          .replace("{maxSize}", maxSizeMB)
      );
    } else if (totalFileSize > 0) {
      setError(""); // Clear error when size is within limit
    }
  }, [totalFileSize, maxFileSize, t]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    onMessageEnter?.(inputText.trim(), selectedFiles);
    setInputText("");
    setSelectedFiles([]);
    setError("");
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setError("");

    // Clear the input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Validate file types
    const invalidFiles = files.filter((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      return !allowedFileTypes.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      setError(
        t.unsupportedFileTypes.replace(
          "{fileNames}",
          invalidFiles.map((f) => f.name).join(", ")
        )
      );
      return;
    }

    // Calculate total size of new files + existing files
    const newFilesTotalSize = files.reduce(
      (total, file) => total + file.size,
      0
    );
    const totalSize = totalFileSize + newFilesTotalSize;

    // Add files even if they exceed the limit
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
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
  };

  const handleCopyMessage = (text: string, messageId: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedMessageId(messageId);
        // Clear the copied state after 2 seconds
        setTimeout(() => {
          setCopiedMessageId(null);
        }, 2000);
      })
      .catch(() => {
        // Handle error silently or show a brief error message
        console.error("Failed to copy to clipboard");
      });
  };

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

        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                flexDirection: "column",
                alignItems:
                  message.sender === "user" ? "flex-end" : "flex-start",
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
                        maxHeight: "80px", // 2 rows for message files
                        overflow: "auto",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        p: 0.5,
                        "&::-webkit-scrollbar": {
                          width: "4px",
                        },
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
                            ? t.copiedToClipboard
                            : t.copyToClipboard
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
        </List>
        <div ref={messagesEndRef} />

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
                bgcolor: "background.paper",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                animation: "slideIn 0.5s ease-out",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: 2.5,
                  padding: "3px",
                  background:
                    "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff, #5f27cd)",
                  backgroundSize: "400% 400%",
                  animation:
                    "gradientShift 3s ease infinite, borderGlow 2s ease-in-out infinite",
                  zIndex: -1,
                },
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
                "@keyframes borderGlow": {
                  "0%, 100%": {
                    boxShadow:
                      "0 0 12px rgba(255, 107, 107, 0.3), 0 0 20px rgba(78, 205, 196, 0.2), 0 0 28px rgba(69, 183, 209, 0.15)",
                  },
                  "50%": {
                    boxShadow:
                      "0 0 16px rgba(255, 107, 107, 0.5), 0 0 24px rgba(78, 205, 196, 0.4), 0 0 32px rgba(69, 183, 209, 0.3)",
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    animation:
                      "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                    animationDelay: "0s, 0s, 0s, 0s",
                    boxShadow: "0 0 10px rgba(25, 118, 210, 0.3)",
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
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    animation:
                      "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                    animationDelay: "0.3s, 0s, 0.5s, 0.3s",
                    boxShadow: "0 0 10px rgba(25, 118, 210, 0.3)",
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
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    animation:
                      "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                    animationDelay: "0.6s, 0s, 1s, 0.6s",
                    boxShadow: "0 0 10px rgba(25, 118, 210, 0.3)",
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
      <Box sx={{ p: 2 }}>
        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <>
            <Box
              sx={{
                mb: 1,
                maxHeight: "120px", // 3 rows * ~40px each
                overflow: "auto",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                p: 0.5, // Add some padding for scrollbar
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "divider",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "text.secondary",
                  borderRadius: "3px",
                  "&:hover": {
                    background: "text.primary",
                  },
                },
              }}
            >
              {selectedFiles.map((file, index) => (
                <Chip
                  key={index}
                  icon={<span>{getFileIcon(file.name)}</span>}
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  onDelete={() => removeFile(index)}
                  color="primary"
                  variant="outlined"
                  sx={{ flexShrink: 0 }} // Prevent chips from shrinking
                />
              ))}
            </Box>

            {/* File size progress bar */}
            <Box sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {t.fileSize}
                  </Typography>
                  {totalFileSize > maxFileSize && (
                    <WarningIcon
                      sx={{
                        fontSize: 16,
                        color: "error.main",
                        animation: "pulse 2s infinite",
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      color:
                        totalFileSize > maxFileSize ? "error.main" : "inherit",
                      fontWeight:
                        totalFileSize > maxFileSize ? "bold" : "normal",
                    }}
                  >
                    {formatFileSize(totalFileSize)} /{" "}
                    {formatFileSize(maxFileSize)}
                  </Typography>
                  <Tooltip title={t.deleteAllFiles}>
                    <IconButton
                      size="small"
                      onClick={clearAllFiles}
                      sx={{
                        p: 0.5,
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "error.contrastText",
                        },
                      }}
                    >
                      <DeleteSweepIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((totalFileSize / maxFileSize) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    backgroundColor:
                      totalFileSize > maxFileSize
                        ? "error.main"
                        : "primary.main",
                    animation:
                      totalFileSize > maxFileSize
                        ? "pulse 2s infinite"
                        : "none",
                  },
                  "@keyframes pulse": {
                    "0%": {
                      opacity: 1,
                    },
                    "50%": {
                      opacity: 0.7,
                    },
                    "100%": {
                      opacity: 1,
                    },
                  },
                  "@keyframes typing": {
                    "0%, 60%, 100%": {
                      transform: "translateY(0)",
                      opacity: 0.4,
                    },
                    "30%": {
                      transform: "translateY(-10px)",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Error Alert - moved below progress bar */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}

        {/* Input Field */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={t.uploadFiles}>
                    <IconButton onClick={() => fileInputRef.current?.click()}>
                      <AttachFileIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          {/* Audio Recorder Component */}
          <AudioRecorder
            onTextResult={(text) => {
              console.log("Chat received text:", text);
              setInputText((prev) => {
                const newText = prev + (prev ? " " : "") + text;
                console.log("New input text:", newText);
                return newText;
              });
            }}
            onError={(error) => {
              console.error("AudioRecorder error:", error);
              setError(error);
            }}
            onRecordingChange={(recording) => {
              setIsRecording(recording);
            }}
            lang={lang}
          />

          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || totalFileSize > maxFileSize}
            sx={{ minWidth: 56, height: 56 }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFileTypes.join(",")}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {/* File upload info */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {t.supportedFiles} {allowedFileTypes.join(", ")}
          </Typography>
          {selectedFiles.length > 0 && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {formatFileSize(totalFileSize)} / {formatFileSize(maxFileSize)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
