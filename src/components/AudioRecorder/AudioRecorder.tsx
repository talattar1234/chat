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
  useTheme,
} from "@mui/material";
import {
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { speechToText } from "../../utils/speechToText";
import WaveSurfer from "wavesurfer.js";
import { audioRecorderLabels } from "./AudioRecorder.labels";

interface AudioRecorderProps {
  onTextResult: (text: string) => void;
  onError?: (error: string) => void;
  onRecordingChange?: (isRecording: boolean) => void;
  lang?: "he" | "en"; // optional - defaults to "he"
  disabled?: boolean; // optional - defaults to false
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTextResult,
  onError,
  onRecordingChange,
  lang = "he",
  disabled = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const t = audioRecorderLabels[lang];

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurferReady, setWavesurferReady] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cleanup resources
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioLevelsIntervalRef.current) {
        clearInterval(audioLevelsIntervalRef.current);
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

      // Create AudioContext for real-time visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512; // Higher resolution for better sensitivity
      analyserRef.current.smoothingTimeConstant = 0.3; // Smoother transitions
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Start recording
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
      onRecordingChange?.(true);
      setRecordingTime(0);

      // Initialize with empty levels to fill the waveform immediately
      const initialLevels = new Array(80).fill(0.02);
      setAudioLevels(initialLevels);

      // Start tracking recording time
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start tracking audio levels for visualization
      startAudioLevelsTracking();
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
      onRecordingChange?.(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioLevelsIntervalRef.current) {
        clearInterval(audioLevelsIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const confirmRecording = () => {
    stopRecording();
    // The dialog will open automatically when recording stops
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Temporarily remove the onstop handler to prevent dialog from opening
      const originalOnStop = mediaRecorderRef.current.onstop;
      mediaRecorderRef.current.onstop = null;

      // Stop the recording
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      // Reset all state
      setIsRecording(false);
      onRecordingChange?.(false);
      setAudioLevels([]);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl("");
      setShowDialog(false);
      setSpeechError(null);
      setIsProcessing(false);
      setIsPlaying(false);
      setWavesurferReady(false);

      // Clear intervals
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      if (audioLevelsIntervalRef.current) {
        clearInterval(audioLevelsIntervalRef.current);
        audioLevelsIntervalRef.current = null;
      }

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      // Clean up wavesurfer
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }

      // Revoke object URL if exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    }
  };

  const startAudioLevelsTracking = () => {
    audioLevelsIntervalRef.current = setInterval(() => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Calculate audio level with much higher sensitivity
        // Focus on mid-range frequencies (human speech) for better sensitivity
        const midRangeStart = Math.floor(dataArrayRef.current.length * 0.1);
        const midRangeEnd = Math.floor(dataArrayRef.current.length * 0.8);
        const midRangeData = dataArrayRef.current.slice(
          midRangeStart,
          midRangeEnd
        );

        const average =
          midRangeData.reduce((a, b) => a + b) / midRangeData.length;
        // Much lower amplification for less sensitive response
        const amplifiedLevel = (average / 255) * 8; // Amplify by 8x (reduced from 15x)
        // Add a small baseline to make even quiet sounds visible
        const normalizedLevel = Math.min(1, Math.max(0.02, amplifiedLevel)); // Minimum 0.02 for visibility

        setAudioLevels((prev) => {
          // Replace the oldest level with the new one to maintain fixed width
          const newLevels = [...prev.slice(1), normalizedLevel];
          return newLevels;
        });
      }
    }, 50); // Update every 50ms for even smoother animation
  };

  const handleConfirm = async () => {
    if (!audioBlob) {
      console.error("No audio blob found");
      return;
    }

    setIsProcessing(true);
    setSpeechError(null); // Reset previous errors when trying again

    try {
      const text = await speechToText(audioBlob);

      onTextResult(text);

      handleClose();
    } catch (error) {
      console.error("Speech to text error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t.audioConversionError;
      setSpeechError(errorMessage);
      onError?.(errorMessage);
      // Don't close the dialog - let the user try again or cancel
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
    setAudioLevels([]);
    setRecordingTime(0);
    setIsPlaying(false);
    setWavesurferReady(false);
    setSpeechError(null); // Reset errors
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Create wavesurfer for playback
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

    // Playback events
    wavesurfer.on("play", () => setIsPlaying(true));
    wavesurfer.on("pause", () => setIsPlaying(false));
    wavesurfer.on("finish", () => setIsPlaying(false));
    wavesurfer.on("ready", () => setWavesurferReady(true));

    return wavesurfer;
  };

  // Create waveform for playback when dialog opens
  useEffect(() => {
    if (showDialog && audioUrl) {
      // Longer wait for DOM to update
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

  // Render live waveform during recording
  const renderLiveWaveform = () => {
    if (!isRecording) return null;

    return (
      <Box
        sx={{
          height: 48, // Smaller height to fit in the row
          flex: 1, // Take all available space
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
        }}
        className="bf-mgaic-chat-audio-recorder__live-waveform"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "1px",
            px: 1,
            width: "100%",
          }}
          className="bf-mgaic-chat-audio-recorder__live-waveform-box"
        >
          {audioLevels.map((level, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                minWidth: "1px",
                maxWidth: "3px",
                height: `${Math.max(3, level * 40)}px`, // Smaller height
                bgcolor: "primary.main",
                borderRadius: "1px",
                transition: "height 0.03s ease",
                opacity: 0.6 + level * 0.4,
                boxShadow:
                  level > 0.5 ? "0 0 4px rgba(25, 118, 210, 0.5)" : "none",
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box
        className="bf-mgaic-chat-audio-recorder__button-container"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        {!isRecording ? (
          /* כפתור מיקרופון להתחלת הקלטה */
          <IconButton
            color="primary"
            onClick={startRecording}
            disabled={isProcessing || disabled}
            sx={{
              width: 48,
              height: 48,
            }}
          >
            <MicIcon />
          </IconButton>
        ) : (
          /* בזמן הקלטה - טיימר, waveform, וכפתורים */
          <>
            {/* טיימר בזמן הקלטה */}
            <Box
              className="bf-mgaic-chat-audio-recorder__timer-box"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ minWidth: 60, fontWeight: "bold" }}
              >
                {formatTime(recordingTime)}
              </Typography>

              <Box
                className="bf-mgaic-chat-audio-recorder__recording-status-box"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {/* עיגול אדום מהבהב */}
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "error.main",
                    animation: "blink 1s infinite",
                    "@keyframes blink": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.3 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {t.recording}
                </Typography>
              </Box>
            </Box>

            {/* Live waveform during recording - takes remaining space */}
            {renderLiveWaveform()}

            {/* כפתור ביטול */}
            <IconButton
              className="bf-mgaic-chat-audio-recorder__cancel-button"
              color="error"
              onClick={cancelRecording}
              disabled={isProcessing}
              sx={{
                width: 48,
                height: 48,
                animation: "pulse 1s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
                boxShadow: isDark
                  ? "0 0 20px rgba(244, 67, 54, 0.3)"
                  : "0 0 20px rgba(244, 67, 54, 0.5)",
                backgroundColor: isDark
                  ? "rgba(244, 67, 54, 0.15)"
                  : "rgba(244, 67, 54, 0.1)",
                border: "2px solid",
                borderColor: "error.main",
                "&:hover": {
                  borderColor: "error.dark",
                  backgroundColor: isDark
                    ? "rgba(244, 67, 54, 0.25)"
                    : "rgba(244, 67, 54, 0.2)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* כפתור אישור */}
            <IconButton
              className="bf-mgaic-chat-audio-recorder__confirm-button"
              color="success"
              onClick={confirmRecording}
              disabled={isProcessing}
              sx={{
                width: 48,
                height: 48,
                animation: "pulse 1s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
                boxShadow: isDark
                  ? "0 0 20px rgba(76, 175, 80, 0.3)"
                  : "0 0 20px rgba(76, 175, 80, 0.5)",
                backgroundColor: isDark
                  ? "rgba(76, 175, 80, 0.15)"
                  : "rgba(76, 175, 80, 0.1)",
                border: "2px solid",
                borderColor: "success.main",
                "&:hover": {
                  borderColor: "success.dark",
                  backgroundColor: isDark
                    ? "rgba(76, 175, 80, 0.25)"
                    : "rgba(76, 175, 80, 0.2)",
                },
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Dialog להצגת האודיו */}
      <Dialog
        sx={{ zIndex: 100000 }}
        className="bf-mgaic-chat-audio-recorder__dialog"
        open={showDialog}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: isDark
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.15)"
                : "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: isDark
                ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      >
        <DialogTitle className="bf-mgaic-chat-audio-recorder__dialog-title">
          {t.audioRecording}
        </DialogTitle>
        <DialogContent className="bf-mgaic-chat-audio-recorder__dialog-content">
          <Box
            className="bf-mgaic-chat-audio-recorder__dialog-content-box"
            sx={{ mt: 2 }}
          >
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
                      borderColor: isDark
                        ? "rgba(255, 255, 255, 0.15)"
                        : theme.palette.divider,
                      borderRadius: "4px",
                      overflow: "hidden",
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                    }}
                  />
                </Box>

                {/* כפתורי נגינה */}
                <Box
                  className="bf-mgaic-chat-audio-recorder__play-pause-button"
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
                  <Box
                    className="bf-mgaic-chat-audio-recorder__status-box"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
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
              <Alert
                className="bf-mgaic-chat-audio-recorder__processing-alert"
                severity="info"
                sx={{ mt: 2 }}
              >
                <LinearProgress sx={{ mb: 1 }} />
                {t.convertingAudio}
              </Alert>
            )}

            {speechError && (
              <Alert
                className="bf-mgaic-chat-audio-recorder__speech-error-alert"
                severity="error"
                sx={{ mt: 2 }}
              >
                {speechError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            className="bf-mgaic-chat-audio-recorder__cancel-button"
            onClick={handleClose}
            startIcon={<CloseIcon />}
          >
            {t.cancel}
          </Button>
          <Button
            className="bf-mgaic-chat-audio-recorder__confirm-button"
            onClick={() => {
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
