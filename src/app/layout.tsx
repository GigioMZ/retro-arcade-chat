import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retro Arcade Chat | Built by Tomster",
  description: "A retro arcade-themed chat interface built by Tomster",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
