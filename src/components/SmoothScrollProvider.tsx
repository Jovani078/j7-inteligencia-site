"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { lenisHandle, LENIS_EASING } from "@/lib/lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 0.6,
      easing: LENIS_EASING,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.05,
      touchMultiplier: 1,
      infinite: false,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    lenisHandle.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenisHandle.current = null;
      lenis.destroy();
    };
  }, []);

  return <div className="grain">{children}</div>;
}
