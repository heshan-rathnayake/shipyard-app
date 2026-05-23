"use client";

import { cn } from "@shipyard/ui/lib/utils";
import { motion } from "framer-motion";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-primary/[0.12]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-linear-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-primary/15",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,oklch(50.8%_0.118_165.612/0.12),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Purely decorative animated background shapes for the hero section.
 * Extracted into a client component so the parent page stays a server component.
 */
export function HeroShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large pill — top left */}
      <ElegantShape
        delay={0.3}
        width={600}
        height={140}
        rotate={12}
        gradient="from-primary/[0.13]"
        className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
      />
      {/* Medium pill — bottom right */}
      <ElegantShape
        delay={0.5}
        width={480}
        height={110}
        rotate={-15}
        gradient="from-primary/[0.09]"
        className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
      />
      {/* Small pill — bottom left */}
      <ElegantShape
        delay={0.4}
        width={280}
        height={75}
        rotate={-8}
        gradient="from-primary/[0.10]"
        className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
      />
      {/* Tiny pill — top right */}
      <ElegantShape
        delay={0.6}
        width={190}
        height={55}
        rotate={20}
        gradient="from-primary/[0.07]"
        className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
      />
      {/* Tiny pill — top centre-left */}
      <ElegantShape
        delay={0.7}
        width={140}
        height={38}
        rotate={-25}
        gradient="from-primary/[0.08]"
        className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
      />
    </div>
  );
}
