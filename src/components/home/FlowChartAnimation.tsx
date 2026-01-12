import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

export function FlowChartAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const flows = [
        // Forward direction packets
        { path: "#path-1", packet: "#packet-1", duration: 8, delay: 0, reverse: false },
        { path: "#path-2", packet: "#packet-2", duration: 9, delay: 2, reverse: false },
        // Reverse direction packets
        { path: "#path-1", packet: "#packet-1-reverse", duration: 6, delay: 1, reverse: true },
        { path: "#path-2", packet: "#packet-2-reverse", duration: 10, delay: 0, reverse: true },
      ];

      flows.forEach((flow, index) => {
        // Create the infinite looping animation along the path
        gsap.to(flow.packet, {
          motionPath: {
            path: flow.path,
            align: flow.path,
            alignOrigin: [0.5, 0.5], // Centers the packet on the line
            autoRotate: true, // Rotates the packet to follow the curve direction
            start: flow.reverse ? 1 : 0, // Start at end for reverse direction
            end: flow.reverse ? 0 : 1, // End at start for reverse direction
          },
          duration: flow.duration,
          repeat: -1,
          ease: "none", // Linear ease for constant flow speed
          delay: flow.delay,
        });

        // Add a pulsing opacity effect to make it look like active energy
        // Packet 2 needs higher base opacity to be more visible
        const minOpacity = index === 1 || index === 3 ? 0.6 : 0.4;
        gsap.to(flow.packet, {
          opacity: minOpacity,
          duration: 0.5,
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: containerRef }
  );

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
        <defs>
          {/* Gradients for the packets */}
          <radialGradient id="grad-blue" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad-purple" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- GROUP 1: Static "Cables" (The tracks) --- */}
        <g stroke="white" strokeOpacity="0.08" strokeWidth="2" fill="none">
          {/* Top-Left to Right */}
          <path
            id="path-1"
            d="M -100 200 C 300 200, 400 400, 700 400 S 1100 200, 1600 200"
          />
          {/* Bottom-Left to Right */}
          <path
            id="path-2"
            d="M -100 700 C 300 700, 400 500, 720 500 S 1100 800, 1600 800"
          />
        </g>

        {/* --- GROUP 2: Animated "Packets" (The moving data) --- */}
        {/* Packet 1 (Blue) - Forward */}
        <g id="packet-1">
          <circle r="6" fill="url(#grad-blue)" />
          {/* A small tail for speed effect */}
          <path
            d="M -10 0 L 0 0"
            stroke="#60a5fa"
            strokeWidth="2"
            opacity="0.5"
          />
        </g>

        {/* Packet 1 Reverse (Blue) - Backward */}
        <g id="packet-1-reverse">
          <circle r="6" fill="url(#grad-blue)" />
          {/* A small tail for speed effect */}
          <path
            d="M -10 0 L 0 0"
            stroke="#60a5fa"
            strokeWidth="2"
            opacity="0.5"
          />
        </g>

        {/* Packet 2 (Purple) - Forward */}
        <g id="packet-2">
          <circle r="6" fill="url(#grad-purple)" fillOpacity="0.9" />
          {/* <circle r="12" fill="#a78bfa" fillOpacity="0.2" /> */}
          <path
            d="M -12 0 L 0 0"
            stroke="#a78bfa"
            strokeWidth="2"
            opacity="0.6"
          />
        </g>

        {/* Packet 2 Reverse (Purple) - Backward */}
        <g id="packet-2-reverse">
          <circle r="6" fill="url(#grad-purple)" fillOpacity="0.9" />
          <path
            d="M -12 0 L 0 0"
            stroke="#a78bfa"
            strokeWidth="2"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}
