import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "SGMP — Soul Groove Memory Protocol",
  description:
    "Autonomous Music Intelligence Platform for AI-native artist systems that evolve through memory, emotion, audience behavior and time.",
  keywords: [
    "AI",
    "Music",
    "Autonomous Artists",
    "Machine Learning",
    "Music Intelligence",
    "SGMP",
    "Soul Groove Memory Protocol",
  ],
  metadataBase: new URL("https://sgmp.tr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SGMP — Soul Groove Memory Protocol",
    description:
      "Autonomous Music Intelligence Platform for AI-native artist systems that evolve through memory, emotion, audience behavior and time.",
    url: "https://sgmp.tr",
    siteName: "SGMP",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SGMP — Soul Groove Memory Protocol",
    description:
      "Autonomous Music Intelligence Platform for AI-native artist systems that evolve through memory, emotion, audience behavior and time.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
