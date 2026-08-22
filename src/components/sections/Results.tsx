"use client";

import { useEffect, useRef } from "react";
import RevealText from "@/components/ui/RevealText";
import ProjectCard, { type Project } from "@/components/ui/ProjectCard";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

// Case-study copy only — no fabricated metrics. Swap `result` for real
// numbers once the client provides them; swap ProjectCard's placeholder
// image block for real screenshots the same way.
const PROJECTS: Project[] = [
  {
    index: "01",
    category: "Automação",
    title: "Atendimento via WhatsApp com IA",
    description:
      "Fluxo de atendimento automatizado para responder, qualificar e agendar sem intervenção manual.",
    result: "[ resultado a enviar ]",
  },
  {
    index: "02",
    category: "Site",
    title: "Site institucional de alta conversão",
    description:
      "Presença digital rápida, otimizada para busca e feita para transformar visita em contato.",
    result: "[ resultado a enviar ]",
  },
  {
    index: "03",
    category: "Aquisição",
    title: "Estrutura de captação de clientes",
    description: "Campanhas e funil integrados ao WhatsApp para gerar demanda previsível.",
    result: "[ resultado a enviar ]",
  },
  {
    index: "04",
    category: "IA aplicada",
    title: "Agente de vendas automatizado",
    description: "IA treinada para conduzir a conversa até o fechamento ou agendamento.",
    result: "[ resultado a enviar ]",
  },
  {
    index: "05",
    category: "Presença local",
    title: "Otimização do Google Meu Negócio",
    description: "Perfil, avaliações e SEO local trabalhados para aparecer nas buscas certas.",
    result: "[ resultado a enviar ]",
  },
  {
    index: "06",
    category: "Operação interna",
    title: "Automação de processos internos",
    description: "Redução de tarefas manuais repetitivas na rotina da equipe.",
    result: "[ resultado a enviar ]",
  },
];

export default function Results() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Desktop: pin the gallery and drive the track horizontally from vertical
  // scroll progress (same pinned-ScrollTrigger shape as BeforeAfter.tsx,
  // just animating x instead of clip-path). Mobile: no pin at all — the
  // scroller falls back to a native overflow-x-auto snap row.
  useEffect(() => {
    if (!wrapRef.current) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (prefersReducedMotion() || !trackRef.current || !scrollerRef.current) return;
        const track = trackRef.current;
        const scroller = scrollerRef.current;
        const getDistance = () => track.scrollWidth - scroller.clientWidth;

        const st = ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(track, { x: -self.progress * getDistance() }),
        });

        return () => st.kill();
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="resultados" className="bg-ink py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-14 lg:px-20">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-electric">
          006 / Resultados
        </span>
        <RevealText
          as="h2"
          className="max-w-2xl font-heading text-4xl font-bold text-porcelain md:text-5xl"
        >
          Tecnologia só importa quando gera resultado.
        </RevealText>

        {/* Real case */}
        <div
          className="mt-16 grid gap-10 rounded-3xl border border-white/10 bg-graphite/50 p-8 md:grid-cols-3 md:p-12"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
              Case real
            </span>
            <h3 className="mt-3 font-heading text-2xl font-bold text-porcelain">
              Remoção a laser
            </h3>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-porcelain/40">Desafio</p>
            <p className="mt-2 text-porcelain/75">
              Pouca visibilidade e dependência de indicações.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-porcelain/40">Implementação</p>
            <p className="mt-2 text-porcelain/75">
              Otimização do Google Meu Negócio e estrutura digital.
            </p>
          </div>
          <div className="md:col-span-3 md:border-t md:border-white/10 md:pt-6">
            <p className="text-xs uppercase tracking-wide text-porcelain/40">Resultado</p>
            <p className="mt-2 font-heading text-xl font-semibold text-electric">
              Serviço de aproximadamente R$ 3 mil fechado através da presença local.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal project gallery */}
      <div ref={wrapRef} className="relative mt-16 md:h-[75vh]">
        <div
          ref={scrollerRef}
          className="h-full overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-hidden md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <div
            ref={trackRef}
            className="flex h-full snap-x snap-mandatory gap-6 px-6 md:snap-none md:px-14 lg:px-20"
          >
            {PROJECTS.map((project) => (
              <div key={project.title} className="snap-center md:h-full">
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}