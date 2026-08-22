"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";

const STEPS = [
  {
    n: "01",
    label: "Analisamos",
    desc: "sua operação e o caminho real do cliente",
    image: "/images/process-1-analisamos.png",
  },
  {
    n: "02",
    label: "Encontramos",
    desc: "os gargalos que travam o crescimento",
    image: "/images/process-2-encontramos.png",
  },
  {
    n: "03",
    label: "Implementamos",
    desc: "uma estrutura conectada à sua realidade",
    image: "/images/process-3-implementamos.png",
  },
];

export default function SolutionCentral() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-process-card]");

    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.5)",
          stagger: 0.2,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="solucoes" className="bg-ink px-6 py-28 md:px-14 lg:px-20">
      <div className="mx-auto max-w-6xl text-center">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-electric">
          003 / A solução
        </span>
        <RevealText
          as="h2"
          className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-tight text-porcelain md:text-5xl"
        >
          Transformamos processos manuais em uma operação inteligente.
        </RevealText>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-porcelain/65">
          Não entregamos apenas uma ferramenta. Analisamos sua operação, encontramos os gargalos
          e implementamos uma estrutura conectada à realidade da sua empresa.
        </p>

        <div ref={gridRef} className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              data-process-card
              className="relative aspect-[1122/1402] overflow-hidden rounded-2xl border border-electric/20 shadow-2xl shadow-black/50"
            >
              <Image
                src={step.image}
                alt={`${step.n} — ${step.label}: ${step.desc}`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
