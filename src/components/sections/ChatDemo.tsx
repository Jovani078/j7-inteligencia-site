"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";

const MESSAGES = [
  { from: "client", text: "Olá, gostaria de saber mais sobre o serviço." },
  {
    from: "ai",
    text: "Olá! Para eu direcionar você corretamente, qual solução está procurando?",
  },
  { from: "client", text: "Quero conseguir mais clientes e organizar o atendimento." },
  {
    from: "ai",
    text: "Entendi. Hoje seus contatos chegam principalmente pelo WhatsApp, Instagram ou anúncios?",
  },
] as const;

const RESULTS = ["Lead qualificado", "Necessidade identificada", "Dados registrados", "Equipe comercial notificada"];

export default function ChatDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const bubbles = bubbleRefs.current.filter(Boolean) as HTMLDivElement[];
    const typingBubbles = typingRefs.current.filter(Boolean) as HTMLDivElement[];
    const results = containerRef.current.querySelectorAll("[data-result]");

    if (prefersReducedMotion()) {
      gsap.set([...bubbles, ...results], { opacity: 1, y: 0, scale: 1 });
      gsap.set(typingBubbles, { opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bubbles, { opacity: 0, y: 20, scale: 0.96 });
      gsap.set(typingBubbles, { opacity: 0, y: 20, scale: 0.96 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          once: true,
        },
      });

      MESSAGES.forEach((m, i) => {
        const bubbleEl = bubbleRefs.current[i];
        if (!bubbleEl) return;

        if (m.from === "ai") {
          const typingEl = typingRefs.current[i];
          tl.to(typingEl, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" })
            .to({}, { duration: 0.9 })
            .to(typingEl, { opacity: 0, duration: 0.2 })
            .to(bubbleEl, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }, "<")
            .to({}, { duration: 0.2 });
        } else {
          tl.to(bubbleEl, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }).to(
            {},
            { duration: 0.25 }
          );
        }
      });

      gsap.fromTo(
        results,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: results[0]?.closest("[data-results-wrap]") ?? containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-ink px-6 py-28 md:px-14 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-whatsapp">
          005 / Na prática
        </span>
        <RevealText
          as="h2"
          className="max-w-2xl font-heading text-4xl font-bold text-porcelain md:text-5xl"
        >
          Veja como a IA conduz uma conversa real.
        </RevealText>

        <div
          ref={containerRef}
          className="mt-16 grid gap-12 md:grid-cols-2 md:items-start"
        >
          <div className="rounded-3xl border border-white/10 bg-graphite/60 p-4 md:p-6">
            <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp text-ink font-bold">
                IA
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-porcelain">J7 Inteligência</p>
                <p className="text-xs text-porcelain/50">online agora</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {MESSAGES.map((m, i) => (
                <div key={i} className={m.from === "ai" ? "relative" : ""}>
                  <div
                    ref={(el) => {
                      bubbleRefs.current[i] = el;
                    }}
                    data-bubble
                    className={`w-fit max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.from === "ai"
                        ? "rounded-tl-sm bg-white/10 text-porcelain"
                        : "ml-auto rounded-tr-sm bg-whatsapp text-ink"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.from === "ai" && (
                    <div
                      ref={(el) => {
                        typingRefs.current[i] = el;
                      }}
                      className="absolute left-0 top-0 flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3.5"
                      aria-hidden="true"
                    >
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div data-results-wrap className="flex flex-col justify-center gap-5 pt-4">
            <p className="text-sm uppercase tracking-[0.2em] text-porcelain/40">
              Depois da conversa
            </p>
            {RESULTS.map((r) => (
              <div
                key={r}
                data-result
                className="flex items-center gap-3 rounded-xl border border-electric/25 bg-graphite/40 px-5 py-4"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8.3" stroke="#2f80ed" />
                  <path d="M5 9.5l2.5 2.5L13 6.5" stroke="#2f80ed" strokeWidth="1.4" />
                </svg>
                <span className="font-heading font-medium text-porcelain">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
