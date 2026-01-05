"use client";

import React, { useState } from "react";
import { motion, MotionValue, useTransform, useMotionValue, useMotionValueEvent } from "framer-motion";

interface IntroSectionProps {
  scrollProgress?: MotionValue<number>;
}

export function IntroSection({ scrollProgress }: IntroSectionProps) {
    // Create a default motion value if scrollProgress is not provided
    const defaultProgress = useMotionValue(0.2);
    const progress = scrollProgress || defaultProgress;
    
    // Title appears when section starts becoming visible (around 0.1-0.2)
    const titleOpacity = useTransform(progress, [0.1, 0.2], [0, 1]);
    
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
              style={{ opacity: titleOpacity }}
            >
              FlowForge
            </motion.h1>
            {showDescription && (
                <div className="text-xl text-gray-400 max-w-2xl text-center leading-relaxed">
                    Connect everything. Automate anything. <br />
                    From APIs to blockchains, one powerful platform for all your automation needs.
                </div>
            )}
        </div>
    )
}