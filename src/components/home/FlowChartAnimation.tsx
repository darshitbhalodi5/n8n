"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Import all SVG files from assets/blocks
import compoundSvg from "@/assets/blocks/Compound.svg";
import chainlinkSvg from "@/assets/blocks/Chainlink.svg";
import mailSvg from "@/assets/blocks/Mail.svg";
import telegramSvg from "@/assets/blocks/Telegram.svg";
import aaveSvg from "@/assets/blocks/Aave.svg";
import tallySvg from "@/assets/blocks/Tally.svg";
import yearnSvg from "@/assets/blocks/Yearn.svg";
import slackSvg from "@/assets/blocks/Slack.svg";
import uniswapSvg from "@/assets/blocks/Uniswap.svg";
import oneinchSvg from "@/assets/blocks/OneInch.svg";
import hyperliquidSvg from "@/assets/blocks/Hyperliquid.svg";
import defillamaSvg from "@/assets/blocks/DefiLlama.svg";
import openseaSvg from "@/assets/blocks/OpenSea.svg";
import pythSvg from "@/assets/blocks/Pyth.svg";
import ostiumSvg from "@/assets/blocks/Ostium.svg";
import zapperSvg from "@/assets/blocks/Zapper.svg";

// Helper function to get point on path at a given progress (0-1)
function getPointOnPath(pathElement: SVGPathElement, progress: number): { x: number; y: number; angle: number } {
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(length * progress);
  
  // Calculate angle for rotation
  let angle = 0;
  if (progress < 1) {
    const nextPoint = pathElement.getPointAtLength(length * (progress + 0.01));
    angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
  } else {
    const prevPoint = pathElement.getPointAtLength(length * (progress - 0.01));
    angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);
  }
  
  return { x: point.x, y: point.y, angle };
}

interface LogoConfig {
  name: string;
  icon: string | { src?: string; default?: string }; // SVG import (Next.js can return string or object)
  path: string;
  duration: number;
  delay: number;
  reverse: boolean;
  fillColor?: string; // Optional fill color
}

const LOGOS: LogoConfig[] = [
  // Top path (path-1): All move left to right (reverse: false)
  { name: "Compound", icon: compoundSvg, path: "#path-1", duration: 10, delay: 0, reverse: false },
  { name: "Hyperliquid", icon: hyperliquidSvg, path: "#path-1", duration: 10, delay: 1, reverse: false },
  { name: "DeFiLlama", icon: defillamaSvg, path: "#path-1", duration: 10, delay: 2, reverse: false },
  { name: "Chainlink", icon: chainlinkSvg, path: "#path-1", duration: 10, delay: 3, reverse: false },
  { name: "OpenSea", icon: openseaSvg, path: "#path-1", duration: 10, delay: 4, reverse: false },
  { name: "Mail", icon: mailSvg, path: "#path-1", duration: 10, delay: 5, reverse: false },
  { name: "Telegram", icon: telegramSvg, path: "#path-1", duration: 10, delay: 6, reverse: false },
  { name: "Aave", icon: aaveSvg, path: "#path-1", duration: 10, delay: 7, reverse: false },
  // Bottom path (path-2): All move right to left (reverse: true)
  { name: "Tally", icon: tallySvg, path: "#path-2", duration: 10, delay: 0, reverse: true },
  { name: "Yearn", icon: yearnSvg, path: "#path-2", duration: 10, delay: 1, reverse: true },
  { name: "Pyth", icon: pythSvg, path: "#path-2", duration: 10, delay: 2, reverse: true },
  { name: "Ostium", icon: ostiumSvg, path: "#path-2", duration: 10, delay: 3, reverse: true },
  { name: "Slack", icon: slackSvg, path: "#path-2", duration: 10, delay: 4, reverse: true },
  { name: "Uniswap", icon: uniswapSvg, path: "#path-2", duration: 10, delay: 5, reverse: true },
  { name: "1inch", icon: oneinchSvg, path: "#path-2", duration: 10, delay: 6, reverse: true },
  { name: "Zapper", icon: zapperSvg, path: "#path-2", duration: 10, delay: 7, reverse: true },
];

