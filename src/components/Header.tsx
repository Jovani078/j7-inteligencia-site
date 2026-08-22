"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { usePreload } from "@/lib/preload-context";
import { WHATSAPP_LINK } from "@/lib/constants";
import { lenisHandle, headerOffset } from "@/lib/lenis";

const NAV_LINKS = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Resultados", href: "#resultados" },
  { label: "Sobre", href: "#sobre" },
  { label: "Diagnóstico", href: "#diagnostico" },
];

export default function Header() {
  const { ready } = usePreload();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu enters last, after Hero's own headline/CTA/side-indicator sequence
  // has finished — see Hero.tsx's timeline for the durations this delay
  // needs to clear (~2.6s at reduced-motion-off, now that the video is
  // part of the same fade group).
  useEffect(() => {
    if (!ready || !headerRef.current) return;
    if (prefersReducedMotion()) {
      gsap.set(headerRef.current, { y: 0, opacity: 1 });
      return;
    }
    // gsap.fromTo() only applies the "from" state once the tween actually
    // starts playing — with a delay, that means the header sits fully
    // visible at its final position for the entire delay window first
    // (a well-known GSAP gotcha). Setting the hidden state explicitly and
    // upfront avoids that flash/overlap with the badge below it.
    gsap.set(headerRef.current, { y: -40, opacity: 0 });
    gsap.to(headerRef.current, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 2.6 });
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
  }, [menuOpen]);

  // Route anchor-link clicks through Lenis so the jump is smooth and stays
  // in sync with its virtual scroll position, instead of the browser's
  // native instant hash jump (which desyncs Lenis until its next tick).
  // Falls back to the native jump when Lenis doesn't exist (reduced motion).
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const lenis = lenisHandle.current;
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(href, { offset: -headerOffset(), duration: 0.8 });
  };

  return (
    <header
      ref={headerRef}
      // Starts hidden via plain CSS opacity (not JS) so there's no window —
      // however brief — where it renders fully visible before an effect
      // gets a chance to hide it. That window is exactly what let it flash
      // on top of the badge while still racing the preloader's own
      // fade-out. (The y-slide is GSAP-only, via `transform` — a static
      // Tailwind `translate-y` class here would use the separate CSS
      // `translate` property and never get cleared by GSAP's `transform`,
      // leaving the header permanently offset.) GSAP's delayed reveal
      // below overrides the opacity via an inline style.
      className={`fixed top-0 left-0 right-0 z-50 opacity-0 transition-colors duration-500 ${
        scrolled ? "bg-ink/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="flex items-center gap-2.5"
        >
          <span className="relative h-9 w-9 shrink-0">
            <Image src="/j7-icon.png" alt="J7 Inteligência" fill sizes="36px" priority />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-porcelain">
            J7 <span className="text-electric">Inteligência</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group relative font-heading text-sm text-porcelain/85 transition-colors hover:text-porcelain"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-electric transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span
            className={`block h-px w-7 bg-porcelain transition-transform duration-300 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-7 bg-porcelain transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-7 bg-porcelain transition-transform duration-300 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-ink transition-all duration-500 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              setMenuOpen(false);
              handleNavClick(e, link.href);
            }}
            className="font-display text-3xl font-bold text-porcelain transition-transform"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {link.label}
          </a>
        ))}
        <MagneticButton href={WHATSAPP_LINK} variant="whatsapp" external className="mt-4">
          Falar com um especialista
        </MagneticButton>
      </div>
    </header>
  );
}
