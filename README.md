# Chat Application

A React project with TypeScript and Material-UI featuring an advanced Chat component with file upload support. Supports Node 22 and Storybook 8.

## Features

- ✅ Full Chat component with MUI
- ✅ Support for user and AI messages
- ✅ File upload (txt, csv, pdf, word) up to 10MB
- ✅ Send button and Enter key for sending
- ✅ Storybook with examples
- ✅ Hebrew and RTL support
- ✅ Full TypeScript support
- ✅ Multi-language support (Hebrew/English)
- ✅ Audio recording and speech-to-text

## Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install

# Install Storybook (version 8.1.0)
npx storybook@latest init --yes
```

## Running

```bash
# Start the application
npm start

# Start Storybook (version 8.1.0)
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── Chat.tsx          # Main Chat component
│   │   ├── Chat.labels.ts    # Chat labels and translations
│   │   └── Chat.stories.tsx  # Storybook stories
│   └── AudioRecorder/
│       ├── AudioRecorder.tsx # Audio recording component
│       ├── AudioRecorder.labels.ts # Audio recorder labels
│       └── AudioRecorder.stories.tsx # Audio recorder stories
├── utils/
│   └── speechToText.ts       # Speech-to-text utility
├── App.tsx                   # Main application
└── index.tsx                 # Entry point
```

## Using the Chat Component

```tsx
import Chat, { Message } from "./components/Chat/Chat";

const messages: Message[] = [
  {
    id: "1",
    text: "Hello!",
    sender: "ai",
    timestamp: new Date(),
  },
];

const handleMessageEnter = (message: string, files?: File[]) => {
  console.log("New message:", message);
  console.log("Files:", files);
};

<Chat
  messages={messages}
  onMessageEnter={handleMessageEnter}
  isLoading={false}
  maxFileSize={10 * 1024 * 1024} // 10MB
  allowedFileTypes={[".txt", ".csv", ".pdf", ".doc", ".docx"]}
  lang="en" // Optional: "he" | "en", defaults to "he"
/>;
```

## Chat Component Props

| Prop               | Type                                        | Default      | Description                          |
| ------------------ | ------------------------------------------- | ------------ | ------------------------------------ |
| `messages`         | `Message[]`                                 | -            | Array of messages                    |
| `onMessageEnter`   | `(message: string, files?: File[]) => void` | -            | Function called when message is sent |
| `isLoading`        | `boolean`                                   | `false`      | Loading state                        |
| `maxFileSize`      | `number`                                    | **required** | Maximum file size (in bytes)         |
| `allowedFileTypes` | `string[]`                                  | **required** | Allowed file types                   |
| `lang`             | `"he" \| "en"`                              | `"he"`       | Language for labels                  |

## Message Interface

```tsx
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  files?: FileInfo[];
}

interface FileInfo {
  name: string;
  type: string;
  size: number;
}
```

## AudioRecorder Component

The Chat component includes an integrated audio recorder with speech-to-text functionality:

```tsx
<AudioRecorder
  onTextResult={(text) => {
    // Handle transcribed text
    setInputText((prev) => prev + text);
  }}
  onError={(error) => {
    // Handle recording errors
    console.error(error);
  }}
  lang="en" // Optional: "he" | "en", defaults to "he"
/>
```

## Additional Features

- **Custom Design**: Full RTL support for Hebrew
- **Validation**: File type and size checking
- **UI/UX**: Modern design with Material-UI
- **Accessibility**: Keyboard and tab support
- **Documentation**: Storybook 8.1.0 with interactive examples
- **AI Typing Indicator**: Animation showing AI is typing
- **Progress Bar**: Visual indicator for file size
- **Delete Button**: Delete all files with one click
- **Multi-language**: Hebrew and English labels
- **Audio Recording**: Built-in microphone recording
- **Speech-to-Text**: Convert audio to text

## Development

```bash
# Run tests
npm test

# Build for production
npm run build

# Build Storybook
npm run build-storybook
```

## Language Support

The application supports both Hebrew and English:

- **Hebrew (default)**: RTL layout, Hebrew labels
- **English**: LTR layout, English labels
- **Dynamic switching**: Change language via `lang` prop

## File Upload Features

- **Supported formats**: txt, csv, pdf, doc, docx
- **Size validation**: Configurable maximum file size
- **Visual feedback**: Progress bar and file chips
- **Error handling**: Clear error messages for invalid files
- **Batch upload**: Multiple files at once

## Audio Recording Features

- **Real-time recording**: Visual feedback during recording
- **Waveform visualization**: See audio waveform
- **Playback controls**: Play, pause, and review recordings
- **Speech-to-text**: Automatic transcription
- **Error handling**: Clear error messages for recording issues
