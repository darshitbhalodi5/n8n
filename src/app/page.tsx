import type { Metadata } from "next";
import { Navbar } from "@/components/layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSolutionHorizontal } from "@/components/home/ProblemSolutionHorizontal";
import { Footer } from "@/components/home/Footer";
import { IntroSection } from "@/components/home/IntroSection";
import { HomeAnimationWrapper } from "@/components/home/HomeAnimationWrapper";

export const metadata: Metadata = {
  title: "FlowForge — Unified Web2 & Web3 Automation Platform",
  description:
    "FlowForge is a powerful automation platform that connects Web2 systems and Web3 blockchains in one visual workflow builder. Build, automate, and scale without code.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HomeAnimationWrapper hero={<HeroSection />} intro={<IntroSection />} />
      <ProblemSolutionHorizontal />
      <div className="relative z-20 bg-black">
        <Footer />
      </div>
    </div>
  );
}
