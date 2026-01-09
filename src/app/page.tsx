import type { Metadata } from "next";
import { Navbar } from "@/components/layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSolutionHorizontal } from "@/components/home/ProblemSolutionHorizontal";
import { UseCasesSection } from "@/components/home/UseCasesSection";
import { SecuritySection } from "@/components/home/SecuritySection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";
import { IntroSection } from "@/components/home/IntroSection";
import { HomeAnimationWrapper } from "@/components/home/HomeAnimationWrapper";

export const metadata: Metadata = {
  title: "FlowForge - Web2 + Web3 Automation",
  description:
    "Connect everything. Automate anything. From APIs to blockchains, one powerful platform for all your automation needs.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HomeAnimationWrapper hero={<HeroSection />} intro={<IntroSection />} />
      <ProblemSolutionHorizontal />
      <div className="relative z-20 bg-black">
        <UseCasesSection />
        <SecuritySection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
