"use client";

import { ArrowDownRight, MoveUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, useTransform, MotionValue } from "framer-motion";

type SolutionSectionProps = {
  progress: MotionValue<number>;
};

const RevealRow = ({
  children,
  x,
  scale,
  scroll,
}: {
  children: React.ReactNode;
  x: MotionValue<string>;
  scale: MotionValue<number>;
  scroll: MotionValue<string>;
}) => {
  return (
    <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
      <motion.div
        style={{ scale }}
        className="origin-left will-change-transform"
      >
        <motion.div
          style={{ x: scroll }}
          className="flex w-max items-start gap-4 will-change-transform"
        >
          {children}
        </motion.div>
      </motion.div>

      {/* The Black Curtain Overlay */}
      <motion.div
        style={{ x }}
        className="absolute inset-0 bg-black z-20 will-change-transform pointer-events-none"
      />
    </div>
  );
};
const MediaCard = ({
  src,
  className,
  label,
}: {
  src: string;
  className?: string;
  label?: string;
}) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl bg-neutral-200 shrink-0 h-[12vh] w-[150px] md:w-[260px]",
      className
    )}
  >
    <Image
      src={src}
      width={260}
      height={160}
      alt="Portfolio item"
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
    />
    {label && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <span className="text-white font-bold text-lg md:text-xl tracking-wide">
          {label}
        </span>
      </div>
    )}
  </div>
);

