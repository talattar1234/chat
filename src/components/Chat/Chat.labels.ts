export interface ChatLabels {
  placeholder: string;
  uploadFiles: string;
  fileSize: string;
  supportedFiles: string;
  aiThinking: string;
  deleteAllFiles: string;
  totalFilesTooLarge: string;
  unsupportedFileTypes: string;
  loadingMessage: string;
  copyToClipboard: string;
  copiedToClipboard: string;
  copyFailed: string;
}

export const chatLabels: Record<"he" | "en", ChatLabels> = {
  he: {
    placeholder: "הקלד הודעה...",
    uploadFiles: "העלה קבצים",
    fileSize: "גודל קבצים",
    supportedFiles: "קבצים נתמכים:",
    aiThinking: "AI חושב...",
    deleteAllFiles: "מחק את כל הקבצים",
    totalFilesTooLarge:
      "סך כל הקבצים גדול מדי: {totalSize}MB (מקסימום: {maxSize}MB). אנא הסר קבצים כדי לשלוח את ההודעה.",
    unsupportedFileTypes: "סוגי קבצים לא נתמכים: {fileNames}",
    loadingMessage:
      "AI חושב... - אתה יכול להכין את ההודעה הבאה בזמן שה-AI עונה",
    copyToClipboard: "העתק ללוח",
    copiedToClipboard: "הועתק ללוח!",
    copyFailed: "שגיאה בהעתקה",
  },
  en: {
    placeholder: "Type a message...",
    uploadFiles: "Upload files",
    fileSize: "File size",
    supportedFiles: "Supported files:",
    aiThinking: "AI is thinking...",
    deleteAllFiles: "Delete all files",
    totalFilesTooLarge:
      "Total file size too large: {totalSize}MB (maximum: {maxSize}MB). Please remove files to send the message.",
    unsupportedFileTypes: "Unsupported file types: {fileNames}",
    loadingMessage:
      "AI is thinking... - You can prepare your next message while the AI responds",
    copyToClipboard: "Copy to clipboard",
    copiedToClipboard: "Copied to clipboard!",
    copyFailed: "Copy failed",
  },
};
