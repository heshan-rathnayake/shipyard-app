"use client";

import { motion } from "framer-motion";

/**
 * Thin motion.div wrapper that fades-up once when it enters the viewport.
 * Accepts className so it can replace any plain div — grid/flex children stay
 * correctly positioned in the layout because motion.div is still a div.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.52, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
