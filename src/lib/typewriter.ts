"use client";

import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

// Scroll-scrubbed letter-by-letter reveal (typewriter effect), reversible by
// construction since it just reads `self.progress` on every scroll tick
// rather than playing a one-shot tween. A blinking cursor tracks the
// boundary character's real on-screen position (via getBoundingClientRect)
// so it follows correctly across line wraps instead of sitting in a fixed
// spot. `wrap` must be `position: relative` and contain both `textEl` (the
// paragraph to split) and `cursorEl` (a `.typewriter-cursor` span) as
// siblings — see CrmProduct.tsx for the reference markup.
export function attachTypewriter(
  wrap: HTMLElement,
  textEl: HTMLElement,
  cursorEl: HTMLElement,
  opts?: { start?: string; end?: string }
) {
  // "chars" alone lets the browser insert a line break between any two
  // character spans, including mid-word (e.g. "isso" splitting into
  // "iss"/"o") — adding the "words" level wraps each word in its own
  // inline-block box so the browser only ever breaks between words, same
  // as normal text, while individual chars are still addressable below.
  const split = SplitText.create(textEl, { type: "chars, words" });
  const chars = split.chars as HTMLElement[];
  gsap.set(chars, { opacity: 0 });
  cursorEl.classList.add("is-active");
  gsap.set(cursorEl, { opacity: 1 });

  const positionCursor = (revealCount: number) => {
    const idx = Math.min(Math.max(revealCount, 0), chars.length - 1);
    const target = chars[idx];
    if (!target) return;
    const wrapRect = wrap.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const atStart = revealCount <= 0;
    gsap.set(cursorEl, {
      x: (atStart ? rect.left : rect.right) - wrapRect.left,
      y: rect.top - wrapRect.top,
      height: rect.height,
    });
  };
  positionCursor(0);

  ScrollTrigger.create({
    trigger: wrap,
    start: opts?.start ?? "top 80%",
    end: opts?.end ?? "bottom 55%",
    scrub: true,
    onUpdate: (self) => {
      const revealCount = Math.round(self.progress * chars.length);
      chars.forEach((c, i) => {
        c.style.opacity = i < revealCount ? "1" : "0";
      });
      positionCursor(revealCount);
    },
  });
}
