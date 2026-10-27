import ProjectCard, { type Project } from "@/components/ui/ProjectCard";
import Carousel from "@/components/ui/Carousel";

// Case-study copy only — no fabricated metrics.
const PROJECTS: Project[] = [
  {
    index: "01",
    category: "Automação",
    title: "Atendimento via WhatsApp com IA",
    description:
      "Fluxo de atendimento automatizado para responder, qualificar e encaminhar oportunidades.",
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
    description: "Campanhas e funil integrados ao WhatsApp para organizar a demanda.",
    image: "/images/results-aquisicao.png",
  },
  {
    index: "04",
    category: "IA aplicada",
    title: "Agente de vendas automatizado",
    description: "IA configurada para conduzir a conversa até o encaminhamento comercial.",
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
    <section id="resultados" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="h-headline max-w-2xl">Soluções que colocamos em prática</h2>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6 md:px-10">
        <Carousel
          ariaLabel="Soluções colocadas em prática"
          intervalMs={2800}
          transitionMs={500}
          items={PROJECTS.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        />
      </div>
    </section>
  );
}