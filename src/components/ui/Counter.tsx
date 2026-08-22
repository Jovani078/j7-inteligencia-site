"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type CounterHandle = {
  setProgress: (t: number) => void;
  pulse: () => void;
};

type CounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  decimalComma?: boolean;
  className?: string;
  // When true, this instance does not create its own ScrollTrigger — a
  // parent drives it imperatively via the forwarded ref (used by Counters.tsx
  // to sync all five counters to a single pinned/scrubbed timeline).
  external?: boolean;
};

const Counter = forwardRef<CounterHandle, CounterProps>(function Counter(
  { value, decimals = 0, prefix = "", suffix = "", decimalComma = false, className, external = false },
  ref
) {
  const spanRef = useRef<HTMLSpanElement>(null);

  const format = (v: number) => {
    const s = v.toFixed(decimals);
    return decimalComma ? s.replace(".", ",") : s;
  };

  const pulse = () => {
    if (!spanRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      spanRef.current,
      { scale: 1 },
      { scale: 1.08, duration: 0.22, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "left center" }
    );
    gsap.fromTo(
      spanRef.current,
      { filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" },
      {
        filter: "drop-shadow(0 0 16px rgba(255,255,255,0.65))",
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      }
    );
  };

  useImperativeHandle(ref, () => ({
    setProgress: (t: number) => {
      if (!spanRef.current) return;
      const v = value * Math.min(Math.max(t, 0), 1);
      spanRef.current.textContent = `${prefix}${format(v)}${suffix}`;
    },
    pulse,
  }));

  useEffect(() => {
    if (external) return;
    if (!spanRef.current) return;
    const el = spanRef.current;

    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${format(value)}${suffix}`;
      return;
    }

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: value,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          el.textContent = `${prefix}${format(obj.val)}${suffix}`;
        },
        onComplete: pulse,
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, prefix, suffix, decimalComma, external]);

  return (
    <span ref={spanRef} className={className} style={{ display: "inline-block" }}>
      {prefix}
      {format(0)}
      {suffix}
    </span>
  );
});

export default Counter;
