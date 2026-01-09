import { ArrowDownRight, Play, MoveUpRight } from "lucide-react";
import { Section } from "@/components/layout";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useRef } from "react";

// --- Components ---

// 1. The Image Card
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
      "relative overflow-hidden rounded-2xl bg-neutral-300 shrink-0 h-[12vh] w-[150px] md:w-[260px]",
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

// 3. The Shape Helpers
const SolidCircle = () => (
  <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-black shrink-0" />
);

const SolidRect = () => (
  <div className="w-20 h-12 md:w-40 md:h-24 bg-black shrink-0 rounded-sm" />
);

const HollowSquare = () => (
  <div className="w-10 h-10 md:w-20 md:h-20 border-[6px] border-black shrink-0" />
);

const SolidTriangle = () => (
  <Play className="w-16 h-16 md:w-32 md:h-32 text-black fill-black shrink-0 ml-2" />
);

const GradientBox = () => (
  <div className="shrink-0 h-[100px] md:h-[160px] w-[180px] md:w-[300px] rounded-2xl bg-linear-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
    <div className="grid grid-cols-6 gap-2 opacity-50">
      {[...Array(24)].map((_, i) => (
        <div key={i} className="w-1 h-1 bg-white rounded-full" />
      ))}
    </div>
  </div>
);

const ParallaxRow = ({
  children,
  progress,
  speed = 1,
  initialOffset = 0,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  speed?: number;
  initialOffset?: number; // Start a bit to the right or left
}) => {
  // We map the vertical scroll (0 to 1) to horizontal pixels
  // Adjust output range (e.g., -1000) to control how far it moves left
  const transform = useTransform(
    progress,
    [0, 1],
    [initialOffset, -1200 * speed + initialOffset]
  );

  // Add a spring for smoother physics-based movement (optional, removes jitter)
  const x = useSpring(transform, { stiffness: 400, damping: 90 });

  return (
    <motion.div
      style={{ x }}
      className="flex items-center gap-4 md:gap-8 px-4 w-max"
    >
      {children}
    </motion.div>
  );
};

export function SolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <Section
      ref={containerRef}
      className="bg-black flex flex-col items-center justify-center gap-0"
    >
      {/* --- ROW 1: BRANDING --- */}
      <ParallaxRow progress={scrollYProgress} speed={1.1} initialOffset={1300}>
        <div className="bg-white flex items-center gap-4 md:gap-8 px-4 w-full overflow-hidden whitespace-nowrap h-[17vh]">
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
        </div>
      </ParallaxRow>

      {/* --- ROW 2: WEBSITES --- */}
      <ParallaxRow progress={scrollYProgress} speed={1.1} initialOffset={1100}>
        <div className="bg-white flex items-center gap-4 md:gap-8 px-4 w-full overflow-hidden whitespace-nowrap h-[17vh]">
          <MediaCard src="https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Websites
          </h2>
          <SolidCircle />
          <MediaCard src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=600" />
        </div>
      </ParallaxRow>

      {/* --- ROW 3: SOCIAL --- */}
      <ParallaxRow progress={scrollYProgress} speed={1.1} initialOffset={700}>
        <div className="bg-white flex items-center gap-4 md:gap-8 px-4 w-full overflow-hidden whitespace-nowrap h-[17vh]">
          <MediaCard src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Social
          </h2>
          <SolidRect />
          <MediaCard src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" />
        </div>
      </ParallaxRow>

      {/* --- ROW 4: CAMPAIGNS --- */}
      <ParallaxRow progress={scrollYProgress} speed={1.1} initialOffset={900}>
        <div className="bg-white flex items-center gap-4 md:gap-8 px-4 w-full overflow-hidden whitespace-nowrap justify-center md:justify-start h-[17vh]">
          <MediaCard src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" />
          <HollowSquare />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Campaigns
          </h2>
          <GradientBox />
          <MediaCard src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600" />
        </div>
      </ParallaxRow>

      {/* --- ROW 5: MOTION --- */}
      <ParallaxRow progress={scrollYProgress} speed={1.1} initialOffset={1200}>
        <div className="bg-white flex items-center gap-4 md:gap-8 px-4 w-full overflow-hidden whitespace-nowrap h-[17vh]">
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
          <SolidTriangle />
          <MediaCard src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600" />
        </div>
      </ParallaxRow>
      {/* --- ROW 6: EXPERIENTIAL --- */}
      <ParallaxRow progress={scrollYProgress} speed={1.1} initialOffset={1400}>
        <div className="bg-white flex items-center gap-4 md:gap-8 px-4 w-full overflow-hidden whitespace-nowrap h-[17vh]">
          <MediaCard src="https://images.unsplash.com/photo-1561489396-888724a1543d?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600" />
          <MediaCard src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&q=80&w=600" />
          <h2 className="text-7xl md:text-9xl font-bold tracking-tight leading-none shrink-0 text-black uppercase select-none">
            Experiential
          </h2>
          <MoveUpRight className="w-16 h-16 md:w-36 md:h-36 text-black shrink-0 stroke-[1.5]" />
        </div>
      </ParallaxRow>
    </Section>
  );
}
