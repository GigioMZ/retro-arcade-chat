export interface Message {
  role: "user" | "assistant";
  content?: string;
  image?: {
    url: string;
    propmpt: string;
  };
}
