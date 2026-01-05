"use client";

import { useRef, cloneElement, isValidElement } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HomeAnimationWrapperProps {
  hero: React.ReactNode;
  intro: React.ReactNode;
}

export function HomeAnimationWrapper({ hero, intro }: HomeAnimationWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Animation runs while this element is in view
  });

  // Map scroll progress to gap spacing between headers
  // Initial: 0.5rem (8px - gap-2), Final: 3.3125rem (53px - 8px + 45px)
  // Happens first: from 0 to 0.4 (first 40% of scroll)
  const gapAnimation = useTransform(
    scrollYProgress,
    [0, 0.1], // Gap animation completes in first 40% of scroll
    ["0.5rem", "3.3125rem"] // From 8px to 53px (8px + 45px)
  );

  // Map scroll progress to clip-path inset
  // Initial: 50% from top, 50% from bottom (effectively a line in the center)
  // Final: 0% from top, 0% from bottom (fully revealed)
  // Happens after gap: from 0.4 to 0.8 (after gap is complete)
  const clipPathAnimation = useTransform(
    scrollYProgress,
    [0, 0.8], // Clipping starts after gap animation completes, finishes at 80%
    ["inset(50% 0 50% 0)", "inset(0% 0 0% 0)"]
  );

  // Clone hero element to pass gapAnimation prop
  const heroWithAnimation = isValidElement(hero)
    ? cloneElement(hero, { gapAnimation } as { gapAnimation: typeof gapAnimation })
    : hero;

  // Clone intro element to pass scrollProgress prop
  const introWithAnimation = isValidElement(intro)
    ? cloneElement(intro, { scrollProgress: scrollYProgress } as { scrollProgress: typeof scrollYProgress })
    : intro;

  return (
    // 1. The container needs extra height (200vh) to allow for the scrolling action
    <section ref={containerRef} className="relative h-[550vh] w-full bg-black">
      
      {/* 2. The Sticky Viewport: Holds both sections in place while we scroll */}
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        
        {/* Layer 1: The Hero Section (Background) */}
        {/* It stays static behind the opening curtain */}
        <div className="absolute inset-0 z-0 w-full h-full">
            {heroWithAnimation}
        </div>

        {/* Layer 2: The Intro Section (Foreground / Curtain) */}
        {/* We apply the clip-path animation here */}
        <motion.div
          className="absolute inset-0 z-10 w-full h-full shadow-2xl"
          style={{ 
            clipPath: clipPathAnimation,
            willChange: "clip-path" 
          }}
        >
          {introWithAnimation}
        </motion.div>
        
      </div>
    </section>
  );
}