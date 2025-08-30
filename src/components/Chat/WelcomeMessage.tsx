import React, { useCallback } from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import { SupportAgent as AIIcon } from "@mui/icons-material";
import { format } from "date-fns";

interface WelcomeMessageProps {
  lang: "he" | "en";
  timeFormat: string;
}

const WelcomeMessage = React.memo<WelcomeMessageProps>(
  ({ lang, timeFormat }) => {
    const formatDate = useCallback(
      (date: Date, formatString: string): string => {
        return format(date, formatString);
      },
      []
    );

    return (
      <Box
        className="bf-mgaic-chat__welcome-message"
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
        <Avatar sx={{ bgcolor: "primary.main", mt: 1 }}>
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
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {lang === "he"
              ? "שלום! ברוך הבא לצ'אט שלנו. אני כאן כדי לעזור לך בכל שאלה או בקשה שיש לך. איך אוכל לסייע לך היום?"
              : "Hello! Welcome to our chat. I'm here to help you with any questions or requests you may have. How can I assist you today?"}
          </Typography>
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

WelcomeMessage.displayName = "WelcomeMessage";

export default WelcomeMessage;
