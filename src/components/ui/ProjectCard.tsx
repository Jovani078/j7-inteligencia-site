"use client";

// Project card placeholder — no real photography exists yet for the
// gallery. Swap the `[ imagem a enviar ]` block for a real next/image once
// project photos/screenshots are provided; the reveal/tilt mechanics below
// don't need to change.

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type Project = {
  index: string;
  category: string;
  title: string;
  description: string;
  result: string;
};

export default function ProjectCard({ index, category, title, description, result }: Project) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Cards sit inside a horizontally-translated track (desktop) or a native
  // scroll-snap row (mobile), so a normal viewport ScrollTrigger can't tell
  // reliably when an individual card scrolls into view horizontally. A
  // mount-triggered mask reveal (clip-path, not a fade) keeps the "image
  // reveal" requirement without depending on the parent's pin/track state.
  useEffect(() => {
    if (!imageRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const delay = Number(index) * 0.08;
      // fromTo() only applies the "from" clip once the tween starts
      // playing, so with a delay the image would render fully unclipped
      // first — set it explicitly so the card starts hidden right away.
      gsap.set(imageRef.current, { clipPath: "inset(0 0 100% 0)" });
      gsap.to(imageRef.current, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.9,
        ease: "power3.out",
        delay,
      });
    }, cardRef);
    return () => ctx.revert();
  }, [index]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateX: py * -3,
      rotateY: px * 3,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      data-cursor-text="VER"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="flex h-full w-[78vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-graphite/40 sm:w-[52vw] md:w-[36vw] lg:w-[30vw]"
    >
      <div
        ref={imageRef}
        className="flex aspect-[4/3] items-center justify-center border-b border-white/10 bg-white/[0.03]"
      >
        <span className="text-xs uppercase tracking-wide text-porcelain/30">
          [ imagem a enviar ]
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-electric">
            {category}
          </span>
          <span className="font-mono text-xs text-porcelain/30">{index}</span>
        </div>
        <h3 className="font-heading text-xl font-bold text-porcelain">{title}</h3>
        <p className="text-sm text-porcelain/65">{description}</p>
        <p className="mt-auto text-sm font-semibold text-electric">{result}</p>
      </div>
    </div>
  );
}