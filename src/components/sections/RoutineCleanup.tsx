"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";

const ITEMS = [
  "Responder a mesma pergunta pela 20ª vez no dia",
  "Copiar informação de uma conversa pra uma planilha",
  "Lembrar manualmente quem ainda não recebeu retorno",
  "Buscar histórico de cliente espalhado em conversas antigas",
  "Repetir o mesmo texto de orçamento em cada novo contato",
  "Anotar pedido em caderno, agenda ou papel avulso",
];

export default function RoutineCleanup() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-routine-item]");

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-ink px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <span className="eyebrow-tag mb-6 block text-electric">
          003.5 / O que sai da sua rotina
        </span>
        <RevealText
          as="h2"
          className="h-headline max-w-2xl text-white"
        >
          O que sai da sua rotina quando a J7 assume.
        </RevealText>
        <p className="texto-apoio mt-6 max-w-2xl text-porcelain/65">
          Não é só o WhatsApp. É toda tarefa repetitiva que consome tempo do seu time todo dia —
          e que ninguém decidiu automatizar porque &ldquo;sempre foi assim&rdquo;.
        </p>

        <ul ref={listRef} className="mt-14 grid gap-4 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <li
              key={item}
              data-routine-item
              className="body-text flex items-start gap-3 rounded-2xl border border-white/10 bg-graphite/50 p-5 text-porcelain/75 transition-colors duration-300 hover:border-electric/50 hover:bg-electric/10 hover:text-porcelain"
            >
              <span aria-hidden="true" className="text-electric">→</span> {item}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-14 max-w-2xl text-center text-lg font-semibold text-white">
          Cada um desses pontos vira um processo automatizado dentro do{" "}
          <span className="text-electric">J7 CRM</span> — não fica solto, fica registrado,
          rastreável e sob controle.
        </p>
      </div>
    </section>
  );
}
