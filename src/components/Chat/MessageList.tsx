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
  SupportAgent as AIIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
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

    // Custom components for react-markdown that use Material-UI Typography
    const markdownComponents: any = {
      p: ({ children, ...props }: any) => (
        <Typography variant="body1" component="p" sx={{ mb: 1, "&:last-child": { mb: 0 } }} {...props}>
          {children}
        </Typography>
      ),
      h1: ({ children, ...props }: any) => (
        <Typography variant="h4" component="h1" sx={{ mb: 1, mt: 2 }} {...props}>
          {children}
        </Typography>
      ),
      h2: ({ children, ...props }: any) => (
        <Typography variant="h5" component="h2" sx={{ mb: 1, mt: 2 }} {...props}>
          {children}
        </Typography>
      ),
      h3: ({ children, ...props }: any) => (
        <Typography variant="h6" component="h3" sx={{ mb: 1, mt: 2 }} {...props}>
          {children}
        </Typography>
      ),
      h4: ({ children, ...props }: any) => (
        <Typography variant="subtitle1" component="h4" sx={{ mb: 1, mt: 1, fontWeight: "bold" }} {...props}>
          {children}
        </Typography>
      ),
      h5: ({ children, ...props }: any) => (
        <Typography variant="subtitle2" component="h5" sx={{ mb: 1, mt: 1, fontWeight: "bold" }} {...props}>
          {children}
        </Typography>
      ),
      h6: ({ children, ...props }: any) => (
        <Typography variant="body2" component="h6" sx={{ mb: 1, mt: 1, fontWeight: "bold" }} {...props}>
          {children}
        </Typography>
      ),
      strong: ({ children, ...props }: any) => (
        <Typography component="span" sx={{ fontWeight: "bold" }} {...props}>
          {children}
        </Typography>
      ),
      em: ({ children, ...props }: any) => (
        <Typography component="span" sx={{ fontStyle: "italic" }} {...props}>
          {children}
        </Typography>
      ),
      code: ({ children, ...props }: any) => (
        <Typography
          component="code"
          sx={{
            backgroundColor: (theme) => theme.palette.mode === "dark" 
              ? "rgba(255, 255, 255, 0.1)" 
              : "rgba(0, 0, 0, 0.1)",
            padding: "2px 4px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "0.875em",
          }}
          {...props}
        >
          {children}
        </Typography>
      ),
      pre: ({ children, ...props }: any) => (
        <Box
          component="pre"
          sx={{
            backgroundColor: (theme) => theme.palette.mode === "dark" 
              ? "rgba(255, 255, 255, 0.05)" 
              : "rgba(0, 0, 0, 0.05)",
            padding: 2,
            borderRadius: 1,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "0.875em",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            mb: 1,
          }}
          {...props}
        >
          {children}
        </Box>
      ),
      blockquote: ({ children, ...props }: any) => (
        <Box
          component="blockquote"
          sx={{
            borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
            paddingLeft: 2,
            margin: "16px 0",
            fontStyle: "italic",
            color: "text.secondary",
          }}
          {...props}
        >
          {children}
        </Box>
      ),
      ul: ({ children, ...props }: any) => (
        <Box component="ul" sx={{ mb: 1, pl: 2 }} {...props}>
          {children}
        </Box>
      ),
      ol: ({ children, ...props }: any) => (
        <Box component="ol" sx={{ mb: 1, pl: 2 }} {...props}>
          {children}
        </Box>
      ),
      li: ({ children, ...props }: any) => (
        <Typography component="li" variant="body1" sx={{ mb: 0.5 }} {...props}>
          {children}
        </Typography>
      ),
      a: ({ children, href, ...props }: any) => (
        <Typography
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          {...props}
        >
          {children}
        </Typography>
      ),
    };

    // Function to render message content with markdown support
    const renderMessageContent = (text: string) => {
      // Check if the text contains markdown patterns
      const hasMarkdown = /[*_`#\[\]()>|]/.test(text);
      
      if (hasMarkdown) {
        return (
          <ReactMarkdown components={markdownComponents}>
            {text}
          </ReactMarkdown>
        );
      } else {
        return (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {text}
          </Typography>
        );
      }
    };

    return (
      <List
        sx={{
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            borderRadius: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.35)"
                : "rgba(0, 0, 0, 0.35)",
            borderRadius: "5px",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(0, 0, 0, 0.2)",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.55)"
                  : "rgba(0, 0, 0, 0.55)",
            },
          },
          "&::-webkit-scrollbar-corner": {
            background: "transparent",
          },
        }}
      >
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <ListItem
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
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
              <Avatar sx={{ bgcolor: "primary.main", mt: 1 }}>
                <AIIcon />
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: "text.primary",
                  borderRadius: "18px",
                  maxWidth: "100%",
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.15)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                      : "0 4px 20px rgba(0, 0, 0, 0.15)",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "18px",
                    padding: "1px",
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
                        : "linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.12))",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    zIndex: -1,
                  },
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {lang === "he"
                    ? "שלום! ברוך הבא לצ'אט שלנו. אני כאן כדי לעזור לך בכל שאלה או בקשה שיש לך. איך אוכל לסייע לך היום?"
                    : "Hello! Welcome to our chat. I'm here to help you with any questions or requests you may have. How can I assist you today?"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      textAlign: "right",
                    }}
                  >
                    {new Date().toLocaleTimeString(
                      lang === "he" ? "he-IL" : "en-US",
                      { hour12: false }
                    )}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </ListItem>
        )}

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
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: (theme) => {
                    if (message.sender === "user") {
                      return theme.palette.mode === "dark"
                        ? "rgba(0, 122, 255, 0.15)"
                        : "rgba(0, 122, 255, 0.25)";
                    } else {
                      return theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.95)";
                    }
                  },
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: (theme) =>
                    message.sender === "user"
                      ? theme.palette.mode === "dark"
                        ? "#ffffff"
                        : "#000000"
                      : "text.primary",
                  borderRadius: "18px",
                  maxWidth: "100%",
                  border: (theme) => {
                    if (message.sender === "user") {
                      return theme.palette.mode === "dark"
                        ? "1px solid rgba(0, 122, 255, 0.3)"
                        : "1px solid rgba(0, 122, 255, 0.4)";
                    } else {
                      return theme.palette.mode === "dark"
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(0, 0, 0, 0.15)";
                    }
                  },
                  boxShadow: (theme) => {
                    if (message.sender === "user") {
                      return theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0, 122, 255, 0.15)"
                        : "0 4px 20px rgba(0, 122, 255, 0.2)";
                    } else {
                      return theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                        : "0 4px 20px rgba(0, 0, 0, 0.15)";
                    }
                  },
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "18px",
                    padding: "1px",
                    background: (theme) => {
                      if (message.sender === "user") {
                        return theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, rgba(0, 122, 255, 0.3), rgba(0, 122, 255, 0.1))"
                          : "linear-gradient(135deg, rgba(0, 122, 255, 0.4), rgba(0, 122, 255, 0.2))";
                      } else {
                        return theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
                          : "linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.12))";
                      }
                    },
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    zIndex: -1,
                  },
                }}
              >
                {renderMessageContent(message.text)}

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
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.05)",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: (theme) => {
                          if (message.sender === "user") {
                            return theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.4)"
                              : "rgba(255, 255, 255, 0.5)";
                          } else {
                            return theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)";
                          }
                        },
                        borderRadius: "4px",
                        border: (theme) => {
                          if (message.sender === "user") {
                            return theme.palette.mode === "dark"
                              ? "1px solid rgba(255, 255, 255, 0.3)"
                              : "1px solid rgba(255, 255, 255, 0.4)";
                          } else {
                            return theme.palette.mode === "dark"
                              ? "1px solid rgba(255, 255, 255, 0.2)"
                              : "1px solid rgba(0, 0, 0, 0.2)";
                          }
                        },
                        "&:hover": {
                          background: (theme) => {
                            if (message.sender === "user") {
                              return theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.6)"
                                : "rgba(255, 255, 255, 0.7)";
                            } else {
                              return theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.5)"
                                : "rgba(0, 0, 0, 0.5)";
                            }
                          },
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
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      textAlign: message.sender === "user" ? "left" : "right",
                    }}
                  >
                    {message.timestamp.toLocaleTimeString(
                      lang === "he" ? "he-IL" : "en-US",
                      { hour12: false }
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
