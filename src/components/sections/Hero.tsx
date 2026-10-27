"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Simple fade/slide-in on mount — no preloader gating, no letter-by-letter
  // typewriter. Content is plain DOM text at all times; this only animates
  // it once the component mounts.
  useEffect(() => {
    if (!textRef.current || !imageRef.current) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = textRef.current!.querySelectorAll("[data-hero-fade]");
      gsap.set(items, { y: 16, opacity: 0 });
      gsap.set(imageRef.current, { y: 20, opacity: 0 });
      gsap.to(items, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" });
      gsap.to(imageRef.current, { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: "power2.out" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" className="relative overflow-hidden bg-bg px-6 pt-32 pb-16 md:px-14 md:pt-40 md:pb-20 lg:px-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-10">
        <div ref={textRef} className="order-2 md:order-1">
          <h1
            data-hero-fade
            className="h-headline whitespace-pre-line text-ink"
            style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)" }}
          >
            {"Seu cliente chama.\nSua IA atende."}
            <span className="accent-dot" aria-hidden="true" />
          </h1>

          <p data-hero-fade className="texto-apoio mt-6 max-w-md">
            Agentes de IA para responder no WhatsApp, entender o que o cliente precisa e organizar
            oportunidades para sua equipe.
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              Quero ver funcionando
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-ink/75 underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Conversar com a J7
            </a>
          </div>

          <p data-hero-fade className="body-text mt-6 text-sm">
            Atendimento automatizado com acompanhamento humano.
          </p>
        </div>

        <div ref={imageRef} className="order-1 md:order-2">
          <div className="relative mx-auto aspect-[1194/900] w-full max-w-[560px]">
            <Image
              src="/images/hero-iphones-laranja.png"
              alt="Dois iPhones exibindo uma conversa de atendimento por IA no WhatsApp"
              fill
              priority
              sizes="(min-width: 768px) 560px, 90vw"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}