import RevealText from "@/components/ui/RevealText";

const CARDS = [
  {
    title: "Respostas rápidas",
    desc: "Atenda às dúvidas iniciais mesmo fora do horário comercial.",
  },
  {
    title: "Contatos organizados",
    desc: "Reúna informações e histórico para dar continuidade ao atendimento.",
  },
  {
    title: "Retornos no momento certo",
    desc: "Organize os acompanhamentos conforme as regras da sua operação.",
  },
];

export default function Benefits() {
  return (
    <section id="solucao" className="bg-bg px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <RevealText as="h2" className="h-headline max-w-xl whitespace-pre-line text-ink">
          {"O atendimento continua.\nMesmo quando você para."}
        </RevealText>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="hover-lift rounded-2xl border border-border bg-bg p-7 hover:border-accent/40"
            >
              <h3 className="text-lg font-semibold text-ink">{c.title}</h3>
              <p className="body-text mt-3">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}