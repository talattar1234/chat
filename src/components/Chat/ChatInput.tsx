import React, {
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
} from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Chip,
  Alert,
  InputAdornment,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  Stop as StopIcon,
  AttachFile as AttachFileIcon,
  DeleteSweep as DeleteSweepIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import AudioRecorder from "../AudioRecorder/AudioRecorder";

interface ChatInputProps {
  onMessageEnter: (message: string, files?: File[]) => void;
  onStopClick?: () => void;
  isLoading: boolean;
  disabled?: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  lang: "he" | "en";
  placeholder: string;
  fileSizeLabel: string;
  deleteAllFilesLabel: string;
  uploadFilesLabel: string;
  supportedFilesLabel: string;
  totalFilesTooLarge: string;
  unsupportedFileTypes: string;
  stopGenerationLabel: string;
}

const ChatInput = React.memo<ChatInputProps>(
  ({
    onMessageEnter,
    onStopClick,
    isLoading,
    disabled = false,
    maxFileSize,
    allowedFileTypes,
    lang,
    placeholder,
    fileSizeLabel,
    deleteAllFilesLabel,
    uploadFilesLabel,
    supportedFilesLabel,
    totalFilesTooLarge,
    unsupportedFileTypes,
    stopGenerationLabel,
  }) => {
    const [inputText, setInputText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const [totalFileSize, setTotalFileSize] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Memoized callbacks
    const handleSendMessage = useCallback(() => {
      if (!inputText.trim()) return;
      onMessageEnter(inputText.trim(), selectedFiles);
      setInputText("");
      setSelectedFiles([]);
      setError("");
    }, [inputText, selectedFiles, onMessageEnter]);

    const handleKeyPress = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleSendMessage();
        }
      },
      [handleSendMessage]
    );

    const handleStopClick = useCallback(() => {
      onStopClick?.();
    }, [onStopClick]);

    const handleFileSelect = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setError("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        const invalidFiles = files.filter((file) => {
          const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
          return !allowedFileTypes.includes(fileExtension);
        });

        if (invalidFiles.length > 0) {
          setError(
            unsupportedFileTypes.replace(
              "{fileNames}",
              invalidFiles.map((f) => f.name).join(", ")
            )
          );
          return;
        }

        setSelectedFiles((prev) => [...prev, ...files]);
      },
      [allowedFileTypes, unsupportedFileTypes]
    );

    const removeFile = useCallback((index: number) => {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const clearAllFiles = useCallback(() => {
      setSelectedFiles([]);
    }, []);

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

    // Effects
    React.useEffect(() => {
      const totalSize = selectedFiles.reduce(
        (total, file) => total + file.size,
        0
      );
      setTotalFileSize(totalSize);
    }, [selectedFiles]);

    React.useEffect(() => {
      if (totalFileSize > maxFileSize) {
        const totalSizeMB = (totalFileSize / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
        setError(
          totalFilesTooLarge
            .replace("{totalSize}", totalSizeMB)
            .replace("{maxSize}", maxSizeMB)
        );
      } else if (totalFileSize > 0) {
        setError("");
      }
    }, [totalFileSize, maxFileSize, totalFilesTooLarge]);

    return (
      <Box sx={{ p: 2 }}>
        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <>
            <Box
              sx={{
                mb: 1,
                maxHeight: "120px",
                overflow: "auto",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                p: 0.5,
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": {
                  background: "divider",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "text.secondary",
                  borderRadius: "3px",
                  "&:hover": { background: "text.primary" },
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
                  sx={{ flexShrink: 0 }}
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
                    {fileSizeLabel}
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
                  <Tooltip title={deleteAllFilesLabel}>
                    <IconButton
                      size="small"
                      onClick={clearAllFiles}
                      disabled={disabled}
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
                }}
              />
            </Box>

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
            placeholder={placeholder}
            disabled={disabled}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={uploadFilesLabel}>
                    <IconButton
                      onClick={() => fileInputRef.current?.click()}
                      disabled={disabled}
                    >
                      <AttachFileIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <AudioRecorder
            onTextResult={(text) => {
              setInputText((prev) => prev + (prev ? " " : "") + text);
            }}
            onError={(error) => {
              setError(error);
            }}
            onRecordingChange={(recording) => {
              setIsRecording(recording);
            }}
            lang={lang}
            disabled={disabled}
          />

          <Tooltip title={isLoading ? stopGenerationLabel : placeholder}>
            <IconButton
              color={isLoading ? "error" : "primary"}
              onClick={isLoading ? handleStopClick : handleSendMessage}
              disabled={
                disabled ||
                (isLoading
                  ? false
                  : !inputText.trim() || totalFileSize > maxFileSize)
              }
              sx={{
                minWidth: 56,
                height: 56,
                ...(isLoading && {
                  border: "2px solid #f44336",
                  borderRadius: "50%",
                }),
              }}
            >
              {isLoading ? <StopIcon /> : <SendIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFileTypes.join(",")}
          onChange={handleFileSelect}
          disabled={disabled}
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
            {supportedFilesLabel} {allowedFileTypes.join(", ")}
          </Typography>
          {selectedFiles.length > 0 && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {formatFileSize(totalFileSize)} / {formatFileSize(maxFileSize)}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
