"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";

// Percent of the frame width the "antes" panel + its arrow divider occupy
// in the source photo — the reveal mask starts clipped exactly here, so it
// only ever hides the "depois" half, never eating into "antes".
const START_CLIP = 52;

export default function BeforeAfter() {
  const frameRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const beforeLabelRef = useRef<HTMLSpanElement>(null);
  const afterLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!frameRef.current) return;

    if (prefersReducedMotion()) {
      if (revealRef.current) revealRef.current.style.clipPath = "inset(0 0% 0 0)";
      if (dividerRef.current) gsap.set(dividerRef.current, { opacity: 0 });
      if (afterLabelRef.current) gsap.set(afterLabelRef.current, { opacity: 1 });
      if (beforeLabelRef.current) gsap.set(beforeLabelRef.current, { opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Deliberately short + un-pinned: this is a quick reveal, not a
      // scroll-trapping set piece — resolves within roughly one screen's
      // worth of natural scroll.
      ScrollTrigger.create({
        trigger: frameRef.current,
        start: "top 78%",
        end: "+=650",
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          const clip = START_CLIP * (1 - p);
          const linePos = 100 - clip;
          if (revealRef.current) revealRef.current.style.clipPath = `inset(0 ${clip}% 0 0)`;
          if (dividerRef.current) dividerRef.current.style.left = `${linePos}%`;
          if (beforeLabelRef.current) beforeLabelRef.current.style.opacity = String(Math.max(1 - p * 4, 0));
          if (afterLabelRef.current) {
            afterLabelRef.current.style.opacity = String(Math.min(Math.max((p - 0.45) * 4, 0), 1));
          }
        },
      });
    }, frameRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-graphite px-6 py-28 md:px-14 lg:px-20">
      <div className="mx-auto max-w-5xl text-center">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-porcelain/40">
          004 / Antes e depois
        </span>
        <RevealText
          as="h2"
          className="mx-auto max-w-3xl font-heading text-3xl font-bold text-porcelain md:text-5xl"
        >
          Do caos de conversas soltas pra uma operação organizada.
        </RevealText>
      </div>

      <div
        ref={frameRef}
        className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50"
      >
        <div className="relative aspect-[1920/1080] w-full bg-ink">
          <div
            ref={revealRef}
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${START_CLIP}% 0 0)` }}
          >
            <Image
              src="/images/antes-depois-whatsapp.jpg"
              alt="Antes: conversas soltas e desorganizadas no WhatsApp. Depois: atendimento centralizado, com dados do cliente e respostas rápidas."
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>

          <div
            ref={dividerRef}
            className="pointer-events-none absolute top-0 h-full w-[2px] bg-electric shadow-[0_0_20px_3px_rgba(47,128,237,0.55)]"
            style={{ left: `${100 - START_CLIP}%` }}
          />

          <span
            ref={beforeLabelRef}
            className="pointer-events-none absolute left-[6%] top-[6%] rounded-full border border-white/20 bg-ink/70 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-porcelain/80 backdrop-blur-sm"
          >
            Antes
          </span>
          <span
            ref={afterLabelRef}
            className="pointer-events-none absolute right-[6%] top-[6%] rounded-full border border-electric/40 bg-ink/70 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-electric opacity-0 backdrop-blur-sm"
          >
            Depois
          </span>
        </div>
      </div>
    </section>
  );
}
