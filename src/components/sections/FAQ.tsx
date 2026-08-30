"use client";

import { useState } from "react";
import RevealText from "@/components/ui/RevealText";

const FAQS = [
  {
    q: "A IA substitui minha equipe?",
    a: "Não. A implementação deve assumir tarefas repetitivas e organizar oportunidades, permitindo que sua equipe se concentre nas conversas que exigem decisão humana.",
  },
  {
    q: "A solução funciona no meu WhatsApp atual?",
    a: "Isso depende da estrutura utilizada pela empresa. Durante o diagnóstico, analisamos o cenário e indicamos a implementação mais adequada.",
  },
  {
    q: "Quanto tempo leva para implementar?",
    a: "O prazo varia conforme a complexidade, quantidade de integrações e processos envolvidos.",
  },
  {
    q: "Vocês trabalham com qualquer segmento?",
    a: "Atendemos principalmente empresas que recebem contatos pelo WhatsApp e precisam organizar atendimento, aquisição e acompanhamento comercial.",
  },
  {
    q: "É apenas um chatbot?",
    a: "Não. Um chatbot comum responde mensagens. Nossa proposta é criar uma operação integrada com qualificação, organização, acompanhamento e direcionamento de oportunidades.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 text-left"
      >
        <span className="text-lg font-semibold text-white md:text-xl">{q}</span>
        <span
          className={`shrink-0 font-mono text-2xl text-electric transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="body-text mt-4 max-w-2xl text-porcelain/65">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-ink px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow-tag mb-6 block text-electric">
          011 / Perguntas frequentes
        </span>
        <RevealText as="h2" className="h-headline text-white">
          Perguntas frequentes
        </RevealText>

        <div className="mt-10">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
