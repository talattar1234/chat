import React, { useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  styled,
} from "@mui/material";
import {
  Person as PersonIcon,
  SupportAgent as AIIcon,
  ContentCopy as CopyIcon,
  PictureAsPdf,
  Article,
  Description,
  TableChart,
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

interface ChatMessageProps {
  message: Message;
  lang: "he" | "en";
  timeFormat: string;
  copiedMessageId: string | null;
  onCopyMessage: (text: string, messageId: string) => void;
  copyToClipboardLabel: string;
  copiedToClipboardLabel: string;
}

// Styled Components
const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isUser",
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  display: "flex",
  alignItems: "start",
  gap: theme.spacing(1),
  maxWidth: "70%",
  width: "100%",
  justifyContent: isUser ? "end" : "start",
  marginBottom: theme.spacing(2),
}));

const MessagePaper = styled(Paper, {
  shouldForwardProp: (prop) => !["isUser"].includes(prop as string),
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  backgroundColor: isUser
    ? theme.palette.mode === "dark"
      ? "rgba(25, 118, 210, 0.2)"
      : "rgba(0, 122, 255, 0.25)"
    : theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  color: isUser
    ? theme.palette.mode === "dark"
      ? "#ffffff"
      : "#000000"
    : theme.palette.text.primary,
  borderRadius: "18px",
  maxWidth: "100%",
  border: isUser
    ? theme.palette.mode === "dark"
      ? "1px solid rgba(25, 118, 210, 0.35)"
      : "1px solid rgba(0, 122, 255, 0.4)"
    : theme.palette.mode === "dark"
    ? "1px solid rgba(255, 255, 255, 0.15)"
    : "1px solid rgba(0, 0, 0, 0.15)",
  boxShadow: isUser
    ? theme.palette.mode === "dark"
      ? "0 4px 20px rgba(25, 118, 210, 0.15)"
      : "0 4px 20px rgba(0, 122, 255, 0.2)"
    : theme.palette.mode === "dark"
    ? "0 4px 20px rgba(0, 0, 0, 0.3)"
    : "0 4px 20px rgba(0, 0, 0, 0.15)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "18px",
    padding: "1px",
    background: isUser
      ? theme.palette.mode === "dark"
        ? "linear-gradient(135deg, rgba(25, 118, 210, 0.35), rgba(25, 118, 210, 0.15))"
        : "linear-gradient(135deg, rgba(0, 122, 255, 0.4), rgba(0, 122, 255, 0.2))"
      : theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
      : "linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.12))",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    zIndex: -1,
  },
}));

const MessageText = styled(Typography)(({ theme }) => ({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflowWrap: "break-word",
}));

const FilesContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isUser",
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  marginTop: theme.spacing(1),
  maxHeight: "80px",
  overflow: "auto",
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: isUser
      ? theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.4)"
        : "rgba(255, 255, 255, 0.5)"
      : theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(0, 0, 0, 0.3)",
    borderRadius: "4px",
    border: isUser
      ? theme.palette.mode === "dark"
        ? "1px solid rgba(255, 255, 255, 0.3)"
        : "1px solid rgba(255, 255, 255, 0.4)"
      : theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.2)"
      : "1px solid rgba(0, 0, 0, 0.2)",
    "&:hover": {
      background: isUser
        ? theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.6)"
          : "rgba(255, 255, 255, 0.7)"
        : theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(0, 0, 0, 0.5)",
    },
  },
}));

const FileChip = styled(Chip, {
  shouldForwardProp: (prop) => !["isUser"].includes(prop as string),
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  flexShrink: 0,
  color: isUser ? "inherit" : theme.palette.text.primary,
  borderColor: isUser ? "rgba(255,255,255,0.3)" : theme.palette.divider,
}));

const MessageFooter = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isUser",
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(1),
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

const Timestamp = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isUser",
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  opacity: 0.7,
  textAlign: isUser ? "start" : "end",
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  marginTop: theme.spacing(1),
}));

const AIAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginTop: theme.spacing(1),
}));

// Markdown styled components
const MarkdownParagraph = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  "&:last-child": { marginBottom: 0 },
  wordBreak: "break-word",
  overflowWrap: "break-word",
}));

const MarkdownHeading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const MarkdownCode = styled(Typography)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.1)",
  padding: "2px 4px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "0.875em",
}));

const CodeBlock = styled(Box)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

const LanguageLabel = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 1,
  padding: theme.spacing(0.5, 1.5),
  fontSize: "0.75rem",
  fontWeight: 500,
  color:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(0, 0, 0, 0.7)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.08)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderLeft: `1px solid ${theme.palette.divider}`,
  borderBottomLeftRadius: 4,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
}));

const PreBlock = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.05)",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
  fontFamily: "monospace",
  fontSize: "0.875em",
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(1),
}));

const Blockquote = styled(Box)(({ theme }) => ({
  borderInlineStart: `4px solid ${theme.palette.primary.main}`,
  paddingInlineStart: theme.spacing(2),
  margin: "16px 0",
  fontStyle: "italic",
  color: theme.palette.text.secondary,
}));

const ListContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
}));

const ListItem = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const Link = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const Table = styled(Box)(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const TableHead = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.05)",
}));

const TableRow = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const TableCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRight: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderRight: "none",
  },
}));

