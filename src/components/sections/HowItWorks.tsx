"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Entendemos como chegam os contatos e onde o atendimento trava.",
  },
  {
    n: "02",
    title: "Configuração",
    desc: "Adaptamos as instruções e os fluxos ao seu negócio.",
  },
  {
    n: "03",
    title: "Validação",
    desc: "Testamos as conversas e os encaminhamentos antes de ativar.",
  },
  {
    n: "04",
    title: "Acompanhamento",
    desc: "Ajustamos o atendimento conforme o uso e o escopo contratado.",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const steps = containerRef.current.querySelectorAll("[data-step]");

    if (prefersReducedMotion()) {
      gsap.set(steps, { opacity: 1 });
      if (fillRef.current) gsap.set(fillRef.current, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 30%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      }

      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0.3, x: -16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            scrollTrigger: { trigger: step, start: "top 65%", toggleActions: "play none none reverse" },
          }
        );

        const dot = step.querySelector("[data-dot]");
        if (dot) {
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            toggleClass: { targets: dot, className: "dot-active" },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="como-funciona" className="bg-bg px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <RevealText as="h2" className="h-headline text-ink">
          Da sua rotina à operação funcionando.
        </RevealText>

        <div ref={containerRef} className="relative mt-16 flex flex-col gap-14 pl-12">
          <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border" />
          <div
            ref={fillRef}
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-accent"
            style={{ transform: "scaleY(0)" }}
          />
          {STEPS.map((step) => (
            <div key={step.n} data-step className="relative">
              <span
                data-dot
                className="absolute -left-[3.15rem] top-1.5 h-3.5 w-3.5 rounded-full border border-border bg-bg transition-colors duration-500 [&.dot-active]:border-accent [&.dot-active]:bg-accent"
              />
              <span className="label-badge text-muted">Etapa {step.n}</span>
              <h3 className="mt-2 text-xl font-bold text-ink md:text-2xl">{step.title}</h3>
              <p className="body-text mt-2 max-w-lg">{step.desc}</p>
            </div>
          ))}
        </div>

        <p className="body-text mt-12 max-w-xl">
          O prazo é definido após o diagnóstico, conforme as integrações e o escopo.
        </p>
      </div>
    </section>
  );
}