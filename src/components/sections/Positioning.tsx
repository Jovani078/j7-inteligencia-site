"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function Positioning() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const escalavelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!escalavelRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        escalavelRef.current,
        { xPercent: 40 },
        {
          xPercent: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-graphite px-6 py-32 md:px-14 lg:px-20"
    >
      {/* Abstract connection background — no humanoid robots */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 600">
          <g stroke="#2f80ed" strokeWidth="0.6" opacity="0.5">
            <path d="M0 120 C 300 60, 500 260, 800 140 S 1100 40, 1200 160" fill="none" />
            <path d="M0 320 C 260 420, 560 220, 820 380 S 1080 480, 1200 360" fill="none" />
            <path d="M0 480 C 320 520, 600 380, 900 500 S 1100 560, 1200 500" fill="none" />
          </g>
          <g fill="#2f80ed">
            <circle cx="150" cy="105" r="2.5" />
            <circle cx="500" cy="230" r="2" />
            <circle cx="820" cy="150" r="2.5" />
            <circle cx="1080" cy="90" r="2" />
            <circle cx="260" cy="400" r="2" />
            <circle cx="600" cy="260" r="2.5" />
            <circle cx="960" cy="440" r="2" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-3xl font-bold leading-tight text-porcelain md:text-5xl">
          IA NÃO SUBSTITUI UMA EMPRESA BEM GERIDA.
          <br />
          ELA TORNA ESSA EMPRESA MAIS RÁPIDA, INTELIGENTE E
        </h2>
      </div>

      <div ref={escalavelRef} className="relative z-10 mt-4 w-max whitespace-nowrap md:mt-0">
        <span className="font-display text-[16vw] font-bold uppercase leading-none tracking-tight text-electric">
          ESCALÁVEL.
        </span>
      </div>
    </section>
  );
}
