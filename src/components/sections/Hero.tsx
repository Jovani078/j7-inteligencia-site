"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroCanvas from "@/components/HeroCanvas";
import { usePreload } from "@/lib/preload-context";
import { montserrat } from "@/lib/fonts";
import { WHATSAPP_LINK } from "@/lib/constants";

// Headline: 2 sentences, first white, second electric (see JSX below).
const HEADLINE_LINE_1 = "SEU CLIENTE CHEGA PRONTO PRA COMPRAR.";
const HEADLINE_LINE_2 = "SUA DEMORA PRA RESPONDER NO WHATSAPP FAZ ELE COMPRAR DO CONCORRENTE.";
const SUBHEADLINE =
  "Você investe para o cliente chegar até você. Mas se ele chama no WhatsApp e demora para ser atendido, a venda pode ir direto para o concorrente. A J7 estrutura atendimento, IA e automação para você responder, qualificar e conduzir cada oportunidade com mais velocidade e organização.";
// Giant translucent word layered between the canvas and the foreground text.
// Swap these strings to change the background typographic element.
const BACKGROUND_WORD_LINE_1 = "INTELIGÊNCIA";
const BACKGROUND_WORD_LINE_2 = "ARTIFICIAL";

export default function Hero() {
  const { ready } = usePreload();
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const bgWordRef = useRef<HTMLDivElement>(null);
  const bgWordScrollRef = useRef<HTMLDivElement>(null);
  const bgWordFloatRef = useRef<HTMLDivElement>(null);
  const scrollDotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);

  // Entrance sequence — gated on the preloader handing off control, not on
  // mount, so the timeline can't play underneath/behind the preloader.
  // Order: background word -> headline (SplitText) -> description -> CTAs
  // -> side technical indicators (menu itself is timed from Header.tsx).
  useEffect(() => {
    if (!ready || !sectionRef.current || !circleRef.current || !textRef.current) return;

    const rest = textRef.current.querySelectorAll("[data-hero-fade]");
    const sideEls = sideRef.current
      ? sideRef.current.querySelectorAll("[data-hero-side]")
      : [];

    const ctx = gsap.context(() => {
      // The preloader already performed the circular-reveal transition —
      // just open the clip instantly so a second wipe doesn't play here.
      gsap.set(circleRef.current, { clipPath: "circle(150% at 50% 50%)" });

      if (prefersReducedMotion()) {
        gsap.set(bgWordRef.current, { opacity: 1, xPercent: 0 });
        gsap.set(rest, { y: 0, opacity: 1 });
        gsap.set(sideEls, { opacity: 1, x: 0 });
        return;
      }

      const splits = [line1Ref, line2Ref].map((ref) =>
        SplitText.create(ref.current, { type: "words", mask: "words" }),
      );
      const words = splits.flatMap((split) => split.words);

      gsap.set(bgWordRef.current, { opacity: 0, xPercent: -18 });
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set(rest, { y: 24, opacity: 0 });
      gsap.set(sideEls, { opacity: 0, x: 12 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(bgWordRef.current, { opacity: 1, xPercent: 0, duration: 1.3 })
        .to(words, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.035 }, "-=0.9")
        .to(rest, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, "-=0.5")
        .to(sideEls, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, "-=0.3");
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
      className="relative min-h-screen w-full overflow-hidden bg-ink md:h-screen"
    >
      <div
        ref={circleRef}
        className="absolute inset-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <HeroCanvas progress={progressRef} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

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

      <div
        ref={textRef}
        className={`relative z-10 flex flex-col justify-start pt-32 pb-16 md:h-full md:justify-[safe_center] md:pt-24 md:pb-16 ${montserrat.variable}`}
      >
        {/* Left column, part 1: badge + headline. Kept in normal flow on
            mobile (video sits below it, see next block); on desktop it's
            capped to ~46% width so it never runs under the video. */}
        <div className="relative z-10 px-6 md:max-w-[50%] md:px-14 lg:max-w-[47%] lg:px-20">
          <h1 className="fold-headline break-words text-porcelain">
            <span ref={line1Ref} className="block">
              {HEADLINE_LINE_1}
            </span>
            <span ref={line2Ref} className="block text-electric">
              {HEADLINE_LINE_2}
            </span>
          </h1>
        </div>

        {/* Left column, part 2: impact line, subheadline, CTAs. On mobile
            this now comes before the video (badge/headline -> copy/CTA ->
            video), matching the requested mobile reading order; on desktop
            it's irrelevant since the video is absolutely positioned. */}
        <div className="relative z-10 px-6 md:max-w-[50%] md:px-14 lg:max-w-[47%] lg:px-20">
          <div className="fold-copy">
            <p data-hero-fade className="mt-5 max-w-xl text-sm text-porcelain/75 md:mt-6 md:text-base">
              {SUBHEADLINE}
            </p>

            <div data-hero-fade className="mt-6 flex flex-wrap gap-4 md:mt-8">
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
            className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-porcelain/60"
          >
            <span className="flex items-center gap-2">
              <span className="text-electric">★★★★★</span> 5,0 no Google
            </span>
            <span>8 avaliações reais</span>
            <span>Atendimento para empresas em todo o Brasil</span>
          </div>
        </div>

        {/* Hero video — normal flow after the copy/CTA on mobile,
            absolutely docked to the right 55% on desktop (md:). Its edges
            fade into the background via mask-image instead of a hard crop;
            see .hero-video-fade-h / -v in globals.css. Sits below the
            headline/copy in stacking (z-0) so text always wins on overlap,
            and is pointer-events-none so it never blocks CTA clicks. */}
        <div
          data-hero-fade
          className="pointer-events-none relative z-0 mt-8 h-[42svh] w-full md:absolute md:top-0 md:right-0 md:mt-0 md:h-full md:w-[55%]"
        >
          <div className="hero-video-fade-h h-full w-full">
            <div className="hero-video-fade-v h-full w-full">
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
                aria-hidden="true"
              />
            </div>
          </div>
          {/* Cinematographic overlay — separate from the mask, paints a
              color wash on top of the video so it reads as part of the
              page background rather than a pasted-in clip. */}
          <div className="hero-video-overlay-h pointer-events-none absolute inset-0" />
          <div className="hero-video-overlay-v pointer-events-none absolute inset-0" />
        </div>
      </div>

      <div
        ref={sideRef}
        className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
        aria-hidden="true"
      >
        <div
          data-hero-side
          className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 font-mono text-[10px] uppercase tracking-[0.3em] text-porcelain/40"
        >
          J7 Inteligência
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