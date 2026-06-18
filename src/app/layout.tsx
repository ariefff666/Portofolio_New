import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { InteractiveBackground } from "@/components/visual/interactive-background.client";
import { MissionControlCursor } from "@/components/visual/mission-control-cursor.client";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "MAP // Mission Console",
    template: "%s | MAP // Mission Console",
  },
  description:
    "Personal portfolio shell built with Next.js, React TypeScript, Tailwind CSS, and Supabase.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-bg-void text-text antialiased">
        <a
          className="sr-only z-50 rounded-sm bg-cyan px-4 py-3 font-mono text-sm font-semibold text-bg-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          href="#main-content"
        >
          Skip to content
        </a>
        <InteractiveBackground />
        <MissionControlCursor />
        {children}
      </body>
    </html>
  );
}
