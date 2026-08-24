"use client";

import { gsap } from "@/lib/gsap";

// Drives the "lift toward the viewer" hover effect via GSAP + direct style
// writes instead of a CSS `:hover` rule. A CSS `:hover` rule cannot win this
// fight: GSAP's scroll-entrance animations leave an inline `transform` on
// these elements after they finish (e.g. `transform: translate(0px, 0px)`),
// and inline styles always beat a stylesheet selector — including `:hover`
// — for the same property, short of `!important`. Confirmed by inspecting
// the live `style` attribute before/after a real hover: the CSS approach's
// `transform: scale(...)` silently never applied. Routing the hover state
// through the same engine that owns the inline style (GSAP for transform,
// direct `el.style` writes for the rest) sidesteps the conflict entirely.
//
// Gated on `(hover: hover) and (pointer: fine)` so it never attaches on
// touch devices — there's no mouseleave to clear a "stuck" lifted state.
export function attachHoverLift(
  el: HTMLElement,
  opts: {
    scale: number;
    shadowRest: string;
    shadowHover: string;
    zIndexHover: string;
    borderRest?: string;
    borderHover?: string;
    bgRest?: string;
    bgHover?: string;
  }
) {
  if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return () => {};
  }
  const onEnter = () => {
    gsap.to(el, { scale: opts.scale, duration: 0.3, ease: "power2.out" });
    el.style.zIndex = opts.zIndexHover;
    el.style.filter = opts.shadowHover;
    if (opts.borderHover) el.style.borderColor = opts.borderHover;
    if (opts.bgHover) el.style.backgroundColor = opts.bgHover;
  };
  const onLeave = () => {
    gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
    el.style.zIndex = "1";
    el.style.filter = opts.shadowRest;
    if (opts.borderRest) el.style.borderColor = opts.borderRest;
    if (opts.bgRest) el.style.backgroundColor = opts.bgRest;
  };
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  return () => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
  };
}
