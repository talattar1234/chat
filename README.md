# Chat Application

פרויקט React עם TypeScript ו-Material-UI הכולל רכיב Chat מתקדם עם תמיכה בהעלאת קבצים. תומך ב-Node 22 ו-Storybook 8.

## תכונות

- ✅ רכיב Chat מלא עם MUI
- ✅ תמיכה בהודעות משתמש ו-AI
- ✅ העלאת קבצים (txt, csv, pdf, word) עד 10MB
- ✅ כפתור שליחה ו-Enter לשליחה
- ✅ Storybook עם דוגמאות
- ✅ תמיכה בעברית ו-RTL
- ✅ TypeScript מלא

## התקנה

```bash
# התקן את התלויות
npm install

# או עם yarn
yarn install

# התקן Storybook (גרסה 8.1.0)
npx storybook@latest init --yes
```

## הפעלה

```bash
# הפעל את האפליקציה
npm start

# הפעל את Storybook (גרסה 8.1.0)
npm run storybook

# בניית Storybook לפרודקשן
npm run build-storybook
```

## מבנה הפרויקט

```
src/
├── components/
│   └── Chat/
│       ├── Chat.tsx          # רכיב Chat הראשי
│       └── Chat.stories.tsx  # Storybook stories
├── App.tsx                   # אפליקציה ראשית
└── index.tsx                 # נקודת כניסה
```

## שימוש ברכיב Chat

```tsx
import Chat, { Message } from "./components/Chat/Chat";

const messages: Message[] = [
  {
    id: "1",
    text: "שלום!",
    sender: "ai",
    timestamp: new Date(),
  },
];

const handleMessageEnter = (message: string, files?: File[]) => {
  console.log("הודעה חדשה:", message);
  console.log("קבצים:", files);
};

<Chat
  messages={messages}
  onMessageEnter={handleMessageEnter}
  isLoading={false}
  maxFileSize={10 * 1024 * 1024} // 10MB
  allowedFileTypes={[".txt", ".csv", ".pdf", ".doc", ".docx"]}
/>;
```

## Props של רכיב Chat

| Prop               | Type                                        | Default      | Description                  |
| ------------------ | ------------------------------------------- | ------------ | ---------------------------- |
| `messages`         | `Message[]`                                 | -            | מערך הודעות                  |
| `onMessageEnter`   | `(message: string, files?: File[]) => void` | -            | פונקציה שנקראת כשנשלחת הודעה |
| `isLoading`        | `boolean`                                   | `false`      | מצב טעינה                    |
| `maxFileSize`      | `number`                                    | **required** | גודל מקסימלי לקובץ (בבייטים) |
| `allowedFileTypes` | `string[]`                                  | **required** | סוגי קבצים מותרים            |

## Message Interface

```tsx
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  files?: File[];
}
```

## תכונות נוספות

- **עיצוב מותאם**: תמיכה מלאה ב-RTL לעברית
- **וולידציה**: בדיקת סוגי קבצים וגודל
- **UI/UX**: עיצוב מודרני עם Material-UI
- **נגישות**: תמיכה במקלדת וטאבים
- **תיעוד**: Storybook 8.1.0 עם דוגמאות אינטראקטיביות
- **AI Typing Indicator**: אנימציה שמראה שה-AI כותב
- **Progress Bar**: אינדיקטור ויזואלי לגודל קבצים
- **כפתור מחיקה**: מחיקת כל הקבצים בלחיצה אחת

## פיתוח

```bash
# הרץ בדיקות
npm test

# בנייה לפרודקשן
npm run build

# בניית Storybook
npm run build-storybook
```
