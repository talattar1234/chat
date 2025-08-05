import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { speechToText } from "../../utils/speechToText";
import WaveSurfer from "wavesurfer.js";
import { audioRecorderLabels } from "./AudioRecorder.labels";

// בדיקה שהפונקציה נטענה
console.log("speechToText function loaded:", typeof speechToText);

interface AudioRecorderProps {
  onTextResult: (text: string) => void;
  onError?: (error: string) => void;
  lang?: "he" | "en"; // optional - defaults to "he"
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTextResult,
  onError,
  lang = "he",
}) => {
  console.log("AudioRecorder props:", {
    onTextResult: typeof onTextResult,
    onError: typeof onError,
    lang,
  });

  const t = audioRecorderLabels[lang];

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  // לא צריכים audioLevels כרגע
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurferReady, setWavesurferReady] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // לא צריכים audioLevelsIntervalRef כרגע
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // ניקוי resources
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // לא צריכים AudioContext כרגע - נטפל בו מאוחר יותר

      // התחלת הקלטה
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setShowDialog(true);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      // לא צריכים setAudioLevels כרגע

      // התחלת מעקב אחר זמן הקלטה
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // לא צריכים מעקב אחר רמות הקול כרגע
    } catch (error) {
      console.error("Error starting recording:", error);
      onError?.(t.microphoneAccessError);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // פונקציה ריקה - נטפל בה מאוחר יותר
  const startAudioLevelsTracking = () => {
    // TODO: להוסיף audio visualization מאוחר יותר
  };

  const handleConfirm = async () => {
    if (!audioBlob) {
      console.error("No audio blob found");
      return;
    }

    console.log("Starting speech to text conversion...");
    console.log("Audio blob size:", audioBlob.size);
    setIsProcessing(true);
    setSpeechError(null); // איפוס שגיאות קודמות כשמנסים שוב

    try {
      console.log("Calling speechToText...");
      const text = await speechToText(audioBlob);
      console.log("Speech to text result:", text);

      console.log("Calling onTextResult...");
      onTextResult(text);
      console.log("Text sent to parent component");

      // רק אם הצליח - סוגרים את החלון
      console.log("Calling handleClose...");
      handleClose();
    } catch (error) {
      console.error("Speech to text error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t.audioConversionError;
      setSpeechError(errorMessage);
      onError?.(errorMessage);
      // לא סוגרים את החלון - נותנים למשתמש לנסות שוב או לבטל
    } finally {
      console.log("Setting isProcessing to false");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    console.log("Closing dialog...");
    setShowDialog(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
    // לא צריכים setAudioLevels כרגע
    setRecordingTime(0);
    setIsPlaying(false);
    setWavesurferReady(false);
    setSpeechError(null); // איפוס שגיאות
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    console.log("Dialog closed");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // יצירת wavesurfer לנגינה
  const createPlaybackWaveform = (audioUrl: string) => {
    const container = document.getElementById("playback-waveform");
    if (!container) {
      console.error("Playback waveform container not found");
      return null;
    }

    const wavesurfer = WaveSurfer.create({
      container: container,
      waveColor: "#1976d2",
      progressColor: "#9e9e9e",
      cursorColor: "#FF0000",
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 4,
      height: 100,
      barGap: 1,
      normalize: true,
      interact: true,
    });

    wavesurfer.load(audioUrl);

    // אירועי נגינה
    wavesurfer.on("play", () => setIsPlaying(true));
    wavesurfer.on("pause", () => setIsPlaying(false));
    wavesurfer.on("finish", () => setIsPlaying(false));
    wavesurfer.on("ready", () => setWavesurferReady(true));

    return wavesurfer;
  };

  // יצירת waveform לנגינה כשהדיאלוג נפתח
  useEffect(() => {
    if (showDialog && audioUrl) {
      // המתנה ארוכה יותר כדי שה-DOM יתעדכן
      setTimeout(() => {
        const wavesurfer = createPlaybackWaveform(audioUrl);
        if (wavesurfer) {
          wavesurferRef.current = wavesurfer;
        }
      }, 200);
    }
  }, [showDialog, audioUrl]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* כפתור מיקרופון/עצירה */}
        <IconButton
          color={isRecording ? "error" : "primary"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          sx={{
            width: 48,
            height: 48,
            animation: isRecording ? "pulse 1s infinite" : "none",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </IconButton>

        {/* טיימר בזמן הקלטה */}
        {isRecording && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ minWidth: 60, fontWeight: "bold" }}
            >
              {formatTime(recordingTime)}
            </Typography>

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {t.recording}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Dialog להצגת האודיו */}
      <Dialog open={showDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{t.audioRecording}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {audioUrl && (
              <>
                {/* Waveform של האודיו המוקלט */}
                <Box sx={{ mb: 2, height: 100 }}>
                  <div
                    id="playback-waveform"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  />
                </Box>

                {/* כפתורי נגינה */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
                    onClick={handlePlayPause}
                    disabled={!wavesurferReady}
                    sx={{ minWidth: 120 }}
                  >
                    {isPlaying ? t.pause : t.play}
                  </Button>

                  {/* אינדיקטור סטטוס */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: !wavesurferReady
                          ? "text.disabled"
                          : isPlaying
                          ? "success.main"
                          : "primary.main",
                        animation: isPlaying ? "pulse 1s infinite" : "none",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {!wavesurferReady
                        ? t.loading
                        : isPlaying
                        ? t.playing
                        : t.readyToPlay}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {isProcessing && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <LinearProgress sx={{ mb: 1 }} />
                {t.convertingAudio}
              </Alert>
            )}

            {speechError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {speechError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<CloseIcon />}>
            {t.cancel}
          </Button>
          <Button
            onClick={() => {
              console.log("Confirm button clicked");
              handleConfirm();
            }}
            variant="contained"
            startIcon={<CheckIcon />}
            disabled={isProcessing}
          >
            {t.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AudioRecorder;
