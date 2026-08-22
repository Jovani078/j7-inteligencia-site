"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { usePreload } from "@/lib/preload-context";
import { montserrat } from "@/lib/fonts";

// Cinematic loading gate shown before the hero. The big bold counter is the
// whole show — duration/easing are tuned below in one gsap.timeline so
// timing can be adjusted in one place. On completion it hands off to
// Hero/Header via usePreload().setReady() instead of an abrupt
// display:none swap.
export default function Preloader() {
  const { setReady } = usePreload();
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineWrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Keeps the progress bar's width matched to the counter's rendered width
  // (stable now that digits are zero-padded to 3 chars, but this also
  // covers the clamp()'s viewport-driven resizing) — purely visual, no
  // effect on the animation timeline below.
  useEffect(() => {
    if (!counterWrapRef.current || !lineWrapRef.current) return;
    const counterEl = counterWrapRef.current;
    const lineEl = lineWrapRef.current;
    const sync = () => {
      lineEl.style.width = `${counterEl.offsetWidth}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(counterEl);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReady(true);
      setVisible(false);
      return;
    }
    if (!rootRef.current) return;

    document.body.classList.add("no-scroll");

    const ctx = gsap.context(() => {
      const counterObj = { val: 0 };
      gsap.set(counterWrapRef.current, { opacity: 0, y: 18 });
      gsap.set(lineRef.current, { scaleX: 0 });

      // Subtle continuous pulse on the number itself — the "chamando
      // atenção" beat. The completion punch below overrides it once the
      // count finishes (same property, gsap's default overwrite handles
      // the handoff), and it's explicitly killed in onComplete either way.
      const pulse = gsap.to(counterWrapRef.current, {
        scale: 1.035,
        duration: 0.55,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          pulse.kill();
          document.body.classList.remove("no-scroll");
          setVisible(false);
        },
      });

      tl.to(counterWrapRef.current, { opacity: 1, y: 0, duration: 0.4 })
        .to(
          counterObj,
          {
            val: 100,
            duration: 2.3,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(counterObj.val)).padStart(
                  3,
                  "0",
                );
              }
            },
          },
          "<0.1",
        )
        .to(lineRef.current, { scaleX: 1, duration: 2.3, ease: "power1.inOut" }, "<")
        .addLabel("reveal")
        // flip ready here so Hero's clip-path opens underneath while the
        // punch + fade below is still covering the screen — reads as one
        // continuous motion instead of a hard cut.
        .call(() => setReady(true), undefined, "reveal")
        .to(counterWrapRef.current, { scale: 1.18, duration: 0.25, ease: "power3.out" }, "reveal")
        .to(rootRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" }, "reveal+=0.12");
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.classList.remove("no-scroll");
    };
  }, [setReady]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-6">
        <div ref={counterWrapRef} className={`preloader-counter ${montserrat.variable}`}>
          <span ref={counterRef} className="preloader-digits">
            000
          </span>
          <span className="preloader-percent">%</span>
        </div>
        <div ref={lineWrapRef} className="h-px overflow-hidden bg-porcelain/15">
          <div
            ref={lineRef}
            className="h-full origin-left bg-electric"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
