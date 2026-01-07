"use client";

import React, { useState } from "react";
import {
  motion,
  MotionValue,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

interface IntroSectionProps {
  scrollProgress?: MotionValue<number>;
}

export function IntroSection({ scrollProgress }: IntroSectionProps) {
  // Create a default motion value if scrollProgress is not provided
  const defaultProgress = useMotionValue(0.2);
  const progress = scrollProgress || defaultProgress;

  // Track when description should be visible (after 0.6 scroll progress)
  const [showDescription, setShowDescription] = useState(false);

  // Listen to scroll progress changes to show/hide description
  useMotionValueEvent(progress, "change", (latest) => {
    setShowDescription(latest >= 0.6);
  });

  return (
    // Added w-full h-full to ensure it fills the wrapper
    <div className="h-full w-full flex flex-col gap-6 items-center justify-center bg-[#10091d]">
      <motion.h1
        className="text-white text-8xl font-bold tracking-tighter"
        animate={{ 
          y: showDescription ? -60 : 0,
          scale: showDescription ? 0.70 : 1
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        FlowForge
      </motion.h1>
      <AnimatePresence>
        {showDescription && (
          <motion.div
            className="text-lg text-gray-400 max-w-2xl text-center leading-relaxed"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              Connect everything. Automate anything.
            </motion.span>
            <br />
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              From APIs to blockchains, one powerful platform for all your
              automation needs.
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
