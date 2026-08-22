"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Entendemos como sua empresa vende, atende e acompanha oportunidades.",
  },
  {
    n: "02",
    title: "Estratégia",
    desc: "Definimos quais processos devem ser automatizados e quais precisam continuar humanos.",
  },
  {
    n: "03",
    title: "Implementação",
    desc: "Construímos os agentes, páginas, integrações e fluxos necessários.",
  },
  {
    n: "04",
    title: "Validação",
    desc: "Testamos cada etapa antes de colocar a estrutura em produção.",
  },
  {
    n: "05",
    title: "Otimização",
    desc: "Analisamos as conversas, corrigimos gargalos e melhoramos a operação.",
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
          { opacity: 0.25, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: step,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
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
    <section
      id="como-funciona"
      className="bg-graphite px-6 py-28 md:px-14 lg:px-20"
    >
      <div className="mx-auto max-w-4xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-electric">
          004 / O processo
        </span>
        <RevealText
          as="h2"
          className="font-heading text-4xl font-bold text-porcelain md:text-5xl"
        >
          Da análise à operação funcionando.
        </RevealText>

        <div ref={containerRef} className="relative mt-20 flex flex-col gap-16 pl-12">
          <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-white/10" />
          <div
            ref={fillRef}
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-electric"
            style={{ transform: "scaleY(0)" }}
          />
          {STEPS.map((step) => (
            <div key={step.n} data-step className="relative">
              <span
                data-dot
                className="absolute -left-[3.15rem] top-1.5 h-3.5 w-3.5 rounded-full border border-white/20 bg-graphite transition-colors duration-500"
              />
              <span className="font-mono text-xs text-porcelain/40">Etapa {step.n}</span>
              <h3 className="mt-2 font-heading text-2xl font-bold text-porcelain md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-2 max-w-lg text-porcelain/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
