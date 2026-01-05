"use client";

import { FlowChartAnimation } from "./FlowChartAnimation";
import { Typography } from "../ui/Typography";
import { AiOutlineNodeIndex } from "react-icons/ai";
import { MdCropSquare } from "react-icons/md";
import { motion, MotionValue } from "framer-motion";

interface HeroSectionProps {
  gapAnimation?: MotionValue<string>;
}

export function HeroSection({ gapAnimation }: HeroSectionProps) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* --- BACKGROUND LAYER 1: Dot Grid --- */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: "radial-gradient(#6f6f6f 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 90%)",
        }}
      />

      {/* --- BACKGROUND LAYER 2: Flowchart Animation --- */}
      <FlowChartAnimation />

      {/* --- FOREGROUND CONTENT --- */}
        <motion.div 
          className="w-full flex flex-col items-center justify-center"
          style={gapAnimation ? { gap: gapAnimation } : { gap: "0.5rem" }}
        >
          <Typography variant="h1" className="flex items-center justify-center gap-3">
            THE CREATIVE <AiOutlineNodeIndex /> PLACE
            FOR
          </Typography>

          <Typography variant="h1">
            <MdCropSquare className="w-7 h-7 mb-8 inline"/> WEB2 <span className="mx-3">&</span> WEB3 AUTOMATION
          </Typography>
        </motion.div>
    </section>
  );
}
