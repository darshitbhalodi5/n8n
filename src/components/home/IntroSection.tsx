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

  // Stats opacity: starts at 0, becomes 1 when scrollProgress reaches 0.6
  const statsOpacity = useTransform(
    progress,
    [0.6, 0.8],
    [0, 1]
  );

  // Stats Y position: slides up
  const statsY = useTransform(
    progress,
    [0.6, 0.8],
    [20, 0]
  );

  const stats = [
    { label: "Protocol Integration", value: "15+" },
    { label: "Workflow Created", value: "1000+" },
    { label: "Volume Automated", value: "$1M+" },
    { label: "Transaction Count", value: "70K+" },
    { label: "Public Workflow Template", value: "400+" },
  ];

  return (
    // Added w-full h-full to ensure it fills the wrapper
    <div className="h-full w-full flex flex-col gap-3 items-center justify-center bg-[#7A1CAC] px-4 overflow-hidden">
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
        className="max-w-4xl"
        style={{ opacity: descriptionOpacity }}
      >
        <Typography
          variant="body"
          align="center"
          className="text-gray-300 md:text-xl leading-relaxed"
        >
          <span className="block font-semibold text-white mb-2">Connect everything. Automate anything.</span>
          Seamlessly bridge the gap between traditional apps and decentralized networks.
          Create powerful workflows without the complexity, manage operations effortlessly,
          and unlock the full potential of automation in one unified platform.
        </Typography>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-12 w-full max-w-[90rem]"
        style={{ opacity: statsOpacity, y: statsY }}
      >
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center justify-center gap-2">
            <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-200 drop-shadow-sm">
              {stat.value}
            </span>
            <span className="text-xs md:text-sm text-blue-200/70 text-center font-medium uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
