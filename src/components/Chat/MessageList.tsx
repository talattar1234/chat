import React, { useRef, useEffect, useCallback } from "react";
import { Box, List, ListItem } from "@mui/material";
import { Message } from "./Chat";
import ChatMessage from "./ChatMessage";
import WelcomeMessage from "./WelcomeMessage";
import AITypingIndicator from "./AITypingIndicator";
import "./MessageList.css";

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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, scrollToBottom]);

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
        {/* Welcome message */}
        {showWelcomeMessage && (
          <ListItem className="bf-mgaic-chat__welcome-list-item">
            <WelcomeMessage lang={lang} timeFormat={timeFormat} />
          </ListItem>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ListItem
            key={message.id}
            className={`bf-mgaic-chat__message-list-item bf-mgaic-chat__message-list-item--${message.sender}`}
          >
            <ChatMessage
              message={message}
              lang={lang}
              timeFormat={timeFormat}
              copiedMessageId={copiedMessageId}
              onCopyMessage={onCopyMessage}
              copyToClipboardLabel={copyToClipboardLabel}
              copiedToClipboardLabel={copiedToClipboardLabel}
            />
          </ListItem>
        ))}

        {/* AI Typing Indicator */}
        {isLoading && (
          <ListItem className="bf-mgaic-chat__typing-list-item">
            <AITypingIndicator
              aiThinkingLabel={aiThinkingLabel}
              timeFormat={timeFormat}
            />
          </ListItem>
        )}
        <div ref={messagesEndRef} />
      </List>
    );
  }
);

MessageList.displayName = "MessageList";

export default MessageList;
