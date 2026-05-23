"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // offset:"start end" → begins when element bottom enters viewport bottom
  // offset:"end start" → ends when element top exits viewport top
  // This makes scrollYProgress track viewport passage, not document scroll,
  // so the animation fires immediately on entry with no long dead scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Clamp the animation to the first 45 % of the scroll range so the card is
  // fully flat and at full size while it is still comfortably in view.
  const rotate = useTransform(scrollYProgress, [0, 0.45], [90, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.45],
    isMobile ? [0.78, 0.96] : [0.82, 1]
  );
  const translateY = useTransform(scrollYProgress, [0, 0.45], [50, 0]);

  return (
    <div
      ref={containerRef}
      // No fixed giant height — card dimensions drive the section height.
      // Vertical padding gives breathing room above and below.
      className="relative flex flex-col items-center justify-center px-4 py-20 md:py-28"
    >
      <div
        className="relative w-full"
        style={{ perspective: "1200px" }}
      >
        {titleComponent && (
          <motion.div
            style={{ translateY }}
            className="mx-auto mb-6 max-w-5xl text-center"
          >
            {titleComponent}
          </motion.div>
        )}
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto h-104 w-full max-w-5xl overflow-hidden rounded-[24px] border-4 border-border/60 bg-zinc-900 p-1.5 shadow-2xl md:h-152 md:p-2"
    >
      {/* Screen area */}
      <div className="h-full w-full overflow-hidden rounded-[18px]">
        {children}
      </div>
    </motion.div>
  );
}
