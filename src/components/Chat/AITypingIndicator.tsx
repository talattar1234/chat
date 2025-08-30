import React, { useCallback } from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import { SupportAgent as AIIcon } from "@mui/icons-material";
import { format } from "date-fns";

interface AITypingIndicatorProps {
  aiThinkingLabel: string;
  timeFormat: string;
}

const AITypingIndicator = React.memo<AITypingIndicatorProps>(
  ({ aiThinkingLabel, timeFormat }) => {
    const formatDate = useCallback(
      (date: Date, formatString: string): string => {
        return format(date, formatString);
      },
      []
    );

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          gap: 1,
          maxWidth: "70%",
          width: "100%",
          justifyContent: "start",
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            mt: 1,
            animation: "bounce 2s ease-in-out infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": {
                transform: "translateY(0)",
              },
              "40%": {
                transform: "translateY(-5px)",
              },
              "60%": {
                transform: "translateY(-3px)",
              },
            },
          }}
        >
          <AIIcon />
        </Avatar>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "text.primary",
            borderRadius: "18px",
            maxWidth: "100%",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.15)"
                : "1px solid rgba(0, 0, 0, 0.15)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                : "0 4px 20px rgba(0, 0, 0, 0.15)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              padding: "1px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
                  : "linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.12))",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              zIndex: -1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              padding: "2px",
              background:
                "linear-gradient(45deg, #1976d2, #42a5f5, #9c27b0, #ff9800, #1976d2)",
              backgroundSize: "400% 400%",
              animation: "gradientRotate 3s ease-in-out infinite",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              zIndex: -2,
              "@keyframes gradientRotate": {
                "0%": {
                  backgroundPosition: "0% 50%",
                },
                "50%": {
                  backgroundPosition: "100% 50%",
                },
                "100%": {
                  backgroundPosition: "0% 50%",
                },
              },
            },
            animation: "slideIn 0.5s ease-out",
            "@keyframes slideIn": {
              "0%": {
                opacity: 0,
                transform: "translateY(10px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  animation:
                    "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                  animationDelay: "0s, 0s, 0s, 0s",
                  boxShadow: "0 0 6px rgba(25, 118, 210, 0.3)",
                  "@keyframes colorShift": {
                    "0%, 100%": {
                      background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    },
                    "50%": {
                      background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                    },
                  },
                  "@keyframes rotate": {
                    "0%": {
                      transform: "rotate(0deg)",
                    },
                    "100%": {
                      transform: "rotate(360deg)",
                    },
                  },
                  "@keyframes zoom": {
                    "0%, 100%": {
                      transform: "scale(1)",
                    },
                    "50%": {
                      transform: "scale(1.2)",
                    },
                  },
                }}
              />
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  animation:
                    "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                  animationDelay: "0.3s, 0s, 0.5s, 0.3s",
                  boxShadow: "0 0 6px rgba(25, 118, 210, 0.3)",
                  "@keyframes colorShift": {
                    "0%, 100%": {
                      background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    },
                    "50%": {
                      background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                    },
                  },
                  "@keyframes rotate": {
                    "0%": {
                      transform: "rotate(0deg)",
                    },
                    "100%": {
                      transform: "rotate(360deg)",
                    },
                  },
                  "@keyframes zoom": {
                    "0%, 100%": {
                      transform: "scale(1)",
                    },
                    "50%": {
                      transform: "scale(1.2)",
                    },
                  },
                }}
              />
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  animation:
                    "pulse 1.5s ease-in-out infinite, colorShift 3s ease-in-out infinite, rotate 2s linear infinite, zoom 1.5s ease-in-out infinite",
                  animationDelay: "0.6s, 0s, 1s, 0.6s",
                  boxShadow: "0 0 6px rgba(25, 118, 210, 0.3)",
                  "@keyframes colorShift": {
                    "0%, 100%": {
                      background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    },
                    "50%": {
                      background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                    },
                  },
                  "@keyframes rotate": {
                    "0%": {
                      transform: "rotate(0deg)",
                    },
                    "100%": {
                      transform: "rotate(360deg)",
                    },
                  },
                  "@keyframes zoom": {
                    "0%, 100%": {
                      transform: "scale(1)",
                    },
                    "50%": {
                      transform: "scale(1.2)",
                    },
                  },
                }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.7,
                animation: "fadeInOut 2s ease-in-out infinite",
                "@keyframes fadeInOut": {
                  "0%, 100%": {
                    opacity: 0.7,
                  },
                  "50%": {
                    opacity: 1,
                  },
                },
              }}
            >
              {aiThinkingLabel}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                textAlign: "end",
              }}
            >
              {formatDate(new Date(), timeFormat)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }
);

AITypingIndicator.displayName = "AITypingIndicator";

export default AITypingIndicator;
