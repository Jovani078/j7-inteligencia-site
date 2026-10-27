import Image from "next/image";
import RevealText from "@/components/ui/RevealText";

const BLOCKS = [
  {
    title: "Caixa de entrada",
    desc: "Todas as conversas do WhatsApp organizadas em um só lugar.",
    image: "/images/j7crm-laptop-mockup.png",
  },
  {
    title: "Funil de oportunidades",
    desc: "Veja em que etapa está cada contato, do primeiro contato ao fechamento.",
    image: "/images/j7crm-campanhas-mockup.png",
  },
  {
    title: "Histórico de contatos",
    desc: "Cada conversa anterior disponível para dar continuidade sem perder contexto.",
    image: "/images/j7crm-mobile-mockup.png",
  },
  {
    title: "Acompanhamento comercial",
    desc: "Sua equipe sabe quem precisa de atenção e qual é o próximo passo.",
    image: "/images/j7crm-login-mockup.png",
  },
];

export default function CrmProduct() {
  return (
    <section id="crm" className="bg-bg px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <RevealText as="h2" className="h-headline max-w-xl whitespace-pre-line text-ink">
          {"Você acompanha.\nSua equipe assume quando precisa."}
        </RevealText>
        <p className="texto-apoio mt-6 max-w-2xl">
          Conversas, contatos e oportunidades organizados para sua equipe saber quem precisa de
          atenção e qual é o próximo passo.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {BLOCKS.map((b) => (
            <div key={b.title} className="hover-lift overflow-hidden rounded-2xl border border-border">
              <div className="relative aspect-[16/10] bg-bg">
                <Image
                  src={b.image}
                  alt={`J7 CRM — ${b.title}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-ink">{b.title}</h3>
                <p className="body-text mt-2">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}