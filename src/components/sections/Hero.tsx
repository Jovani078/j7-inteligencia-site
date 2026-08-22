"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroCanvas from "@/components/HeroCanvas";
import { usePreload } from "@/lib/preload-context";
import { montserrat } from "@/lib/fonts";
import { WHATSAPP_LINK } from "@/lib/constants";

// Headline now flows as a single paragraph (see JSX below) — text lives
// directly in the markup so specific words can be wrapped in a colored
// span, instead of being built from line constants.
const SUBHEADLINE =
  "Você investe para o cliente chegar até você. Mas se ele chama no WhatsApp e demora para ser atendido, a venda pode ir direto para o concorrente. A J7 estrutura atendimento, IA e automação para você responder, qualificar e conduzir cada oportunidade com mais velocidade e organização.";
// Giant translucent word layered between the canvas and the foreground text.
// Swap these strings to change the background typographic element.
const BACKGROUND_WORD_LINE_1 = "INTELIGÊNCIA";
const BACKGROUND_WORD_LINE_2 = "ARTIFICIAL";

// Official Google "G" mark (4-color icon only, no wordmark — avoids any
// font-licensing concern) used next to the review line to signal it's a
// real Google rating.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="#4285F4" d="M22.1 12.2c0-.7-.06-1.4-.18-2.1H12v4h5.66a4.85 4.85 0 0 1-2.1 3.2v2.6h3.4c2-1.83 3.14-4.53 3.14-7.7Z" />
      <path fill="#34A853" d="M12 22c2.83 0 5.2-.93 6.96-2.53l-3.4-2.6c-.94.63-2.15 1-3.56 1-2.73 0-5.05-1.84-5.88-4.32H2.62v2.68A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.12 13.55A6 6 0 0 1 5.8 12c0-.54.1-1.06.32-1.55V7.77H2.62A10 10 0 0 0 1.6 12c0 1.6.38 3.1 1.02 4.23l3.5-2.68Z" />
      <path fill="#EA4335" d="M12 5.98c1.54 0 2.92.53 4 1.56l3-3C17.2 2.7 14.83 1.8 12 1.8a10 10 0 0 0-9.38 5.97l3.5 2.68C6.95 7.8 9.27 5.98 12 5.98Z" />
    </svg>
  );
}

