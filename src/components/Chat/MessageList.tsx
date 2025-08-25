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
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  SupportAgent as AIIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { Message } from "./Chat";

interface MessageListProps {
  messages: Message[];
  lang: "he" | "en";
  timeFormat: string;
  copiedMessageId: string | null;
  onCopyMessage: (text: string, messageId: string) => void;
  copyToClipboardLabel: string;
  copiedToClipboardLabel: string;
  isLoading?: boolean;
  aiThinkingLabel?: string;
  showWelcomeMessage?: boolean;
}

const MessageList = React.memo<MessageListProps>(
  ({
    messages,
    lang,
    timeFormat,
    copiedMessageId,
    onCopyMessage,
    copyToClipboardLabel,
    copiedToClipboardLabel,
    isLoading = false,
    aiThinkingLabel = "AI is thinking...",
    showWelcomeMessage = true,
  }) => {
    const theme = useTheme();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Helper function to format date using date-fns
    const formatDate = useCallback(
      (date: Date, formatString: string): string => {
        return format(date, formatString);
      },
      []
    );

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
        <Typography
          variant="body1"
          component="p"
          sx={{
            mb: 1,
            "&:last-child": { mb: 0 },
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
          {...props}
        >
          {children}
        </Typography>
      ),
      h1: ({ children, ...props }: any) => (
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 1, mt: 2 }}
          {...props}
        >
          {children}
        </Typography>
      ),
      h2: ({ children, ...props }: any) => (
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 1, mt: 2 }}
          {...props}
        >
          {children}
        </Typography>
      ),
      h3: ({ children, ...props }: any) => (
        <Typography
          variant="h6"
          component="h3"
          sx={{ mb: 1, mt: 2 }}
          {...props}
        >
          {children}
        </Typography>
      ),
      h4: ({ children, ...props }: any) => (
        <Typography
          variant="subtitle1"
          component="h4"
          sx={{ mb: 1, mt: 1, fontWeight: "bold" }}
          {...props}
        >
          {children}
        </Typography>
      ),
      h5: ({ children, ...props }: any) => (
        <Typography
          variant="subtitle2"
          component="h5"
          sx={{ mb: 1, mt: 1, fontWeight: "bold" }}
          {...props}
        >
          {children}
        </Typography>
      ),
      h6: ({ children, ...props }: any) => (
        <Typography
          variant="body2"
          component="h6"
          sx={{ mb: 1, mt: 1, fontWeight: "bold" }}
          {...props}
        >
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
      code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || "");
        const language = match ? match[1] : "";

        if (inline) {
          return (
            <Typography
              component="code"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.15)"
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
          );
        }

        return (
          <Box
            sx={{
              position: "relative",
              mb: 2,
              borderRadius: 1,
              overflow: "hidden",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {language && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(0, 0, 0, 0.7)",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.08)",
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  borderBottomLeftRadius: 4,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                {language.toUpperCase()}
              </Box>
            )}
            <SyntaxHighlighter
              style={theme.palette.mode === "dark" ? oneDark : oneLight}
              language={language || "text"}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: "16px",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                borderRadius: 0,
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </Box>
        );
      },
      pre: ({ children, ...props }: any) => (
        <Box
          component="pre"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
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
            borderInlineStart: (theme) =>
              `4px solid ${theme.palette.primary.main}`,
            paddingInlineStart: 2,
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
      table: ({ children, ...props }: any) => (
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            mb: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: "hidden",
          }}
          {...props}
        >
          {children}
        </Box>
      ),
      thead: ({ children, ...props }: any) => (
        <Box
          component="thead"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
          }}
          {...props}
        >
          {children}
        </Box>
      ),
      tbody: ({ children, ...props }: any) => (
        <Box component="tbody" {...props}>
          {children}
        </Box>
      ),
      tr: ({ children, ...props }: any) => (
        <Box
          component="tr"
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            "&:last-child": {
              borderBottom: "none",
            },
          }}
          {...props}
        >
          {children}
        </Box>
      ),
      th: ({ children, ...props }: any) => (
        <Box
          component="th"
          sx={{
            padding: 1,
            textAlign: "start",
            fontWeight: "bold",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            "&:last-child": {
              borderRight: "none",
            },
          }}
          {...props}
        >
          {children}
        </Box>
      ),
      td: ({ children, ...props }: any) => (
        <Box
          component="td"
          sx={{
            padding: 1,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            "&:last-child": {
              borderRight: "none",
            },
          }}
          {...props}
        >
          {children}
        </Box>
      ),
    };

    // Function to render message content with markdown support
    const renderMessageContent = (text: string) => {
      // Check if the text contains markdown patterns
      const hasMarkdown = /[*_`#\[\]()>|]/.test(text);

      if (hasMarkdown) {
        return (
          <ReactMarkdown
            components={markdownComponents}
            remarkPlugins={[remarkGfm]}
          >
            {text}
          </ReactMarkdown>
        );
      } else {
        return (
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {text}
          </Typography>
        );
      }
    };

    return (
      <List
        className="bf-mgaic-chat__messages-list"
        sx={{
          overflowX: "hidden",
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
        {/* Welcome message if no messages and showWelcomeMessage is true */}
        {/* {messages.length === 0 && showWelcomeMessage && ( */}
        {showWelcomeMessage && (
          <ListItem
            className="bf-mgaic-chat__welcome-message"
            sx={{
              flexDirection: "column",
              alignItems: "start",
              mb: 2,
            }}
          >
            <Box
              className="bf-mgaic-chat__welcome-message-box"
              sx={{
                display: "flex",
                alignItems: "start",
                gap: 1,
                maxWidth: "70%",
                width: "100%",
                justifyContent: "start",
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
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: "text.primary",
                  borderRadius: "18px",
                  maxWidth: "100%",
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.15)"
                      : "1px solid rgba(0, 0, 0, 0.15)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0, 0, 0, 0.3)"
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
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
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
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
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
                      textAlign: "end",
                    }}
                  >
                    {formatDate(new Date(), timeFormat)}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </ListItem>
        )}

        {messages.map((message) => (
          <ListItem
            className="bf-mgaic-chat__message"
            key={message.id}
            sx={{
              flexDirection: "column",
              alignItems: message.sender === "user" ? "end" : "start",
              mb: 2,
            }}
          >
            <Box
              className="bf-mgaic-chat__message-box"
              sx={{
                display: "flex",
                alignItems: "start",
                gap: 1,
                maxWidth: "70%",
                width: "100%",
                justifyContent: message.sender === "user" ? "end" : "start",
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
                        ? "rgba(25, 118, 210, 0.2)"
                        : "rgba(0, 122, 255, 0.25)";
                    } else {
                      return theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.12)"
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
                        ? "1px solid rgba(25, 118, 210, 0.35)"
                        : "1px solid rgba(0, 122, 255, 0.4)";
                    } else {
                      return theme.palette.mode === "dark"
                        ? "1px solid rgba(255, 255, 255, 0.15)"
                        : "1px solid rgba(0, 0, 0, 0.15)";
                    }
                  },
                  boxShadow: (theme) => {
                    if (message.sender === "user") {
                      return theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(25, 118, 210, 0.15)"
                        : "0 4px 20px rgba(0, 122, 255, 0.2)";
                    } else {
                      return theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0, 0, 0, 0.3)"
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
                          ? "linear-gradient(135deg, rgba(25, 118, 210, 0.35), rgba(25, 118, 210, 0.15))"
                          : "linear-gradient(135deg, rgba(0, 122, 255, 0.4), rgba(0, 122, 255, 0.2))";
                      } else {
                        return theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
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
                    className="bf-mgaic-chat__message-files"
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
                        className="bf-mgaic-chat__message-file-chip"
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
                      textAlign: message.sender === "user" ? "start" : "end",
                    }}
                  >
                    {formatDate(message.timestamp, timeFormat)}
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

        {/* AI Typing Indicator - Appears as AI message */}
        {isLoading && (
          <ListItem
            sx={{
              flexDirection: "column",
              alignItems: "start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                gap: 1,
                maxWidth: "70%",
                width: "100%",
                justifyContent: "start",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  mt: 1,
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
                <AIIcon />
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: "text.primary",
                  borderRadius: "18px",
                  maxWidth: "100%",
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.15)"
                      : "1px solid rgba(0, 0, 0, 0.15)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0, 0, 0, 0.3)"
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
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
                        : "linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.12))",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    zIndex: -1,
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "18px",
                    padding: "2px",
                    background:
                      "linear-gradient(45deg, #1976d2, #42a5f5, #9c27b0, #ff9800, #1976d2)",
                    backgroundSize: "400% 400%",
                    animation: "gradientRotate 3s ease-in-out infinite",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    zIndex: -2,
                    "@keyframes gradientRotate": {
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
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                        animation:
                          "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                        animationDelay: "0s, 0s, 0s, 0s",
                        boxShadow: "0 0 6px rgba(25, 118, 210, 0.3)",
                        "@keyframes colorShift": {
                          "0%, 100%": {
                            background:
                              "linear-gradient(45deg, #1976d2, #42a5f5)",
                          },
                          "50%": {
                            background:
                              "linear-gradient(45deg, #42a5f5, #1976d2)",
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
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                        animation:
                          "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                        animationDelay: "0.3s, 0s, 0.5s, 0.3s",
                        boxShadow: "0 0 6px rgba(25, 118, 210, 0.3)",
                        "@keyframes colorShift": {
                          "0%, 100%": {
                            background:
                              "linear-gradient(45deg, #1976d2, #42a5f5)",
                          },
                          "50%": {
                            background:
                              "linear-gradient(45deg, #42a5f5, #1976d2)",
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
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                        animation:
                          "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                        animationDelay: "0.6s, 0s, 1s, 0.6s",
                        boxShadow: "0 0 6px rgba(25, 118, 210, 0.3)",
                        "@keyframes colorShift": {
                          "0%, 100%": {
                            background:
                              "linear-gradient(45deg, #1976d2, #42a5f5)",
                          },
                          "50%": {
                            background:
                              "linear-gradient(45deg, #42a5f5, #1976d2)",
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
                    variant="body1"
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
                    {aiThinkingLabel}
                  </Typography>
                </Box>
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
                      textAlign: "end",
                    }}
                  >
                    {formatDate(new Date(), timeFormat)}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </ListItem>
        )}
        <div ref={messagesEndRef} />
      </List>
    );
  }
);

MessageList.displayName = "MessageList";

export default MessageList;
