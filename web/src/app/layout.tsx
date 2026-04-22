import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn OpenClaw — Full-Stack AI Assistant Bootcamp",
  description: "Master OpenClaw from deployment to automation in 4 weeks. Interactive learning with real Gateway integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