// Component to render SVG with optional fill color
function SvgIcon({ src, fillColor, width = 20, height = 20 }: { src: string | { src?: string; default?: string }; fillColor?: string; width?: number; height?: number }) {
  const iconRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!iconRef.current || !src) return;

    // Get the actual URL from Next.js import (could be string or object with src/default)
    const svgUrl = typeof src === 'string' ? src : (src.src || src.default || '');
    if (!svgUrl) {
      console.warn('SvgIcon: No valid URL found for src', src);
      return;
    }

    let cancelled = false;

    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch SVG: ${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      .then((text) => {
        if (cancelled || !iconRef.current) return;
        
        // Parse the SVG
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const parseError = doc.querySelector("parsererror");
        if (parseError) {
          throw new Error("Failed to parse SVG");
        }
        
        const svgElement = doc.querySelector("svg");
        
        if (svgElement && iconRef.current) {
          // Get viewBox from original SVG
          const viewBox = svgElement.getAttribute("viewBox");
          const vbMatch = viewBox ? viewBox.split(" ").map(Number) : [0, 0, 100, 100];
          const svgWidth = vbMatch[2] || 100;
          const svgHeight = vbMatch[3] || 100;
          const scaleX = width / svgWidth;
          const scaleY = height / svgHeight;
          
          // Clone the SVG element
          const clonedSvg = svgElement.cloneNode(true) as SVGElement;
          
          // Apply fill color if provided
          if (fillColor) {
            const allElements = clonedSvg.querySelectorAll("path, polygon, circle, rect, ellipse");
            allElements.forEach((el) => {
              el.setAttribute("fill", fillColor);
            });
          }
          
          // Create a group with proper transform
          const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
          group.setAttribute("transform", `translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`);
          
          // Extract and append inner content
          while (clonedSvg.firstChild) {
            group.appendChild(clonedSvg.firstChild);
          }
          
          iconRef.current.innerHTML = "";
          iconRef.current.appendChild(group);
        }
      })
        .catch((err) => {
          if (!cancelled) {
            console.error("Error loading SVG:", err, "URL:", svgUrl);
          }
        });

    return () => {
      cancelled = true;
    };
  }, [src, fillColor, width, height]);

  if (!src) return null;
  
  return <g ref={iconRef} />;
}

// Component for animating a logo along a path
function AnimatedLogo({ logo }: { logo: LogoConfig }) {
  const pathRef = useRef<SVGPathElement>(null);
  const progress = useMotionValue(logo.reverse ? 1 : 0);
  const opacity = useMotionValue(1);

  useEffect(() => {
    // Animate progress along the path
    const startProgress = logo.reverse ? 1 : 0;
    const endProgress = logo.reverse ? 0 : 1;
    
    progress.set(startProgress);
    
    const progressAnimation = animate(progress, endProgress, {
      duration: logo.duration,
      repeat: Infinity,
      ease: "linear",
      delay: logo.delay,
    });

    // Animate opacity
    const opacityAnimation = animate(opacity, [1, 0.7, 1], {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => {
      progressAnimation.stop();
      opacityAnimation.stop();
    };
  }, [logo, progress, opacity]);

  // Transform progress to x, y, and rotation
  const x = useTransform(progress, (p) => {
    if (!pathRef.current) return 0;
    return getPointOnPath(pathRef.current, p).x;
  });

  const y = useTransform(progress, (p) => {
    if (!pathRef.current) return 0;
    return getPointOnPath(pathRef.current, p).y;
  });

  const rotate = useTransform(progress, (p) => {
    if (!pathRef.current) return 0;
    return getPointOnPath(pathRef.current, p).angle;
  });

  // Path data based on which path the logo uses
  const pathData = logo.path === "#path-1" 
    ? "M -100 150 C 300 150, 400 370, 750 370 C 1100 370, 1200 150, 1600 150"
    : "M -100 750 C 300 750, 400 530, 750 530 C 1100 530, 1200 750, 1600 750";

  return (
    <>
      {/* Hidden path reference for calculations */}
      <path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth="0"
        style={{ display: "none" }}
      />
      <motion.g
        style={{
          x,
          y,
          rotate,
          opacity,
        }}
      >
        <circle r="15" fill="transparent" stroke="transparent" />
        <SvgIcon src={logo.icon} fillColor={logo.fillColor} width={20} height={20} />
      </motion.g>
    </>
  );
}

export function FlowChartAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <svg
        className="w-full h-full opacity-40"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* --- GROUP 1: Static "Cables" (The tracks) --- */}
        <g stroke="white" strokeOpacity="0.15" strokeWidth="2" fill="none">
          {/* Top-Left to Right */}
          <path
            id="path-1"
            d="M -100 150 C 300 150, 400 370, 750 370 C 1100 370, 1200 150, 1600 150"
          />
          {/* Bottom-Left to Right - Symmetric curve dipping in middle */}
          <path
            id="path-2"
            d="M -100 750 C 300 750, 400 530, 750 530 C 1100 530, 1200 750, 1600 750"
          />
        </g>

        {/* --- GROUP 2: Animated Logos (Moving along paths) --- */}
        {LOGOS.map((logo) => (
          <AnimatedLogo key={logo.name} logo={logo} />
        ))}
      </svg>
    </div>
  );
}
