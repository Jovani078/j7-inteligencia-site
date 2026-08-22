"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import clsx from "clsx";

type RevealTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  splitBy?: "word" | "line";
  start?: string;
  delay?: number;
};

export default function RevealText({
  children,
  as: Tag = "h2",
  className,
  start = "top 85%",
  delay = 0,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll(".reveal-word");

    if (prefersReducedMotion()) {
      gsap.set(words, { y: 0, opacity: 1 });
      return;
    }

    gsap.set(words, { y: "110%", opacity: 0 });

    const ctx = gsap.context(() => {
      gsap.to(words, {
        y: "0%",
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.045,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [start, delay]);

  const words = children.split(" ");

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={clsx(className)}>
      {words.map((word, i) => (
        <span className="reveal-line" key={i} style={{ paddingBottom: "0.08em" }}>
          <span className="reveal-word">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
