"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type Project = {
  index: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

export default function ProjectCard({ index, category, title, description, image }: Project) {
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
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]"
    >
      <div
        ref={imageRef}
        className="relative aspect-[4/3] overflow-hidden border-b border-ink/10 bg-ink/[0.03]"
      >
        <Image
          src={image}
          alt={`${category} — ${title}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="label-badge text-deep-blue">
            {category}
          </span>
          <span className="label-badge text-ink/30">{index}</span>
        </div>
        <h3 className="text-xl font-extrabold text-ink">{title}</h3>
        <p className="body-text mt-auto text-ink/65">{description}</p>
      </div>
    </div>
  );
}