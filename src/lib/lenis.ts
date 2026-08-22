"use client";

import type Lenis from "lenis";

// Module-level handle so non-provider code (header nav smoothing, the
// scroll-progress indicator) can reach the single Lenis instance
// imperatively, without React context/re-renders. Named `lenisHandle` (not
// `lenisRef`) to avoid shadowing SmoothScrollProvider's own local `useRef`.
export const lenisHandle: { current: Lenis | null } = { current: null };

export const LENIS_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

// Fixed header's real rendered height, used as a scroll-offset so anchored
// sections don't land partially hidden underneath it.
export const headerOffset = () => document.querySelector("header")?.offsetHeight ?? 76;
