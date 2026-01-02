import type { Metadata } from "next";
import { Hubot_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ProvidersWrapper from "./providers-wrapper";

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
  title: "FlowForge - Web2 + Web3 Automation Platform",
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
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
