import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import BubbleBackground from "../BubbleBackground";

const meta: Meta<typeof BubbleBackground> = {
  title: "Components/BubbleBackground",
  component: BubbleBackground,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "רקע עם אנימציה של כוכבים/בועות נעים",
      },
    },
  },
  decorators: [],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithContent: Story = {
  args: {},
  decorators: [
    (Story) => (
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Story />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            textAlign: "center",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              margin: 0,
              textShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
          >
            תוכן מעל הרקע
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
            הרקע עם האנימציה נראה מאחורי התוכן
          </p>
        </Box>
      </Box>
    ),
  ],
};

export const DarkTheme: Story = {
  args: {},
  decorators: [
    (Story) => (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Story />
      </Box>
    ),
  ],
};

export const LightTheme: Story = {
  args: {},
  decorators: [
    (Story) => (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Story />
      </Box>
    ),
  ],
};
