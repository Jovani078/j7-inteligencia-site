import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import Carousel from "@/components/ui/Carousel";
import { GOOGLE_REVIEWS_LINK } from "@/lib/constants";

const REVIEWS = [
  {
    name: "Willyam Eduardo Voges",
    rating: 5,
    text: "Ótimo atendimento, sabe treinar bem a IA para solucionar problemas.",
    date: "Há 14 semanas",
  },
  {
    name: "Gabriel Freitas",
    rating: 5,
    text: "o guri é bom tche",
    date: "Há 14 semanas",
  },
  {
    name: "Eduardo Badaró",
    rating: 5,
    text: "Ótimo trabalho recomendo",
    date: "Há 14 semanas",
  },
  {
    name: "Diego Pires",
    rating: 5,
    text: "Honestidade é tudo, manda super bem. Deixou meu atendimento humanizado, nem parece Inteligência artificial.",
    date: "Há 14 semanas",
  },
  {
    name: "Schubert Jonas",
    rating: 5,
    text: "Excelente profissional. Domina o que faz, entrega soluções modernas e está sempre atualizado com as melhores práticas do mercado.",
    date: "Há 14 semanas",
  },
  {
    name: "Alexandre Freitas",
    rating: 5,
    text: "Ótimo atendimento e ótimo trabalho feito por profissionais de qualidade. Indico a qualquer um.",
    date: "Há 38 semanas",
  },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.9 6.6-9.6 6.6-16.7z"
      />
      <path
        fill="#34A853"
        d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.6c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.6-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.6 27.9c-.5-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.3C2.8 16.9 2 20.3 2 24s.8 7.1 2.3 10.1z"
      />
      <path
        fill="#EA4335"
        d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 4.2 30 2 24 2 15.4 2 7.9 6.9 4.3 13.9l7.3 5.7c1.7-5.2 6.5-9.1 12.4-9.1z"
      />
    </svg>
  );
}

function ReviewCard({ name, rating, text, date }: (typeof REVIEWS)[number]) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric/15 font-extrabold text-electric-strong">
            {name.replace(/[^\p{L}]/gu, "").slice(0, 1) || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{name}</p>
            <p className="label-badge text-ink/40">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-deep-blue">{"★".repeat(rating)}</span>
          <GoogleIcon />
        </div>
      </div>
      <p className="body-text mt-5 text-ink/70">{text}</p>
    </div>
  );
}

export default function GoogleReviews() {
  return (
    <section className="bg-porcelain px-6 py-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow-tag mb-6 block text-deep-blue">
          009 / Prova social
        </span>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RevealText
            as="h2"
            className="h-headline max-w-xl text-ink"
          >
            Quem trabalha conosco percebe a diferença.
          </RevealText>
          <MagneticButton href={GOOGLE_REVIEWS_LINK} variant="secondary" external>
            Ver avaliações no Google
          </MagneticButton>
        </div>

        {/* Reviews carousel — 3 visible on desktop, 2 tablet, 1 mobile;
            auto-advances 1 at a time, pauses on hover/touch. */}
        <div className="mt-16">
          <Carousel
            ariaLabel="Avaliações de clientes no Google"
            intervalMs={2200}
            transitionMs={450}
            items={REVIEWS.map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          />
        </div>
      </div>
    </section>
  );
}
