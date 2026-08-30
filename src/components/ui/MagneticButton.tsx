"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import clsx from "clsx";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "whatsapp";
  className?: string;
  external?: boolean;
};

const variants = {
  primary:
    "bg-electric text-porcelain hover:bg-electric-strong hover:shadow-[0_0_20px_rgba(47,128,237,0.35)]",
  secondary:
    "bg-transparent text-ink border border-ink/20 hover:border-electric-strong hover:text-electric-strong",
  whatsapp: "bg-whatsapp text-ink hover:brightness-110",
};

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
  external,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion() || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, {
      x: x * 0.35,
      y: y * 0.5,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  const content = (
    <a
      ref={btnRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={clsx(
        "magnetic-btn inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.06em] transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {children}
    </a>
  );

  return content;
}
