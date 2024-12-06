export interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}
