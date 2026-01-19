import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const LOGOS = [
  // Top path (path-1): All move left to right (reverse: false)
  { name: "Compound", icon: "https://cryptologos.cc/logos/compound-comp-logo.svg", path: "#path-1", duration: 8, delay: 0, reverse: false },
  // { name: "Hyperliquid", icon: "https://hyperliquid.xyz/favicon.ico", path: "#path-1", duration: 9, delay: 2, reverse: false },
  // { name: "DeFiLlama", icon: "https://defillama.com/llama.png", path: "#path-1", duration: 7, delay: 4, reverse: false },
  { name: "Chainlink", icon: "https://cryptologos.cc/logos/chainlink-link-logo.svg", path: "#path-1", duration: 6, delay: 1, reverse: false },
  // { name: "OpenSea", icon: "https://opensea.io/static/images/logos/opensea.svg", path: "#path-1", duration: 10, delay: 3, reverse: false },
  { name: "Mail", icon: "https://cdn.simpleicons.org/gmail/EA4335", path: "#path-1", duration: 11, delay: 5, reverse: false },
  { name: "Telegram", icon: "https://cdn.simpleicons.org/telegram/26A5E4", path: "#path-1", duration: 9, delay: 6, reverse: false },
  { name: "Aave", icon: "https://cryptologos.cc/logos/aave-aave-logo.svg", path: "#path-1", duration: 12, delay: 7, reverse: false },
  // Bottom path (path-2): All move right to left (reverse: true)
  { name: "Tally", icon: "https://www.tally.xyz/favicon.ico", path: "#path-2", duration: 8, delay: 0, reverse: true },
  { name: "Yearn", icon: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.svg", path: "#path-2", duration: 9, delay: 2, reverse: true },
  // { name: "Pyth", icon: "https://raw.githubusercontent.com/pyth-network/pyth-crosschain/main/target_chains/ethereum/sdk/js/pyth_logo.svg", path: "#path-2", duration: 7, delay: 4, reverse: true },
  // { name: "Ostium", icon: "https://ostium.io/favicon.ico", path: "#path-2", duration: 6, delay: 1, reverse: true },
  { name: "Slack", icon: "https://cdn.simpleicons.org/slack/4A154B", path: "#path-2", duration: 10, delay: 3, reverse: true },
  { name: "Uniswap", icon: "https://cryptologos.cc/logos/uniswap-uni-logo.svg", path: "#path-2", duration: 8, delay: 5, reverse: true },
  { name: "1inch", icon: "https://cryptologos.cc/logos/1inch-1inch-logo.svg", path: "#path-2", duration: 7, delay: 6, reverse: true },
];

export function FlowChartAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const logos = LOGOS;

      logos.forEach((logo, index) => {
        const logoId = `logo-${index}`;
        // Create the infinite looping animation along the path
        gsap.to(`#${logoId}`, {
          motionPath: {
            path: logo.path,
            align: logo.path,
            alignOrigin: [0.5, 0.5], // Centers the logo on the line
            autoRotate: true, // Rotates the logo to follow the curve direction
            start: logo.reverse ? 1 : 0, // Start at end for reverse direction
            end: logo.reverse ? 0 : 1, // End at start for reverse direction
          },
          duration: logo.duration,
          repeat: -1,
          ease: "none", // Linear ease for constant flow speed
          delay: logo.delay,
        });

        // Add a subtle pulsing opacity effect
        gsap.to(`#${logoId}`, {
          opacity: 0.7,
          duration: 2,
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
        {LOGOS.map((logo, index) => (
          <g key={logo.name} id={`logo-${index}`} opacity="1">
            <circle r="15" fill="transparent" stroke="transparent" strokeOpacity="0.3" strokeWidth="1" />
            <image
              href={logo.icon}
              x="-10"
              y="-10"
              width="20"
              height="20"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