export function SolutionSection({ progress }: SolutionSectionProps) {
  const row1X = useTransform(
    progress,
    [0, 0.2, 0.25, 0.55],
    ["0%", "-30%", "-40%", "-100%"]
  );
  const row1Scale = useTransform(progress, [0, 0.7], [1.2, 1]);
  // Initial scroll animation, then continue scrolling horizontally after 0.58
  const row1Scroll = useTransform(
    progress,
    [0, 0.54, 0.58, 1],
    ["10%", "0%", "0%", "-10%"]
  );

  // Row 2: Starts slightly later (0.1 -> 0.40)
  const row2X = useTransform(
    progress,
    [0, 0.2, 0.3, 0.6],
    ["0%", "-50%", "-60%", "-100%"]
  );
  const row2Scale = useTransform(progress, [0, 0.7], [1.2, 1]);
  // Initial scroll animation, then continue scrolling horizontally after 0.58
  const row2Scroll = useTransform(
    progress,
    [0, 0.58, 1],
    ["12%", "0%", "-5%"]
  );

  // Row 3: Slow reveal (0.05 -> 0.50)
  const row3X = useTransform(
    progress,
    [0, 0.2, 0.4, 0.49],
    ["0%", "-60%", "-80%", "-100%"]
  );
  const row3Scale = useTransform(progress, [0, 0.7], [1.3, 1]);
  // Initial scroll animation, then continue scrolling horizontally after 0.58
  const row3Scroll = useTransform(
    progress,
    [0, 0.45, 0.58, 1],
    ["18%", "0%", "0%", "-15%"]
  );

  // Row 4: Fast middle reveal (0.20 -> 0.45)
  const row4X = useTransform(
    progress,
    [0, 0.1, 0.4, 0.52],
    ["0%", "-45%", "-70%", "-100%"]
  );
  const row4Scale = useTransform(progress, [0, 0.7], [1.2, 1]);
  // Initial scroll animation, then continue scrolling horizontally after 0.58
  const row4Scroll = useTransform(
    progress,
    [0, 0.5, 0.58, 1],
    ["10%", "0%", "0%", "0%"]
  );

  // Row 5: Late start (0.30 -> 0.60)
  const row5X = useTransform(
    progress,
    [0, 0.2, 0.5, 0.6],
    ["0%", "-55%", "-68%", "-100%"]
  );
  const row5Scale = useTransform(progress, [0, 0.7], [1.3, 1]);
  // Initial scroll animation, then continue scrolling horizontally after 0.58
  const row5Scroll = useTransform(
    progress,
    [0, 0.57, 0.58, 1],
    ["20%", "0%", "0%", "-20%"]
  );

  // Row 6: Last to finish (0.40 -> 0.85)
  const row6X = useTransform(
    progress,
    [0, 0.2, 0.3, 0.5],
    ["0%", "-20%", "-73%", "-100%"]
  );
  const row6Scale = useTransform(progress, [0, 0.7], [1.3, 1]);
  // Initial scroll animation, then continue scrolling horizontally after 0.58
  const row6Scroll = useTransform(
    progress,
    [0, 0.48, 0.58, 1],
    ["30%", "0%", "0%", "-10%"]
  );

  return (
    <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Row 1 */}
      <RevealRow x={row1X} scale={row1Scale} scroll={row1Scroll}>
        <div className="flex items-start justify-center h-[17vh] gap-4 w-full py-3">
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600"
            className="md:w-[200px]"
          />
          <MediaCard src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Branding
          </h2>
          <ArrowDownRight className="w-16 h-16 md:w-36 md:h-36 text-black shrink-0 stroke-[1.5]" />
          <MediaCard src="https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"
            label="Graphic"
          />
          <MediaCard src="https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600"
            className="md:w-[200px]"
          />
          <MediaCard src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=600" />
        </div>
      </RevealRow>

      {/* Row 2 */}
      <RevealRow x={row2X} scale={row2Scale} scroll={row2Scroll}>
        <div className="flex items-start justify-center h-[17vh] gap-4 w-full py-3">
          <MediaCard src="https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Websites
          </h2>
          <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-black shrink-0" />
          <MediaCard src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600"
            className="md:w-[200px]"
          />
          <MediaCard src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=600" />
        </div>
      </RevealRow>

      {/* Row 3 */}
      <RevealRow x={row3X} scale={row3Scale} scroll={row3Scroll}>
        <div className="flex items-start justify-center h-[17vh] gap-4 w-full py-3">
          <MediaCard src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Social
          </h2>
          <div className="w-20 h-12 md:w-40 md:h-24 bg-black shrink-0 rounded-sm" />
          <MediaCard src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600"
            className="md:w-[200px]"
          />
          <MediaCard src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=600" />
        </div>
      </RevealRow>

      {/* Row 4 */}
      <RevealRow x={row4X} scale={row4Scale} scroll={row4Scroll}>
        <div className="flex items-start justify-center h-[17vh] gap-4 w-full py-3">
          <MediaCard src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" />
          <div className="w-10 h-10 md:w-20 md:h-20 border-[6px] border-black shrink-0" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Campaigns
          </h2>
          <div className="shrink-0 h-[100px] md:h-[160px] w-[180px] md:w-[300px] rounded-2xl bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
            <div className="grid grid-cols-6 gap-2 opacity-50">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full" />
              ))}
            </div>
          </div>
          <MediaCard src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600"
            className="md:w-[200px]"
          />
          <MediaCard src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=600" />
        </div>
      </RevealRow>

      {/* Row 5 */}
      <RevealRow x={row5X} scale={row5Scale} scroll={row5Scroll}>
        <div className="flex items-start justify-center h-[17vh] gap-4 w-full py-3">
          <MediaCard src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600"
            label="worked"
            className="grayscale contrast-125"
          />
          <MediaCard src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Motion
          </h2>
          <Play className="w-16 h-16 md:w-32 md:h-32 text-black fill-black shrink-0 ml-2" />
          <MediaCard src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600"
            className="md:w-[200px]"
          />
          <MediaCard src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=600" />
        </div>
      </RevealRow>

      {/* Row 6 */}
      <RevealRow x={row6X} scale={row6Scale} scroll={row6Scroll}>
        <div className="flex items-start justify-center h-[17vh] gap-4 w-full py-3">
          <MediaCard src="https://images.unsplash.com/photo-1561489396-888724a1543d?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Experiential
          </h2>
          <MoveUpRight className="w-16 h-16 md:w-36 md:h-36 text-black shrink-0 stroke-[1.5]" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <MediaCard
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600"
            className="md:w-[200px]"
          />
          <MediaCard src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=600" />
        </div>
      </RevealRow>
    </div>
  );
}