export default function Hero() {
  const { ready } = usePreload();
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const bgWordRef = useRef<HTMLDivElement>(null);
  const bgWordScrollRef = useRef<HTMLDivElement>(null);
  const bgWordFloatRef = useRef<HTMLDivElement>(null);
  const scrollDotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);

  // Entrance sequence — gated on the preloader handing off control, not on
  // mount, so the timeline can't play underneath/behind the preloader.
  // Order: background word -> headline (SplitText) -> description -> CTAs
  // -> side technical indicators (menu itself is timed from Header.tsx).
  useEffect(() => {
    if (!ready || !sectionRef.current || !circleRef.current || !textRef.current) return;

    const rest = textRef.current.querySelectorAll("[data-hero-fade]");

    const ctx = gsap.context(() => {
      // The preloader already performed the circular-reveal transition —
      // just open the clip instantly so a second wipe doesn't play here.
      gsap.set(circleRef.current, { clipPath: "circle(150% at 50% 50%)" });

      if (prefersReducedMotion()) {
        gsap.set(bgWordRef.current, { opacity: 1, xPercent: 0 });
        gsap.set(rest, { y: 0, opacity: 1 });
        return;
      }

      const split = SplitText.create(headlineRef.current, { type: "words", mask: "words" });
      const words = split.words;

      gsap.set(bgWordRef.current, { opacity: 0, xPercent: -18 });
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set(rest, { y: 24, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(bgWordRef.current, { opacity: 1, xPercent: 0, duration: 1.3 })
        .to(words, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.035 }, "-=0.9")
        .to(rest, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Scroll-pinned parallax fade-out (desktop only — see below). The
  // clip-path reveal is no longer driven by scroll (handled above once, at
  // preload handoff) — this only fades/lifts the text as the hero scrolls
  // past. On mobile the headline's minimum size (per spec) can make the
  // fold taller than one screen, so the section grows naturally instead of
  // being pinned — see the `min-h-screen md:h-screen` swap on the section.
  useEffect(() => {
    if (!sectionRef.current || !textRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=70%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            gsap.set(textRef.current, {
              opacity: Math.max(0, 1 - self.progress * 3.2),
              y: -self.progress * 80,
            });
          },
        });
        return () => st.kill();
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Giant background word: continuous ambient float (independent of scroll)
  // on its own inner layer, so it never fights the scroll-driven layer or
  // the entrance animation on bgWordRef above — three separate transforms,
  // three separate elements.
  useEffect(() => {
    if (!bgWordFloatRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(bgWordFloatRef.current, { x: -4, y: -8, rotation: -0.2 });
      gsap.to(bgWordFloatRef.current, {
        x: 4,
        y: 8,
        rotation: 0.2,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Giant background word: subtle upward drift as the hero scrolls through
  // view, on its own layer (see above). Independent ScrollTrigger, not the
  // hero's pin — works the same whether or not the pin is active.
  useEffect(() => {
    if (!sectionRef.current || !bgWordScrollRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          gsap.set(bgWordScrollRef.current, { y: -40 * self.progress });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll indicator: a small dot falling and fading inside the ring, then
  // resetting — the classic, unambiguous "scroll" cue.
  useEffect(() => {
    if (!scrollDotRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(scrollDotRef.current, { y: 0, opacity: 1 });
      gsap.to(scrollDotRef.current, {
        y: 14,
        opacity: 0,
        duration: 1.3,
        ease: "power1.in",
        repeat: -1,
        repeatDelay: 0.35,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ink"
    >
      <div
        ref={circleRef}
        className="absolute inset-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <HeroCanvas progress={progressRef} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      {/* Ambient giant word — kept for continuity with the rest of the
          scroll-driven layers below, but now sits behind the full-bleed
          video (z-0 vs the video's z-[1]) and is no longer visible; left
          in place rather than deleted since it wasn't part of this pass. */}
      <div
        ref={bgWordRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden select-none"
      >
        <div ref={bgWordScrollRef} className="w-full">
          <div ref={bgWordFloatRef} className="w-full">
            <span className="hero-bg-word -translate-x-[6%] block font-display font-extrabold whitespace-nowrap uppercase">
              <span className="block">{BACKGROUND_WORD_LINE_1}</span>
              <span className="block">{BACKGROUND_WORD_LINE_2}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Full-bleed background video — replaces the previous right-docked
          panel. Poster omitted: no still frame was available to generate
          one from (no ffmpeg in this environment) — the clip is small
          (1.2MB) and starts playing quickly, but a poster would remove any
          first-paint gap if one gets added later. */}
      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{
            objectPosition: "center",
            filter: "contrast(1.05) saturate(0.92) brightness(0.9)",
          }}
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* Directional overlay — stronger over the text side, softer toward
          the right, keeps the video visible while guaranteeing contrast. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,14,20,0.92) 0%, rgba(10,14,20,0.55) 45%, rgba(10,14,20,0.75) 100%)",
        }}
      />

      <div
        ref={textRef}
        className={`relative z-10 flex h-full flex-col items-center justify-center px-6 pt-28 text-center md:pt-32 ${montserrat.variable}`}
      >
        <div className="mx-auto w-full max-w-3xl md:max-w-[78%] lg:max-w-4xl">
          <h1 ref={headlineRef} className="fold-headline break-words text-center text-porcelain">
            Seu cliente chega <span className="text-electric">pronto pra comprar</span>. Sua
            demora no <span className="text-electric">WhatsApp</span> faz ele comprar do{" "}
            <span className="text-electric">concorrente</span>.
          </h1>

          <div className="fold-copy">
            <p
              data-hero-fade
              className="mx-auto mt-5 max-w-xl text-sm text-porcelain/75 md:mt-6 md:text-base"
            >
              {SUBHEADLINE}
            </p>

            <div data-hero-fade className="mt-6 flex flex-wrap justify-center gap-4 md:mt-8">
              <MagneticButton
                href={WHATSAPP_LINK}
                variant="primary"
                external
                className="hero-cta-pulse"
              >
                QUERO PARAR DE PERDER CLIENTE PRA CONCORRÊNCIA
              </MagneticButton>
            </div>
          </div>

          <div
            data-hero-fade
            className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-porcelain/60"
          >
            <span className="flex items-center gap-2">
              <GoogleIcon />
              <span style={{ color: "#FBBC04" }}>★★★★★</span> 5,0 no Google
            </span>
            <span>8 avaliações reais</span>
            <span>Atendimento para empresas em todo o Brasil</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <div className="group flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-porcelain/50">
            Rolar
          </span>
          <div className="relative flex h-9 w-5 items-start justify-center rounded-full border border-porcelain/25 pt-2 transition-all duration-300 group-hover:border-electric/50 group-hover:shadow-[0_0_14px_rgba(47,128,237,0.3)]">
            <div ref={scrollDotRef} className="h-1.5 w-1.5 rounded-full bg-electric-light" />
          </div>
        </div>
      </div>
    </section>
  );
}