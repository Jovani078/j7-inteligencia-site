import RevealText from "@/components/ui/RevealText";
import ProjectCard, { type Project } from "@/components/ui/ProjectCard";
import Carousel from "@/components/ui/Carousel";

// Case-study copy only — no fabricated metrics.
const PROJECTS: Project[] = [
  {
    index: "01",
    category: "Automação",
    title: "Atendimento via WhatsApp com IA",
    description:
      "Fluxo de atendimento automatizado para responder, qualificar e agendar sem intervenção manual.",
    image: "/images/results-whatsapp-ia.png",
  },
  {
    index: "02",
    category: "Site",
    title: "Site institucional de alta conversão",
    description:
      "Presença digital rápida, otimizada para busca e feita para transformar visita em contato.",
    image: "/images/results-site.png",
  },
  {
    index: "03",
    category: "Aquisição",
    title: "Estrutura de captação de clientes",
    description: "Campanhas e funil integrados ao WhatsApp para gerar demanda previsível.",
    image: "/images/results-aquisicao.png",
  },
  {
    index: "04",
    category: "IA aplicada",
    title: "Agente de vendas automatizado",
    description: "IA treinada para conduzir a conversa até o fechamento ou agendamento.",
    image: "/images/results-agente-vendas.png",
  },
  {
    index: "05",
    category: "Presença local",
    title: "Otimização do Google Meu Negócio",
    description: "Perfil, avaliações e SEO local trabalhados para aparecer nas buscas certas.",
    image: "/images/results-google-meu-negocio.png",
  },
  {
    index: "06",
    category: "Operação interna",
    title: "Automação de processos internos",
    description: "Redução de tarefas manuais repetitivas na rotina da equipe.",
    image: "/images/results-operacao-interna.png",
  },
];

export default function Results() {
  return (
    <section id="resultados" className="bg-porcelain py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-14 lg:px-20">
        <span className="eyebrow-tag mb-6 block text-deep-blue">
          007 / Resultados
        </span>
        <RevealText
          as="h2"
          className="h-headline max-w-2xl text-ink"
        >
          Tecnologia só importa quando gera resultado.
        </RevealText>
      </div>

      {/* Cases carousel — 3 visible on desktop, 2 tablet, 1 mobile;
          auto-advances 1 at a time, pauses on hover/touch. */}
      <div className="mx-auto mt-12 max-w-6xl px-6 md:px-14 lg:px-20">
        <Carousel
          ariaLabel="Cases de resultados"
          items={PROJECTS.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        />
      </div>
    </section>
  );
}