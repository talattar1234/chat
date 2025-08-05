export interface AudioRecorderLabels {
  recording: string;
  audioRecording: string;
  play: string;
  pause: string;
  loading: string;
  playing: string;
  readyToPlay: string;
  convertingAudio: string;
  cancel: string;
  confirm: string;
  microphoneAccessError: string;
  audioConversionError: string;
}

export const audioRecorderLabels: Record<"he" | "en", AudioRecorderLabels> = {
  he: {
    recording: "מקליט...",
    audioRecording: "הקלטת אודיו",
    play: "נגן",
    pause: "השהה",
    loading: "טוען...",
    playing: "מנגן",
    readyToPlay: "מוכן לנגינה",
    convertingAudio: "ממיר אודיו לטקסט...",
    cancel: "ביטול",
    confirm: "אישור",
    microphoneAccessError: "לא ניתן לגשת למיקרופון",
    audioConversionError: "שגיאה בהמרת האודיו",
  },
  en: {
    recording: "Recording...",
    audioRecording: "Audio Recording",
    play: "Play",
    pause: "Pause",
    loading: "Loading...",
    playing: "Playing",
    readyToPlay: "Ready to play",
    convertingAudio: "Converting audio to text...",
    cancel: "Cancel",
    confirm: "Confirm",
    microphoneAccessError: "Cannot access microphone",
    audioConversionError: "Error converting audio",
  },
};
