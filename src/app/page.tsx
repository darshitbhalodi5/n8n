import type { Metadata } from "next";
import NavBar from "@/components/layout/Navbar";
import { ProblemSolutionHorizontal } from "@/components/home/ProblemSolutionHorizontal";
import { Footer } from "@/components/layout/Footer";
import { HomeAnimationWrapper } from "@/components/home/HomeAnimationWrapper";
import { WordsScrollSection } from "@/components/home/WordsScrollSection";
import { AwardsMentionsSection } from "@/components/home/AwardsMentionsSection";

export const metadata: Metadata = {
  title: "FlowForge — Unified Web2 & Web3 Automation Platform",
  description:
    "FlowForge is a powerful automation platform that connects Web2 systems and Web3 blockchains in one visual workflow builder. Build, automate, and scale without code.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HomeAnimationWrapper />
      <ProblemSolutionHorizontal />
      <WordsScrollSection />
      <AwardsMentionsSection />
      <Footer />
    </div>
  );
}
