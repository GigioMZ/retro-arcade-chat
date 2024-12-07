import { Metadata } from "next";

import { RetroChatGPT } from "@/components/retro-chat-gpt";

export const metadata: Metadata = {
  title: "Retro Chat GPT | Powered by Hurist",
  description: "Engage in a conversation with Retro Chat GPT, your AI-powered assistant.",
};

export default function Home() {
  return <RetroChatGPT />;
}
