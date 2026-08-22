"use client";

import { useEffect, useRef } from "react";
import Counter, { CounterHandle } from "@/components/ui/Counter";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const STATS = [
  { value: 160, prefix: "+", suffix: " mil", label: "Gerados com operações digitais" },
  { value: 24, suffix: "/7", label: "Possibilidade de atendimento automatizado" },
  { value: 3, prefix: "+", suffix: " anos", label: "Atuando com estratégia e tecnologia" },
  { value: 5, decimals: 1, decimalComma: true, label: "Avaliação no Google" },
  { value: 8, label: "Avaliações de clientes" },
];

export default function Counters() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(CounterHandle | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ring1Ref = useRef<SVGSVGElement>(null);
  const ring2Ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (prefersReducedMotion()) {
      counterRefs.current.forEach((c) => c?.setProgress(1));
      return;
    }

    const ctx = gsap.context(() => {
      // Ambient ring rotation — independent of scroll/pin, just gives the
      // flat brand-color background some life while it sits still.
      if (ring1Ref.current) {
        gsap.to(ring1Ref.current, { rotation: 360, repeat: -1, duration: 26, ease: "none", transformOrigin: "50% 50%" });
      }
      if (ring2Ref.current) {
        gsap.to(ring2Ref.current, { rotation: -360, repeat: -1, duration: 34, ease: "none", transformOrigin: "50% 50%" });
      }

      const mm = gsap.matchMedia();

      // Desktop — section pins for a fixed scroll distance; the counters
      // count up in lockstep with scroll (scrub), and pulse once counting
      // finishes near the end of the pin range.
      mm.add("(min-width: 768px)", () => {
        let pulsed = false;
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=900",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Count finishes at 85% of the pin's scroll distance, not 100%.
            // Real scrolling (momentum, trackpad/wheel step sizes) almost
            // never lands on the exact literal pixel end of a trigger, so
            // mapping the full 0→1 count directly to raw progress meant it
            // would visibly stop a digit short (e.g. 24 landing on 23,
            // 5,0 landing on 4,8) whenever the user's scroll settled at,
            // say, 96% instead of 100%. Finishing early gives a buffer so
            // the exact final value is reliably reached and then held.
            const countP = Math.min(self.progress / 0.85, 1);
            counterRefs.current.forEach((c) => c?.setProgress(countP));
            if (countP >= 1 && !pulsed) {
              pulsed = true;
              counterRefs.current.forEach((c) => c?.pulse());
            } else if (countP < 1) {
              pulsed = false;
            }
          },
        });
        return () => trigger.kill();
      });

      // Mobile — no pin (avoids trapping scroll on small screens). Each
      // counter still counts up individually as it enters the viewport,
      // matching the original per-item behavior, just driven through the
      // same imperative API used by the desktop pin.
      mm.add("(max-width: 767px)", () => {
        const tweens = itemRefs.current.map((item, i) => {
          if (!item) return null;
          const obj = { p: 0 };
          return gsap.to(obj, {
            p: 1,
            duration: 2,
            ease: "power1.out",
            scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none reverse" },
            onUpdate: () => counterRefs.current[i]?.setProgress(obj.p),
            onComplete: () => counterRefs.current[i]?.pulse(),
          });
        });
        return () => tweens.forEach((t) => t?.kill());
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-electric px-6 py-24 md:px-14 lg:px-20"
    >
      {/* Soft blend at each edge so the jump into/out of this section's bold
          brand-blue reads as a transition, not a hard cut — the only color
          break on the page bold enough to actually need one. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-32"
        style={{ background: "linear-gradient(to bottom, #0b3d91, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32"
        style={{ background: "linear-gradient(to top, #11151b, transparent)" }}
      />
      <svg
        ref={ring1Ref}
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-20 md:h-96 md:w-96"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="#050505" strokeWidth="0.75" strokeDasharray="4 6" />
      </svg>
      <svg
        ref={ring2Ref}
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 opacity-15 md:h-[28rem] md:w-[28rem]"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="#050505" strokeWidth="0.75" strokeDasharray="2 5" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-5">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex flex-col items-start"
          >
            <Counter
              ref={(el) => {
                counterRefs.current[i] = el;
              }}
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              decimals={s.decimals}
              decimalComma={s.decimalComma}
              external
              className="font-mono text-4xl font-bold text-ink md:text-5xl lg:text-6xl"
            />
            <span className="mt-3 max-w-[14ch] text-sm font-medium uppercase tracking-wide text-ink/70">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
