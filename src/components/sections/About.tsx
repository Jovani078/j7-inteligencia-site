import Image from "next/image";

const FACTS = [
  "Mais de 3 anos no mercado digital",
  "Experiência prática em atendimento, vendas e operação",
  "Implementações personalizadas para cada empresa",
];

export default function About() {
  return (
    <section id="sobre" className="bg-bg px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        <div className="relative mx-auto aspect-[1093/1380] w-full max-w-sm">
          <Image
            src="/jovani-charao.png"
            alt="Jovani Charão, fundador da J7 Inteligência"
            fill
            sizes="(min-width: 768px) 384px, 320px"
            className="object-contain object-bottom"
            priority
          />
        </div>

        <div>
          <h2 className="h-headline">Tecnologia aplicada à rotina de quem empreende.</h2>

          <div className="body-text mt-8 flex flex-col gap-4">
            <p>
              Sou <strong className="font-semibold text-ink">Jovani Charão</strong>, fundador da
              J7 Inteligência.
            </p>
            <p>
              Antes de trabalhar com tecnologia, passei mais de quatro anos atuando diretamente
              com refrigeração na construção civil. Conheci de perto a realidade de quem precisa
              atender clientes, enviar orçamentos, executar o serviço e ainda encontrar tempo para
              vender.
            </p>
            <p>
              Essa experiência mudou minha forma de olhar para negócios: muitas empresas não
              precisam apenas de mais divulgação, precisam de uma operação de atendimento mais
              organizada.
            </p>
            <p>
              Hoje aplico inteligência artificial e automação para ajudar empresas a organizarem o
              atendimento e a implementação da própria operação.
            </p>
          </div>

          <ul className="mt-8 flex flex-col gap-3">
            {FACTS.map((item) => (
              <li key={item} className="body-text flex items-start gap-2 border-l-2 border-accent pl-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}