import type { Meta, StoryObj } from "@storybook/react";
import Chat, { Message, FileInfo } from "../Chat";
import { Box } from "@mui/material";

const meta: Meta<typeof Chat> = {
  title: "Components/Chat",
  component: Chat,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
  decorators: [],
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

// English messages for English labels story
const englishMessages: Message[] = [
  {
    id: "1",
    text: "Hello! How can I help you today?",
    sender: "ai",
    timestamp: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "2",
    text: "I want to ask about React and TypeScript",
    sender: "user",
    timestamp: new Date("2024-01-15T10:01:00"),
  },
  {
    id: "3",
    text: "React is a JavaScript library for building user interfaces. TypeScript adds static types to JavaScript, which improves code development and maintenance.",
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
      {
        name: "document.pdf",
        type: "application/pdf",
        size: 1024 * 1024, // 1MB
      },
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

export const EnglishLabels: Story = {
  args: {
    messages: englishMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    lang: "en",
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
    isLoading: true, // Button disabled, no indicator
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

export const BeautifulBackground: Story = {
  args: {
    messages: [
      {
        id: "1",
        text: "שלום! ברוך הבא לצ'אט היפה שלנו! 🌟",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:00:00"),
      },
      {
        id: "2",
        text: "וואו! הרקע נראה ממש יפה! איך עשית את זה?",
        sender: "user",
        timestamp: new Date("2024-01-15T10:01:00"),
      },
      {
        id: "3",
        text: "תודה! השתמשתי בגרדיאנט עדין עם צבעים חמים וקרירים, ועליו הוספתי ציורים עדינים של עיגולים וכוכבים בצבע לבן שקוף. זה נותן תחושה נעימה כמו בוואטסאפ! ✨",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:02:00"),
      },
      {
        id: "4",
        text: "זה באמת נראה מקצועי! איזה עוד אפקטים יש?",
        sender: "user",
        timestamp: new Date("2024-01-15T10:03:00"),
      },
      {
        id: "5",
        text: "יש לנו גרדיאנט עדין שמשתנה מירוק בהיר לכחול בהיר ולכתום בהיר, ציורים עדינים של עיגולים וכוכבים בגדלים שונים, ואפילו כוכב קטן באזור הקלט! הכל מעוצב עם SVG ו-CSS מתקדם. 🎨",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:04:00"),
      },
    ],
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  parameters: {
    docs: {
      description: {
        story:
          "צ'אט עם רקע עדין וציורים דקים כמו בוואטסאפ, כולל גרדיאנט עדין וציורי SVG של עיגולים וכוכבים. תומך ב-light ו-dark theme.",
      },
    },
  },
};

export const DarkThemeBackground: Story = {
  args: {
    messages: [
      {
        id: "1",
        text: "שלום! ברוך הבא לצ'אט שלנו! 🌙",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:00:00"),
      },
      {
        id: "2",
        text: "וואו! הרקע נראה ממש יפה ב-dark mode! איך זה עובד?",
        sender: "user",
        timestamp: new Date("2024-01-15T10:01:00"),
      },
      {
        id: "3",
        text: "תודה! השתמשתי ב-useTheme hook של Material-UI כדי לזהות את ה-theme הנוכחי. ב-dark mode, הגרדיאנט משתנה לגוונים כהים יותר והציורים הופכים עדינים יותר כדי לא להפריע לקריאות! ✨",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:02:00"),
      },
      {
        id: "4",
        text: "זה באמת חכם! איזה צבעים יש ב-dark mode?",
        sender: "user",
        timestamp: new Date("2024-01-15T10:03:00"),
      },
      {
        id: "5",
        text: "ב-dark mode יש לנו גרדיאנט כמעט שחור עם טיפת צבעים זוהרים עדינים (כחול, סגול, צהוב). הכוכבים קטנים מאוד ועדינים (0.03-0.01 שקיפות) ומפוזרים בכל המסך. זה נותן תחושה של שמיים זרועי כוכבים! 🌙✨",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:04:00"),
      },
    ],
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  parameters: {
    docs: {
      description: {
        story:
          "צ'אט עם רקע עדין ב-dark theme, כולל גרדיאנט כהה וציורי SVG עדינים יותר.",
      },
    },
  },
};

export const WithErrorOverlay: Story = {
  args: {
    messages: sampleMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    errorOverlayText:
      "אירעה שגיאה בחיבור לשרת. אנא בדוק את החיבור לאינטרנט ונסה שוב.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "צ'אט עם חיווי שגיאה בראש הצ'אט. השגיאה מוצגת כבאנר עם אנימציות יפות וכפתור 'נסה שוב'.",
      },
    },
  },
};

export const WithErrorOverlayEnglish: Story = {
  args: {
    messages: englishMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    lang: "en",
    errorOverlayText:
      "An error occurred while connecting to the server. Please check your internet connection and try again.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Chat with error banner at the top. The error is displayed with beautiful animations and retry button.",
      },
    },
  },
};

export const WithErrorOverlayNoRetry: Story = {
  args: {
    messages: sampleMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    errorOverlayText: "השירות זמנית לא זמין. אנא נסה שוב מאוחר יותר.",
  },
  parameters: {
    docs: {
      description: {
        story: "צ'אט עם חיווי שגיאה ללא כפתור 'נסה שוב'.",
      },
    },
  },
};

export const WithPendingOverlay: Story = {
  args: {
    messages: sampleMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    pendingOverlayText: "מתחבר לשרת... אנא המתן.",
  },
  parameters: {
    docs: {
      description: {
        story: "צ'אט עם חיווי pending בראש הצ'אט. מוצג עם ספינר בלבד.",
      },
    },
  },
};

export const WithPendingOverlayEnglish: Story = {
  args: {
    messages: englishMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    lang: "en",
    pendingOverlayText: "Connecting to server... Please wait.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Chat with pending banner at the top. Displayed with spinner only.",
      },
    },
  },
};

// Markdown examples
const markdownMessages: Message[] = [
  {
    id: "1",
    text: "שלום! הנה דוגמה לתמיכה ב-Markdown:",
    sender: "ai",
    timestamp: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "2",
    text: "אני רוצה לראות איך Markdown נראה",
    sender: "user",
    timestamp: new Date("2024-01-15T10:01:00"),
  },
  {
    id: "3",
    text: `# כותרת ראשית
## כותרת משנה
### כותרת שלישית

זהו **טקסט מודגש** וזהו *טקסט נטוי*.

\`\`\`javascript
// דוגמה לקוד
function hello() {
  console.log("שלום עולם!");
}
\`\`\`

> זהו ציטוט יפה עם גבול בצד שמאל

רשימה:
- פריט ראשון
- פריט שני
- פריט שלישי

[קישור לדוגמה](https://example.com)

\`קוד בתוך שורה\` עם טקסט רגיל.`,
    sender: "ai",
    timestamp: new Date("2024-01-15T10:02:00"),
  },
];

const englishMarkdownMessages: Message[] = [
  {
    id: "1",
    text: "Hello! Here's an example of Markdown support:",
    sender: "ai",
    timestamp: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "2",
    text: "I want to see how Markdown looks",
    sender: "user",
    timestamp: new Date("2024-01-15T10:01:00"),
  },
  {
    id: "3",
    text: `# Main Heading
## Sub Heading
### Third Level Heading

This is **bold text** and this is *italic text*.

\`\`\`javascript
// Code example
function hello() {
  console.log("Hello World!");
}
\`\`\`

> This is a beautiful quote with a left border

List:
- First item
- Second item
- Third item

[Link to example](https://example.com)

\`Inline code\` with regular text.`,
    sender: "ai",
    timestamp: new Date("2024-01-15T10:02:00"),
  },
];

const complexMarkdownMessages: Message[] = [
  {
    id: "1",
    text: "הנה דוגמה מורכבת יותר של Markdown:",
    sender: "ai",
    timestamp: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "2",
    text: "אני רוצה לראות דוגמה מורכבת",
    sender: "user",
    timestamp: new Date("2024-01-15T10:01:00"),
  },
  {
    id: "3",
    text: `# מדריך React עם TypeScript

## מה זה React?

React היא **ספריית JavaScript** לבניית ממשקי משתמש. היא פותחה על ידי Facebook.

### יתרונות React:

1. **קומפוננטים** - בנייה מחדש של ממשקים
2. *Virtual DOM* - ביצועים מהירים
3. \`JSX\` - תחביר דמוי HTML

## דוגמה לקוד:

\`\`\`typescript
interface Props {
  name: string;
  age: number;
}

const UserCard: React.FC<Props> = ({ name, age }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  );
};
\`\`\`

> 💡 **טיפ**: השתמש ב-TypeScript עם React לקבלת טיפוסים בטוחים יותר!

### קישורים שימושיים:
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

\`npm install react typescript\` - התקנת החבילות הנדרשות.`,
    sender: "ai",
    timestamp: new Date("2024-01-15T10:02:00"),
  },
];

export const WithMarkdown: Story = {
  args: {
    messages: markdownMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  parameters: {
    docs: {
      description: {
        story:
          "צ'אט עם תמיכה ב-Markdown. הודעות ה-AI יכולות לכלול כותרות, טקסט מודגש, קוד, ציטוטים ועוד.",
      },
    },
  },
};

export const WithMarkdownEnglish: Story = {
  args: {
    messages: englishMarkdownMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    lang: "en",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Chat with Markdown support. AI messages can include headings, bold text, code, quotes and more.",
      },
    },
  },
};

export const ComplexMarkdown: Story = {
  args: {
    messages: complexMarkdownMessages,
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  parameters: {
    docs: {
      description: {
        story:
          "דוגמה מורכבת של Markdown עם קוד TypeScript, רשימות, ציטוטים וקישורים.",
      },
    },
  },
};

export const MixedContent: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: "4",
        text: "הנה דוגמה עם **Markdown** ו-*עיצוב*:",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:03:00"),
      },
      {
        id: "5",
        text: "טקסט רגיל ללא Markdown",
        sender: "user",
        timestamp: new Date("2024-01-15T10:04:00"),
      },
      {
        id: "6",
        text: `# כותרת ראשית
טקסט רגיל עם **טקסט מודגש** ו-*טקסט נטוי*.

\`\`\`javascript
console.log("Hello World!");
\`\`\`

> ציטוט יפה

- רשימה
- עם פריטים`,
        sender: "ai",
        timestamp: new Date("2024-01-15T10:05:00"),
      },
    ],
    allowedFileTypes: [".txt", ".csv", ".pdf", ".doc", ".docx"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  parameters: {
    docs: {
      description: {
        story: "צ'אט עם תערובת של הודעות רגילות והודעות עם Markdown.",
      },
    },
  },
};
