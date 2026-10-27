"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";

const MESSAGES = [
  { from: "client", text: "Olá! Gostaria de um orçamento." },
  { from: "ai", text: "Olá! Sou a assistente virtual. Qual serviço você procura?" },
  { from: "client", text: "Instalação de ar-condicionado." },
  { from: "ai", text: "Perfeito! Em qual cidade será o serviço?" },
  { from: "client", text: "Dois Irmãos." },
  {
    from: "ai",
    text: "Obrigada! Vou encaminhar essas informações para a equipe continuar seu orçamento.",
  },
] as const;

const STEPS = [
  { n: "01", label: "Entende a necessidade." },
  { n: "02", label: "Registra as informações." },
  { n: "03", label: "Encaminha para a equipe." },
];

export default function ChatDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const bubbles = bubbleRefs.current.filter(Boolean) as HTMLDivElement[];

    if (prefersReducedMotion() || skipped) {
      gsap.set(bubbles, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bubbles, { opacity: 0, y: 14 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: containerRef.current, start: "top 70%", once: true },
      });
      bubbles.forEach((el) => {
        tl.to(el, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }).to({}, { duration: 0.3 });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [skipped]);

  const handleSkip = () => {
    setSkipped(true);
    const bubbles = bubbleRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(bubbles, { opacity: 1, y: 0 });
  };

  return (
    <section id="demo" className="bg-bg px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <RevealText as="h2" className="h-headline max-w-xl text-ink">
            Da primeira mensagem ao próximo passo.
          </RevealText>
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-semibold text-ink/60 underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Ver conversa completa
          </button>
        </div>

        <div ref={containerRef} className="mt-14 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="rounded-3xl border border-border bg-bg p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                IA
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">J7 Inteligência</p>
                <p className="text-xs text-muted">online agora</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {MESSAGES.map((m, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    bubbleRefs.current[i] = el;
                  }}
                  className={`w-fit max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.from === "ai"
                      ? "rounded-tl-sm border border-border bg-bg text-ink"
                      : "ml-auto rounded-tr-sm bg-ink text-white"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <p className="label-badge mt-4 text-muted/80">
              Exemplo ilustrativo. O atendimento é configurado para cada empresa.
            </p>
          </div>

          <div className="flex flex-col gap-6 pt-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex items-start gap-4">
                <span className="eyebrow-tag shrink-0 text-base font-bold">{s.n}</span>
                <p className="body-text pt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}