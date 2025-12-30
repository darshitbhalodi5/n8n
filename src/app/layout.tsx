import type { Metadata } from "next";
import { Hubot_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Hubot_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unified Automation - Web2 + Web3",
  description: "Connect everything. Automate anything. From APIs to blockchains, one powerful platform for all your automation needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
