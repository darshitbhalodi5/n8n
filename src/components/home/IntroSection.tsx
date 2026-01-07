"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Typography } from "../ui/Typography";

interface IntroSectionProps {
  scrollProgress?: MotionValue<number>;
}

export function IntroSection({ scrollProgress }: IntroSectionProps) {
  // Create a default motion value if scrollProgress is not provided
  const defaultProgress = useMotionValue(0.2);
  const progress = scrollProgress || defaultProgress;

  // Header Y position: starts at 0, moves to -60px when scrollProgress reaches 0.4
  const headerY = useTransform(
    progress,
    [0.4, 0.6],
    [0, -60]
  );

  // Header scale: starts at 1, scales to 0.70 when scrollProgress reaches 0.4
  const headerScale = useTransform(
    progress,
    [0.4, 0.6],
    [1, 0.50]
  );

  // Description container opacity: starts at 0, becomes 1 when scrollProgress reaches 0.4
  const descriptionOpacity = useTransform(
    progress,
    [0.5, 0.7],
    [0, 1]
  );

  return (
    // Added w-full h-full to ensure it fills the wrapper
    <div className="h-full w-full flex flex-col gap-3 items-center justify-center bg-[#10091d]">
      <motion.h1
        className="text-white text-[14vw] font-bold tracking-tighter"
        style={{ 
          y: headerY,
          scale: headerScale
        }}
      >
        FlowForge
      </motion.h1>

      <motion.div
        className="max-w-2xl"
        style={{ opacity: descriptionOpacity }}
      >
        <Typography
          variant="body"
          align="center"
          className="text-gray-400"
        >
          Connect everything. Automate anything. From APIs to blockchains, one powerful platform for all your
          automation needs.
        </Typography>
      </motion.div>
    </div>
  );
}
