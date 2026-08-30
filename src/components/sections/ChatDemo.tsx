"use client";

import { useEffect, useRef, useState } from "react";
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

// When each item flips from "processing" (spinner) to "done" (check), in
// ms. The first item now gets a real ~900ms spin instead of flipping
// instantly, and the ~1s gap between flips makes each step readable
// instead of blurring together.
const RESULT_DELAYS = [900, 1900, 2900, 3900];

export default function ChatDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsWrapRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typingRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [resultsStarted, setResultsStarted] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const bubbles = bubbleRefs.current.filter(Boolean) as HTMLDivElement[];
    const typingBubbles = typingRefs.current.filter(Boolean) as HTMLDivElement[];

    if (prefersReducedMotion()) {
      gsap.set([...bubbles], { opacity: 1, y: 0, scale: 1 });
      gsap.set(typingBubbles, { opacity: 0 });
      setResultsStarted(true);
      setDoneCount(RESULTS.length);
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // "Depois da conversa" checklist — starts its processing→done sequence
  // only once the block scrolls into view (never on page load), via
  // IntersectionObserver, then flips one item at a time on the staggered
  // schedule above.
  useEffect(() => {
    if (!resultsWrapRef.current || prefersReducedMotion()) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setResultsStarted(true);
        RESULT_DELAYS.forEach((delay, i) => {
          timeouts.push(setTimeout(() => setDoneCount(i + 1), delay));
        });
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(resultsWrapRef.current);

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="bg-ink px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <span className="eyebrow-tag mb-6 block text-whatsapp">
          006 / Na prática
        </span>
        <RevealText
          as="h2"
          className="h-headline max-w-2xl text-white"
        >
          Veja como a IA conduz uma conversa real.
        </RevealText>

        <div
          ref={containerRef}
          className="mt-16 grid gap-12 md:grid-cols-2 md:items-start"
        >
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-cover bg-center p-4 shadow-2xl shadow-black/50 md:p-6"
            style={{ backgroundImage: "url('/images/whatsapp-bg.png')" }}
          >
            <div className="relative mb-4 flex items-center gap-3 border-b border-ink/10 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp text-ink font-bold">
                IA
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-ink">J7 Inteligência</p>
                <p className="text-xs text-ink/50">online agora</p>
              </div>
            </div>
            <div className="relative flex flex-col gap-3">
              {MESSAGES.map((m, i) => (
                <div key={i} className={m.from === "ai" ? "relative" : ""}>
                  <div
                    ref={(el) => {
                      bubbleRefs.current[i] = el;
                    }}
                    data-bubble
                    className={`w-fit max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      m.from === "ai"
                        ? "rounded-tl-sm bg-white text-ink"
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
                      className="absolute left-0 top-0 flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-sm"
                      aria-hidden="true"
                    >
                      <span className="typing-dot typing-dot--dark" />
                      <span className="typing-dot typing-dot--dark" />
                      <span className="typing-dot typing-dot--dark" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div ref={resultsWrapRef} data-results-wrap className="flex flex-col justify-center gap-5 pt-4">
            <span className="eyebrow-tag text-electric">
              Resultado em tempo real
            </span>
            <p className="-mt-2 text-lg font-semibold text-white">
              Enquanto vocês dormem, isso já aconteceu:
            </p>

            {RESULTS.map((r, i) => {
              const isDone = i < doneCount;
              const isProcessing = resultsStarted && !isDone;
              return (
                <div
                  key={r}
                  data-result
                  className={`flex items-center gap-3 rounded-xl border px-5 py-4 transition-colors duration-300 ${
                    isDone ? "border-electric/25 bg-graphite/40" : "border-white/10 bg-graphite/20"
                  }`}
                >
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                    {isDone ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                        className="check-pop"
                      >
                        <circle cx="9" cy="9" r="8.3" stroke="#2f80ed" />
                        <path d="M5 9.5l2.5 2.5L13 6.5" stroke="#2f80ed" strokeWidth="1.4" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                        className={isProcessing ? "checklist-spin" : ""}
                      >
                        <circle cx="9" cy="9" r="8.3" stroke="#2f80ed" strokeOpacity="0.25" />
                        <path
                          d="M9 0.7a8.3 8.3 0 0 1 8.3 8.3"
                          stroke="#2f80ed"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`body-text font-medium transition-colors duration-300 ${
                      isDone ? "text-white" : "text-porcelain/40"
                    }`}
                  >
                    {r}
                  </span>
                </div>
              );
            })}

            {doneCount === RESULTS.length && (
              <div className="mt-1">
                <span className="label-badge checklist-badge-pulse inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-4 py-1.5 font-bold text-electric-light">
                  Processado em 4 segundos
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
