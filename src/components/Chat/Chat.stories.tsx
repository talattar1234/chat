import type { Meta, StoryObj } from "@storybook/react";
import Chat, { Message } from "./Chat";

const meta: Meta<typeof Chat> = {
  title: "Components/Chat",
  component: Chat,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onMessageEnter: { action: "messageEnter" },
    isLoading: { control: "boolean" },
    maxFileSize: { control: "number" },
    allowedFileTypes: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample messages for stories
const sampleMessages: Message[] = [
  {
    id: "1",
    text: "שלום! איך אני יכול לעזור לך היום?",
    sender: "ai",
    timestamp: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "2",
    text: "אני רוצה לשאול על React ו-TypeScript",
    sender: "user",
    timestamp: new Date("2024-01-15T10:01:00"),
  },
  {
    id: "3",
    text: "React הוא ספריית JavaScript לבניית ממשקי משתמש. TypeScript מוסיף טיפוסים סטטיים ל-JavaScript, מה שמשפר את הפיתוח והתחזוקה של הקוד.",
    sender: "ai",
    timestamp: new Date("2024-01-15T10:02:00"),
  },
];

const messagesWithFiles: Message[] = [
  ...sampleMessages,
  {
    id: "4",
    text: "הנה קובץ PDF עם מידע נוסף",
    sender: "user",
    timestamp: new Date("2024-01-15T10:03:00"),
    files: [
      new File(["PDF content"], "document.pdf", { type: "application/pdf" }),
    ],
  },
  {
    id: "5",
    text: "תודה על הקובץ! אני אקרא אותו ואחזור אליך עם תשובה מפורטת.",
    sender: "ai",
    timestamp: new Date("2024-01-15T10:04:00"),
  },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const WithFiles: Story = {
  args: {
    messages: messagesWithFiles,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const Loading: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: "4",
        text: "אני רוצה לשאול על React Hooks",
        sender: "user",
        timestamp: new Date("2024-01-15T10:03:00"),
      },
    ],
    isLoading: true, // כפתור מושבת, אין אינדיקטור
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const LongConversation: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: "6",
        text: "אני רוצה לדעת יותר על Material-UI",
        sender: "user",
        timestamp: new Date("2024-01-15T10:05:00"),
      },
      {
        id: "7",
        text: "Material-UI היא ספריית React שמספקת רכיבים מוכנים לשימוש המבוססים על עיצוב Material Design של Google. היא כוללת רכיבים כמו כפתורים, טפסים, ניווט ועוד.",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:06:00"),
      },
      {
        id: "8",
        text: "זה נשמע מעולה! איך אני מתחיל להשתמש בה?",
        sender: "user",
        timestamp: new Date("2024-01-15T10:07:00"),
      },
      {
        id: "9",
        text: "פשוט מאוד! התקן את החבילה עם npm או yarn, ואז תוכל לייבא רכיבים ישירות לפרויקט שלך. יש גם תמיכה מלאה ב-TypeScript.",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:08:00"),
      },
    ],
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const CustomFileTypes: Story = {
  args: {
    messages: sampleMessages,
    allowedFileTypes: [".txt", ".pdf"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
};

export const ImagesOnly: Story = {
  args: {
    messages: sampleMessages,
    allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
};

export const DocumentsOnly: Story = {
  args: {
    messages: sampleMessages,
    allowedFileTypes: [".pdf", ".doc", ".docx", ".txt"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const AITyping: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: "4",
        text: "אני רוצה לשאול על React Hooks",
        sender: "user",
        timestamp: new Date("2024-01-15T10:03:00"),
      },
    ],
    isLoading: false, // זה יגרום לאינדיקטור "AI חושב" להופיע
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const AITypingWithFiles: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: "4",
        text: "הנה קובץ PDF עם שאלה על React",
        sender: "user",
        timestamp: new Date("2024-01-15T10:03:00"),
        files: [
          new File(["PDF content"], "react-questions.pdf", {
            type: "application/pdf",
          }),
        ],
      },
    ],
    isLoading: false, // זה יגרום לאינדיקטור "AI חושב" להופיע
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const WaitingForAI: Story = {
  args: {
    messages: [
      {
        id: "1",
        text: "שלום! איך אני יכול לעזור לך היום?",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:00:00"),
      },
      {
        id: "2",
        text: "אני רוצה לשאול על React ו-TypeScript",
        sender: "user",
        timestamp: new Date("2024-01-15T10:01:00"),
      },
      {
        id: "3",
        text: "React הוא ספריית JavaScript לבניית ממשקי משתמש. TypeScript מוסיף טיפוסים סטטיים ל-JavaScript, מה שמשפר את הפיתוח והתחזוקה של הקוד.",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:02:00"),
      },
      {
        id: "4",
        text: "תודה! עכשיו אני רוצה לדעת על Hooks",
        sender: "user",
        timestamp: new Date("2024-01-15T10:03:00"),
      },
    ],
    isLoading: false, // המשתמש יכול לכתוב בזמן שה-AI חושב
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};
