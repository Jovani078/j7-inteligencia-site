"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { lenisHandle } from "@/lib/lenis";

const RADIUS = 27;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const FLIP_THRESHOLD = 0.92;

function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("main > section, footer"));
}

export default function ScrollProgress() {
  const valueRef = useRef<SVGCircleElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const flippedRef = useRef(false);

  useEffect(() => {
    if (!valueRef.current) return;
    const setOffset = gsap.quickSetter(valueRef.current, "strokeDashoffset", "px") as (v: number) => void;

    const applyProgress = (rawProgress: number) => {
      const p = Math.min(Math.max(rawProgress, 0), 1);
      setOffset(CIRCUMFERENCE * (1 - p));
      const shouldFlip = p >= FLIP_THRESHOLD;
      if (shouldFlip !== flippedRef.current) {
        flippedRef.current = shouldFlip;
        gsap.to(arrowRef.current, {
          rotation: shouldFlip ? 180 : 0,
          duration: 0.25,
          ease: "power2.out",
          transformOrigin: "50% 50%",
        });
      }
    };

    if (prefersReducedMotion()) {
      const onScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        applyProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Lenis mounts in a sibling provider within the same tick, but isn't
    // guaranteed to exist on this component's very first effect run — poll
    // a couple of frames until lenisHandle is populated, then subscribe.
    let unsub: (() => void) | null = null;
    let raf = requestAnimationFrame(function waitForLenis() {
      const lenis = lenisHandle.current;
      if (!lenis) {
        raf = requestAnimationFrame(waitForLenis);
        return;
      }
      applyProgress(lenis.progress);
      unsub = lenis.on("scroll", (l) => applyProgress(l.progress));
    });

    return () => {
      cancelAnimationFrame(raf);
      unsub?.();
    };
  }, []);

  const handleClick = () => {
    const lenis = lenisHandle.current;
    const reduced = prefersReducedMotion();

    if (flippedRef.current) {
      if (lenis) lenis.scrollTo(0, { duration: 0.9 });
      else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      return;
    }

    const sections = getSections();
    const currentY = window.scrollY + 4;
    const next = sections.find((el) => el.getBoundingClientRect().top + window.scrollY > currentY);
    if (!next) return;

    if (lenis) lenis.scrollTo(next, { duration: 0.9 });
    else next.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="scroll-progress">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={RADIUS} className="progress-track" />
        <circle
          ref={valueRef}
          cx="32"
          cy="32"
          r={RADIUS}
          className="progress-value"
          style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE }}
        />
      </svg>
      <button onClick={handleClick} aria-label="Rolar para a próxima seção" className="progress-button">
        <svg
          ref={arrowRef}
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v16M6 14l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
