"use client"

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ProblemStatementSection } from "./ProblemStatementSection";
import { SolutionSection } from "./SolutionSection";

type ProblemSolutionHorizontalProps = {
  externalProgress?: MotionValue<number>;
};

export function ProblemSolutionHorizontal({ externalProgress }: ProblemSolutionHorizontalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Prefer external timeline when provided, otherwise fall back to local scroll.
  const progress = externalProgress ?? scrollYProgress;

  // Hold the track still until the Problem timeline finishes, then add a small buffer,
  // and only after that slide to the Solution panel.
  const translateX = useTransform(progress, [0, 0.95, 0.952, 1], ["0vw", "0vw", "0vw", "-100vw"]);

  return (
    <section ref={containerRef} className="relative h-[1000vh] bg-black z-50">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-screen w-[200vw]"
          style={{ x: translateX }}
        >
          <div className="w-screen h-screen shrink-0">
            <ProblemStatementSection heightClass="h-[900vh]" progressExternal={progress} />
          </div>
          <div className="w-screen h-screen shrink-0">
            <div className="h-full flex items-center bg-black">
              <SolutionSection />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

