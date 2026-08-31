"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type CarouselProps = {
  items: React.ReactNode[];
  ariaLabel: string;
  intervalMs?: number;
  transitionMs?: number;
};

// Max cards ever visible at once (desktop breakpoint below) — this many
// items get cloned onto the end of the track so there's always something
// to slide into before the loop resets.
const MAX_VISIBLE = 3;

export default function Carousel({ items, ariaLabel, intervalMs = 4000, transitionMs = 600 }: CarouselProps) {
  const count = items.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  const clones = items.slice(0, Math.min(MAX_VISIBLE, count));
  const extended = [...items, ...clones];

  // Measures actual rendered card width + gap (not a hardcoded breakpoint
  // percentage) so the slide distance stays correct at any viewport width.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      if (!track || !first) return;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0");
      setStep(first.getBoundingClientRect().width + gap);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [count]);

  useEffect(() => {
    if (reduced || paused || count <= MAX_VISIBLE) return;
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [reduced, paused, intervalMs, count]);

  // Re-arm the transition on the frame after an instant (no-transition)
  // loop reset, so the next advance animates again.
  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const handleTransitionEnd = () => {
    if (index >= count) {
      setAnimate(false);
      setIndex(0);
    }
  };

  const pause = () => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };
  const resumeAfterDelay = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 3000);
  };
  const goTo = (i: number) => {
    setAnimate(true);
    setIndex(i);
    pause();
    resumeAfterDelay();
  };

  // Real mouse movement, not onMouseEnter — Chrome fires a synthetic
  // mouseenter on scroll when the element under a *stationary* cursor
  // changes, which was pausing the carousel the instant it scrolled into
  // view (no genuine hover intent, no matching mouseleave to undo it).
  // Mousemove only fires from actual cursor motion, so this can't trigger
  // from scrolling alone.
  const handleMouseMove = () => {
    pause();
    resumeAfterDelay();
  };

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={resumeAfterDelay}
      onTouchStart={pause}
      onTouchEnd={resumeAfterDelay}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6"
          style={{
            transform: `translateX(-${index * step}px)`,
            transition: animate && !reduced ? `transform ${transitionMs}ms ease` : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((item, i) => (
            <div key={i} className="w-full shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              {item}
            </div>
          ))}
        </div>
      </div>

      {count > MAX_VISIBLE && (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o item ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index % count === i ? "w-6 bg-electric" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
