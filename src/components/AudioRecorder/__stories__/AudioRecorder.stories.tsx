import type { Meta, StoryObj } from "@storybook/react";
import AudioRecorder from "../AudioRecorder";

const meta: Meta<typeof AudioRecorder> = {
  title: "Components/AudioRecorder",
  component: AudioRecorder,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const EnglishLabels: Story = {
  args: {
    lang: "en",
  },
};
