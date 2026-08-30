"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type MarqueeProps = {
  items: string[];
  highlight?: string;
  className?: string;
  textClassName?: string;
};

export default function Marquee({
  items,
  highlight,
  className,
  textClassName,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const renderItems = (key: string) =>
    items.map((item, i) => (
      <span
        key={`${key}-${i}`}
        className={
          "marquee-pulse shrink-0 px-6 " +
          (item === highlight ? "text-electric" : "marquee-text")
        }
        style={{ animationDelay: `${(i % 6) * 0.15}s` }}
      >
        {item}
      </span>
    ));

  useEffect(() => {
    if (!trackRef.current || !wrapRef.current) return;
    const track = trackRef.current;

    if (prefersReducedMotion()) return;

    const baseSpeed = 0.6;
    let direction = -1;
    let xPos = 0;

    const ctx = gsap.context(() => {
      gsap.ticker.add(tick);

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          direction = self.direction === 1 ? -1 : 1;
        },
      });

      // Base color is white; turns blue once the marquee's center crosses
      // the viewport's center, reverts on the way back up (same
      // reversible-on-scroll pattern as the rest of the site).
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "center center",
        onEnter: () => wrapRef.current?.style.setProperty("--marquee-color", "#2f80ed"),
        onLeaveBack: () => wrapRef.current?.style.setProperty("--marquee-color", "#ffffff"),
      });
    });

    function tick() {
      xPos += baseSpeed * direction;
      const trackWidth = track.scrollWidth / 2;
      if (xPos <= -trackWidth) xPos = 0;
      if (xPos > 0) xPos = -trackWidth;
      gsap.set(track, { x: xPos });
    }

    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={trackRef} className="marquee-track">
        <div className={"flex " + (textClassName ?? "")}>{renderItems("a")}</div>
        <div className={"flex " + (textClassName ?? "")}>{renderItems("b")}</div>
      </div>
    </div>
  );
}
