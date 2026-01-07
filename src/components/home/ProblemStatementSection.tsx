"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  SquareArrowOutUpRight,
} from "lucide-react";

export function ProblemStatementSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- COORDINATE MAPPING ---
  // We use 3 keyframes in the arrays: [Start, Gap-Expanded, Final-Position]
  // Scroll Points: 0.0 (Start) -> 0.15 (Gap Max) -> 0.3 (Corner Reached)

  // 1. COMPLEX
  // X: Stays 0 initially, then moves Left
  const complexX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.75],
    ["0%", "0%", "-28vw", "-32vw"]
  );
  // Y: Starts at -90px (top of stack), moves to -150px (gap), moves to -42vh (top corner)
  const complexY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.75],
    ["-10vh", "-20vh", "-20vh", "-40vh"]
  );

  // 2. MADE
  // X: Stays 0 initially, then moves Right
  const madeX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.75],
    ["0%", "0%", "28vw", "32vw"]
  );
  // Y: Starts Center, Stays Center during gap, moves to -42vh (aligns with Complex at top)
  const madeY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.75],
    ["0vh", "0vh", "-20vh", "-40vh"]
  );

  // 3. COMPELLING
  // Y: Starts 60px (bottom of stack), moves to 150px (gap), moves to 38vh (bottom)
  const compellingY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.75],
    ["10vh", "20vh", "20vh", "40vh"]
  );

  // --- TEXT SCALING ---
  // Large in center stack (1), shrinks slightly when moving to corners (0.6)
  const textScale = useTransform(scrollYProgress, [0.15, 0.3], [1, 0.6]);

  // --- ICON SWAPPING ---
  // 1. Initial Lockup Icons (Play, Square, etc): Visible at start, fade out as they move to corners
  const initialIconsOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25],
    [1, 0]
  );

  // 2. Final Layout Icons (Arrows at bottom): Invisible at start, fade in at end
  const finalIconsOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);

  // --- ORANGE CARD ANIMATIONS ---
  // Starts after the text has cleared the center area (around 0.3)
  const cardOpacity = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);
  const cardHeight = useTransform(scrollYProgress, [0.35, 0.75], ["60px", "500px"]);
  const cardWidth = useTransform(scrollYProgress, [0.35, 0.75], ["55vw", "55vw"]);
  const cardX = useTransform(scrollYProgress, [0.81, 0.95], ["0vw", "-36vw"]);
  const cardY = useTransform(scrollYProgress, [0.81, 0.95], ["0vh", "-10vh"]);
  const cardScale = useTransform(scrollYProgress, [0.81, 0.95], [1, 0.35]);

  const imageScale = useTransform(scrollYProgress, [0.35, 0.75], [1.5, 1]);

  // --- NEW: RIGHT SIDE IMAGES ANIMATION ---
  const sideImagesOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);

  const sideImage1Height = useTransform(scrollYProgress, [0.65, 0.8], ["0px", "170px"]);
  const sideImage1X = useTransform(scrollYProgress, [0.81, 0.95, 1.0], ["0vw", "-36vw", "-75vw"]);
  const sideImage1Scale = useTransform(scrollYProgress, [0.81, 0.95, 1.0], [1, 2.85, 1]); 
  const sideImage1ZIndex = useTransform(scrollYProgress, [0.81, 0.82], [0, 40]);
  const sideImage1Y = useTransform(scrollYProgress, [0.81, 0.95, 1.0], ["0vh", "10vh", "25vh"]);

  const sideImage2Height = useTransform(scrollYProgress, [0.65, 0.8], ["0px", "130px"]);
  const sideImage2X = useTransform(scrollYProgress, [0.95, 1.0], ["0vw", "-38vw"]);
  const sideImage2Scale = useTransform(scrollYProgress, [0.95, 1.0], [1, 3.7]); 
  const sideImage2ZIndex = useTransform(scrollYProgress, [0.95, 0.96], [0, 40]);
  const sideImage2Y = useTransform(scrollYProgress, [0.95, 1.0], ["0vh", "-11vh"]);
  

  const sideImage3Opacity = useTransform(scrollYProgress, [0.81, 0.95], [0, 1]);
  const sideImage3Height = useTransform(scrollYProgress, [0.81, 0.95], ["0px", "170px"]);

  const sideImage4Opacity = useTransform(scrollYProgress, [0.95, 1.0], [0, 1]);
  const sideImage4Height = useTransform(scrollYProgress, [0.95, 1.0], ["0px", "170px"]);

  return (
    <section ref={containerRef} className="relative h-[450vh] bg-black z-10">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* --- 1. COMPLEX ROW --- */}
        <motion.div
          className="absolute flex items-center z-30 whitespace-nowrap origin-center"
          style={{ x: complexX, y: complexY, scale: textScale }}
        >
          <span className="text-white text-5xl md:text-8xl font-bold tracking-tighter flex items-center">
            COMPLEX
          </span>
          {/* Initial Icon: Play Triangle */}
          <motion.div
            style={{ opacity: initialIconsOpacity }}
            className="ml-4 flex items-center"
          >
            <Play className="fill-white text-white w-6 h-6 md:w-10 md:h-10" />
          </motion.div>
        </motion.div>

        {/* --- 2. MADE ROW --- */}
        <motion.div
          className="absolute flex items-center z-30 whitespace-nowrap origin-center"
          style={{ x: madeX, y: madeY, scale: textScale }}
        >
          {/* Initial Icon: Solid Rectangle */}
          <motion.div
            style={{ opacity: initialIconsOpacity }}
            className="bg-white w-8 h-5 md:w-14 md:h-8 mr-4"
          />

          <span className="text-white text-5xl md:text-8xl font-bold tracking-tighter mr-2">
            MADE
          </span>

          {/* Initial Icon: Square Arrow */}
          <motion.div
            style={{ opacity: initialIconsOpacity }}
            className="mb-2 ml-2"
          >
            <SquareArrowOutUpRight className="text-white stroke-[3px] w-6 h-6 md:w-10 md:h-10 rotate-90" />
          </motion.div>
        </motion.div>

        {/* --- 3. CENTER CARD (THE REVEAL) --- */}
        <motion.div
          className="absolute z-20 bg-[#FF4400] overflow-hidden flex items-center justify-center rounded-lg"
          style={{
            x: cardX,
            y: cardY,
            scale: cardScale,
            opacity: cardOpacity,
            height: cardHeight,
            width: cardWidth,
            maskImage: `
            radial-gradient(ellipse 50px 40px at 50% -10px, transparent 45%, black 45.5%),
            radial-gradient(ellipse 50px 40px at 50% calc(100% + 10px), transparent 45%, black 45.5%)
          `,
            // Essential for visibility: Split the mask vertically so they don't overlap
            maskSize: "100% 51%",
            maskPosition: "top, bottom",
            maskRepeat: "no-repeat",
            // Webkit prefixes for Chrome/Safari support
            WebkitMaskImage: `
            radial-gradient(ellipse 50px 40px at 50% -10px, transparent 45%, black 45.5%),
            radial-gradient(ellipse 50px 40px at 50% calc(100% + 10px), transparent 45%, black 45.5%)
          `,
            WebkitMaskSize: "100% 51%",
            WebkitMaskPosition: "top, bottom",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full mix-blend-multiply opacity-60"
            style={{ scale: imageScale }}
          >
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale" />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            <h3 className="text-white text-6xl md:text-9xl font-black tracking-widest uppercase opacity-90 mix-blend-overlay">
              SCIFY
            </h3>
            <p className="mt-4 text-white text-xs md:text-sm tracking-[0.8em] font-medium uppercase">
              Demand Proof
            </p>
          </div>
        </motion.div>

        {/* --- 4. RIGHT SIDE IMAGES (Expanding from Center) --- */}
        <motion.div
          className="absolute right-[3vw] top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20"
          style={{ opacity: sideImagesOpacity }}
        >
          {/* WRAPPER 1 */}
          <div className="w-[18vw] h-[170px] flex items-center justify-center">
            <motion.div
              style={{
                height: sideImage1Height,
                x: sideImage1X,
                y: sideImage1Y,
                scale: sideImage1Scale,
                zIndex: sideImage1ZIndex,
              }}
              className="w-full bg-slate-800 rounded-lg overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-mono text-2xl font-bold tracking-[0.2em] drop-shadow-lg">
                  1984
                </span>
              </div>
            </motion.div>
          </div>

          {/* WRAPPER 2 */}
          <div className="h-[130px] w-[14vw] ml-[4vw] flex items-center justify-center">
            <motion.div
              style={{ height: sideImage2Height, x: sideImage2X, scale: sideImage2Scale, zIndex: sideImage2ZIndex, y: sideImage2Y }}
              className="w-full bg-blue-900 rounded-lg overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-screen" />
            </motion.div>
          </div>
        </motion.div>

      {/* --- 5. SIDE IMAGE AFTER FIRST MOVE (Expanding from Center) --- */}
        <motion.div
          className="absolute right-[3vw] top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10"
          style={{ opacity: sideImage3Opacity }}
        >
          {/* WRAPPER 1 */}
          <div className="w-[18vw] h-[170px] flex items-center justify-center">
            <motion.div
              style={{
                height: sideImage3Height,
                //   x: sideImage3X,
                //   y: sideImage3Y,
                //   scale: sideImage3Scale,
                // zIndex: sideImage3ZIndex,
              }}
              className="w-full bg-slate-800 rounded-lg overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-mono text-2xl font-bold tracking-[0.2em] drop-shadow-lg">
                  1984
                </span>
              </div>
            </motion.div>
          </div>

          {/* WRAPPER 2 */}
          <div className="h-[130px] w-[14vw] ml-[4vw] flex items-center justify-center">
            <motion.div
              style={{ height: sideImage4Height }}
              className="w-full bg-blue-900 rounded-lg overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-screen" />
            </motion.div>
          </div> 
        </motion.div>

        {/* --- 4. COMPELLING ROW --- */}
        <motion.div
          className="absolute flex items-center justify-center z-30 whitespace-nowrap w-full"
          style={{ y: compellingY }}
        >
          {/* Final Icon: Left Arrow (Fades IN) */}
          <motion.div style={{ opacity: finalIconsOpacity }} className="mr-8">
            <ArrowRight className="text-white w-8 h-8 md:w-12 md:h-12" />
          </motion.div>

          <motion.span
            style={{ scale: textScale }}
            className="text-white text-5xl md:text-8xl font-bold tracking-tighter"
          >
            COMPELLING
          </motion.span>

          {/* Final Icon: Right Arrow (Fades IN) */}
          <motion.div style={{ opacity: finalIconsOpacity }} className="ml-8">
            <ArrowLeft className="text-white w-8 h-8 md:w-12 md:h-12" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
