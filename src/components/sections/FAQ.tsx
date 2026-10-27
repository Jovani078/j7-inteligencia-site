"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "A IA substitui minha equipe?",
    a: "Não. A proposta é assumir tarefas repetitivas e organizar oportunidades, para que sua equipe se concentre nas conversas que exigem decisão humana.",
  },
  {
    q: "Funciona no meu WhatsApp atual?",
    a: "Depende da estrutura utilizada pela sua empresa. Isso é avaliado durante o diagnóstico, que indica a implementação mais adequada ao seu caso.",
  },
  {
    q: "Como a IA aprende sobre minha empresa?",
    a: "As instruções e os fluxos de conversa são configurados a partir das informações, serviços e regras específicas da sua operação, levantadas no diagnóstico.",
  },
  {
    q: "Quando o atendimento passa para uma pessoa?",
    a: "Conforme as regras definidas para o seu negócio — geralmente quando a conversa exige uma decisão, uma negociação ou sai do escopo configurado.",
  },
  {
    q: "Quanto tempo leva a implementação?",
    a: "O prazo é definido após o diagnóstico, conforme a complexidade, as integrações e o escopo contratado — não há um prazo fixo aplicável a todos os casos.",
  },
  {
    q: "O que está incluído no acompanhamento?",
    a: "Ajustes no atendimento conforme o uso real, conforme o escopo contratado em cada etapa do projeto.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border py-6">
      <h3>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-6 text-left"
        >
          <span className="text-lg font-semibold text-ink">{q}</span>
          <span
            aria-hidden="true"
            className={`shrink-0 font-mono text-2xl text-accent transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="body-text mt-4 max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-bg px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="h-headline">Perguntas frequentes</h2>

        <div className="mt-10">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}