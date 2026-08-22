"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const HOVER_ATTR = "data-cursor-text";

// Discrete custom cursor: a lagging outer ring + a tight-following dot.
// Only mounts on fine-pointer/hover-capable devices, never on touch, and
// never when the user prefers reduced motion.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(canHover && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled || !ringRef.current || !dotRef.current) return;

    const moveRing = gsap.quickTo(ringRef.current, "x", { duration: 0.35, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ringRef.current, "y", { duration: 0.35, ease: "power3.out" });
    const moveDot = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      moveRing(e.clientX);
      moveRingY(e.clientY);
      moveDot(e.clientX);
      moveDotY(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(`[${HOVER_ATTR}]`);
      if (!target || !ringRef.current) return;
      const text = target.getAttribute(HOVER_ATTR) ?? "";
      if (labelRef.current) labelRef.current.textContent = text;
      gsap.to(ringRef.current, { scale: 2.6, duration: 0.3, ease: "power2.out" });
      gsap.to(labelRef.current, { opacity: 1, duration: 0.2 });
    };

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(`[${HOVER_ATTR}]`);
      if (!target || !ringRef.current) return;
      gsap.to(ringRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(labelRef.current, { opacity: 0, duration: 0.15 });
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none fixed top-0 left-0 z-[70] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[70] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-porcelain/50"
        aria-hidden="true"
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-porcelain opacity-0"
        />
      </div>
    </>
  );
}