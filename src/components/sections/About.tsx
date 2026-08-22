import Image from "next/image";
import RevealText from "@/components/ui/RevealText";

const AUTHORITY = [
  "Mais de 3 anos no mercado digital",
  "Mais de R$ 320 mil gerados com a agência em apenas um ano",
  "Mais de R$ 30 mil investidos em mentorias, cursos e network com quem já está no mercado",
  "Experiência prática em atendimento, vendas e operação",
  "Implementações personalizadas para empresas",
];

export default function About() {
  return (
    <section id="sobre" className="bg-graphite px-6 py-28 md:px-14 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        <div className="relative mx-auto aspect-[1093/1380] w-full max-w-sm">
          <div
            className="absolute inset-0 -z-10 scale-90 rounded-full bg-electric/20 blur-3xl"
            aria-hidden="true"
          />
          <Image
            src="/jovani-charao.png"
            alt="Jovani Charão, fundador da J7 Inteligência"
            fill
            sizes="(min-width: 768px) 384px, 320px"
            className="object-contain object-bottom drop-shadow-2xl"
            priority
          />
        </div>

        <div>
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-electric">
            007 / Quem está por trás
          </span>
          <RevealText
            as="h2"
            className="font-heading text-3xl font-bold text-porcelain md:text-4xl"
          >
            Estratégia de quem conhece o atendimento do lado de dentro.
          </RevealText>

          <div className="mt-8 flex flex-col gap-4 text-porcelain/70">
            <p>
              Sou <strong className="text-porcelain">Jovani Charão</strong>, fundador da J7
              Inteligência.
            </p>
            <p>
              Antes de trabalhar com tecnologia e estratégia digital, passei mais de quatro anos
              atuando diretamente com refrigeração de construção civil. Conheci de perto a
              realidade de quem precisa atender clientes, enviar orçamentos, executar o serviço e
              ainda encontrar tempo para vender.
            </p>
            <p>
              A transição para o digital mudou minha visão sobre negócios. Percebi que muitas
              empresas não precisam apenas de mais divulgação — precisam de processos melhores
              para transformar oportunidades em vendas.
            </p>
            <p>
              Hoje, aplico inteligência artificial, automação e aquisição de clientes para ajudar
              negócios a crescerem com uma operação mais organizada, rápida e inteligente.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {AUTHORITY.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 border-l-2 border-electric/50 pl-3 text-sm text-porcelain/70"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
