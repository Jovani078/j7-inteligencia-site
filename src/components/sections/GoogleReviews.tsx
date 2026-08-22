import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import { GOOGLE_REVIEWS_LINK } from "@/lib/constants";

// TODO: substituir pelos textos reais das 8 avaliações do Google (nome, nota, texto, data)
const REVIEWS = Array.from({ length: 8 }, (_, i) => ({
  name: `[ nome real ${i + 1} ]`,
  rating: 5,
  text: "[ texto real da avaliação do Google a ser inserido aqui ]",
  date: "[ data ]",
}));

export default function GoogleReviews() {
  return (
    <section className="bg-ink px-6 py-28 md:px-14 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-electric">
          008 / Prova social
        </span>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RevealText
            as="h2"
            className="max-w-xl font-heading text-4xl font-bold text-porcelain md:text-5xl"
          >
            Quem trabalha conosco percebe a diferença.
          </RevealText>
          <MagneticButton href={GOOGLE_REVIEWS_LINK} variant="secondary" external>
            Ver avaliações no Google
          </MagneticButton>
        </div>

        <div className="relative mt-20 flex flex-col">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="sticky rounded-3xl border border-white/10 bg-graphite p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
              style={{ top: `${88 + i * 14}px`, marginBottom: "1.25rem" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric/15 font-heading font-bold text-electric">
                    {r.name.replace(/[^\p{L}]/gu, "").slice(0, 1) || "?"}
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-porcelain">{r.name}</p>
                    <p className="text-xs text-porcelain/40">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-electric">{"★".repeat(r.rating)}</span>
                  <svg width="18" height="18" viewBox="0 0 48 48">
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
                </div>
              </div>
              <p className="mt-5 text-porcelain/70">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