const TableHeader = styled(TableCell)(({ theme }) => ({
  textAlign: "start",
  fontWeight: "bold",
}));

const ChatMessage = React.memo<ChatMessageProps>(
  ({
    message,
    lang,
    timeFormat,
    copiedMessageId,
    onCopyMessage,
    copyToClipboardLabel,
    copiedToClipboardLabel,
  }) => {
    const theme = useTheme();

    const formatDate = useCallback(
      (date: Date, formatString: string): string => {
        return format(date, formatString);
      },
      []
    );

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
          return <PictureAsPdf />;
        case "doc":
        case "docx":
          return <Article />;
        case "txt":
          return <Description />;
        case "csv":
          return <TableChart />;
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

    // Custom components for react-markdown that use styled components
    const markdownComponents: any = {
      p: ({ children, ...props }: any) => (
        <MarkdownParagraph variant="body1" component="p" {...props}>
          {children}
        </MarkdownParagraph>
      ),
      h1: ({ children, ...props }: any) => (
        <MarkdownHeading variant="h4" component="h1" {...props}>
          {children}
        </MarkdownHeading>
      ),
      h2: ({ children, ...props }: any) => (
        <MarkdownHeading variant="h5" component="h2" {...props}>
          {children}
        </MarkdownHeading>
      ),
      h3: ({ children, ...props }: any) => (
        <MarkdownHeading variant="h6" component="h3" {...props}>
          {children}
        </MarkdownHeading>
      ),
      h4: ({ children, ...props }: any) => (
        <MarkdownHeading variant="subtitle1" component="h4" {...props}>
          {children}
        </MarkdownHeading>
      ),
      h5: ({ children, ...props }: any) => (
        <MarkdownHeading variant="subtitle2" component="h5" {...props}>
          {children}
        </MarkdownHeading>
      ),
      h6: ({ children, ...props }: any) => (
        <MarkdownHeading variant="body2" component="h6" {...props}>
          {children}
        </MarkdownHeading>
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
            <MarkdownCode component="code" {...props}>
              {children}
            </MarkdownCode>
          );
        }

        return (
          <CodeBlock>
            {language && (
              <LanguageLabel>{language.toUpperCase()}</LanguageLabel>
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
          </CodeBlock>
        );
      },
      pre: ({ children, ...props }: any) => (
        <PreBlock component="pre" {...props}>
          {children}
        </PreBlock>
      ),
      blockquote: ({ children, ...props }: any) => (
        <Blockquote component="blockquote" {...props}>
          {children}
        </Blockquote>
      ),
      ul: ({ children, ...props }: any) => (
        <ListContainer component="ul" {...props}>
          {children}
        </ListContainer>
      ),
      ol: ({ children, ...props }: any) => (
        <ListContainer component="ol" {...props}>
          {children}
        </ListContainer>
      ),
      li: ({ children, ...props }: any) => (
        <ListItem component="li" variant="body1" {...props}>
          {children}
        </ListItem>
      ),
      a: ({ children, href, ...props }: any) => (
        <Link
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </Link>
      ),
      table: ({ children, ...props }: any) => (
        <Table component="table" {...props}>
          {children}
        </Table>
      ),
      thead: ({ children, ...props }: any) => (
        <TableHead component="thead" {...props}>
          {children}
        </TableHead>
      ),
      tbody: ({ children, ...props }: any) => (
        <Box component="tbody" {...props}>
          {children}
        </Box>
      ),
      tr: ({ children, ...props }: any) => (
        <TableRow component="tr" {...props}>
          {children}
        </TableRow>
      ),
      th: ({ children, ...props }: any) => (
        <TableHeader component="th" {...props}>
          {children}
        </TableHeader>
      ),
      td: ({ children, ...props }: any) => (
        <TableCell component="td" {...props}>
          {children}
        </TableCell>
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
        return <MessageText variant="body1">{text}</MessageText>;
      }
    };

    const isUser = message.sender === "user";

    return (
      <MessageContainer isUser={isUser}>
        {!isUser && (
          <AIAvatar>
            <AIIcon />
          </AIAvatar>
        )}
        <MessagePaper elevation={0} isUser={isUser}>
          {renderMessageContent(message.text)}

          {/* Display attached files */}
          {message.files && message.files.length > 0 && (
            <FilesContainer isUser={isUser}>
              {message.files.map((file, index) => (
                <FileChip
                  key={index}
                  icon={<span>{getFileIcon(file.name)}</span>}
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  variant="outlined"
                  size="small"
                  isUser={isUser}
                />
              ))}
            </FilesContainer>
          )}

          <MessageFooter isUser={isUser}>
            <Tooltip
              title={
                copiedMessageId === message.id
                  ? copiedToClipboardLabel
                  : copyToClipboardLabel
              }
            >
              <CopyButton
                size="small"
                onClick={() => handleCopyMessage(message.text, message.id)}
              >
                <CopyIcon sx={{ fontSize: 16 }} />
              </CopyButton>
            </Tooltip>
            <Timestamp variant="caption" isUser={isUser}>
              {formatDate(message.timestamp, timeFormat)}
            </Timestamp>
          </MessageFooter>
        </MessagePaper>
        {isUser && (
          <UserAvatar>
            <PersonIcon />
          </UserAvatar>
        )}
      </MessageContainer>
    );
  }
);

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
