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
  newChat: string;
  exportChat: string;
  menu: string;
  stopGeneration: string;
  errorTitle: string;
  dismissError: string;
  retryAction: string;
  pendingTitle: string;
  cancelAction: string;
  newChatConfirmationTitle: string;
  newChatConfirmationMessage: string;
  newChatConfirmationOK: string;
  newChatConfirmationCancel: string;
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
    newChat: "צ'אט חדש",
    exportChat: "ייצא צ'אט",
    menu: "תפריט",
    stopGeneration: "עצור יצירה",
    errorTitle: "שגיאה",
    dismissError: "סגור",
    retryAction: "נסה שוב",
    pendingTitle: "בתהליך",
    cancelAction: "בטל",
    newChatConfirmationTitle: "צ'אט חדש",
    newChatConfirmationMessage: "האם ברצונך ליצור צ'אט חדש?",
    newChatConfirmationOK: "אישור",
    newChatConfirmationCancel: "ביטול",
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
    newChat: "New Chat",
    exportChat: "Export Chat",
    menu: "Menu",
    stopGeneration: "Stop Generation",
    errorTitle: "Error",
    dismissError: "Dismiss",
    retryAction: "Retry",
    pendingTitle: "In Progress",
    cancelAction: "Cancel",
    newChatConfirmationTitle: "New Chat",
    newChatConfirmationMessage: "Do you want to create a new chat?",
    newChatConfirmationOK: "OK",
    newChatConfirmationCancel: "Cancel",
  },
};
