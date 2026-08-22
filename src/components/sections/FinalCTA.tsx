"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import RevealText from "@/components/ui/RevealText";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink px-6 py-40 md:px-14"
    >
      {/*
        TODO: trocar o fundo abaixo por <video autoPlay muted loop playsInline> com o vídeo
        em câmera lenta enviado pelo usuário, mantendo a ref bgRef para o efeito de zoom.
      */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(47,128,237,0.18), transparent 55%), radial-gradient(circle at 75% 80%, rgba(17,21,27,0.8), transparent 60%), #050505",
        }}
      />
      <div className="absolute inset-0 bg-ink/50" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <RevealText
          as="h2"
          className="font-display text-4xl font-bold leading-[1.05] text-porcelain md:text-6xl"
        >
          SE SUA DEMANDA CRESCER 3X AMANHÃ, SUA EMPRESA ESTÁ PREPARADA?
        </RevealText>
        <p className="mx-auto mt-6 max-w-xl text-lg text-porcelain/65">
          Estruture agora a operação que vai sustentar o próximo nível do seu negócio.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <MagneticButton href="#diagnostico" variant="primary">
            Quero preparar minha empresa
          </MagneticButton>
          <MagneticButton href={WHATSAPP_LINK} variant="whatsapp" external>
            Falar pelo WhatsApp
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
