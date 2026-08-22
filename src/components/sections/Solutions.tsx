"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { WHATSAPP_LINK } from "@/lib/constants";

const SLIDES = [
  {
    n: "01",
    title: "IA para WhatsApp",
    desc: "Atenda, qualifique e acompanhe oportunidades automaticamente.",
    items: [
      "Atendimento imediato",
      "Respostas personalizadas",
      "Qualificação de contatos",
      "Agendamento",
      "Follow-up automático",
      "Transferência para atendente humano",
    ],
    cta: "Automatizar meu atendimento",
    image: "/images/ia-atendimento-mockup.png",
  },
  {
    n: "02",
    title: "Sites inteligentes",
    desc: "Um site criado para transformar visitas em conversas e oportunidades.",
    items: [
      "Posicionamento profissional",
      "Estrutura para conversão",
      "Integração com WhatsApp",
      "Formulários inteligentes",
      "Carregamento rápido",
      "Otimização para celular e Google",
    ],
    cta: "Quero um site profissional",
    image: "/images/site-laptop-mockup.webp",
  },
  {
    n: "03",
    title: "Aquisição de clientes",
    desc: "Colocamos sua empresa diante de quem já está procurando uma solução.",
    items: ["Atrair", "Capturar", "Qualificar", "Acompanhar", "Converter"],
    cta: "Quero atrair novos clientes",
    image: "/images/aquisicao-funil.webp",
  },
  {
    n: "04",
    title: "Automações empresariais",
    desc: "Elimine tarefas repetitivas e conecte toda a operação.",
    items: [
      "CRM",
      "Integrações",
      "Relatórios automáticos",
      "Disparos e follow-ups",
      "Organização de contatos",
      "Fluxos personalizados",
    ],
    cta: "Conhecer as automações",
    image: "/images/automacao-fluxo.webp",
  },
] as const;

// Time budget (arbitrary GSAP units, scrubbed against scroll — only the
// ratios matter): 1 to fade in centered (chegada), a hold, 1 to settle into
// the split layout (acomodação), a longer hold to read, 1 to slide out.
const STEP = 3.6;

// One background tone per lamina — subtle blue-black variations within the
// existing ink/graphite range, not new brand colors.
const LAMINA_BG = ["#050505", "#080d17", "#0a1220", "#050608"];

export default function Solutions() {
  const pinRef = useRef<HTMLDivElement>(null);
  const laminaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!pinRef.current) return;

    if (prefersReducedMotion()) {
      laminaRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
      descRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, xPercent: 0 }));
      imageRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop — pinned "digital menu": each slide arrives centered, settles
      // into a split text/image layout, then slides out for the next one.
      mm.add("(min-width: 768px)", () => {
        laminaRefs.current.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0, xPercent: 0 }));
        descRefs.current.forEach((el) =>
          el && gsap.set(el, { top: "50%", left: "50%", xPercent: -50, yPercent: -50, opacity: 0 })
        );
        imageRefs.current.forEach((el) =>
          el && gsap.set(el, { top: "50%", right: "8%", yPercent: -50, y: -560, opacity: 0 })
        );
        gsap.set(pinRef.current, { backgroundColor: LAMINA_BG[0] });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: "+=4800",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        SLIDES.forEach((_, i) => {
          const base = i * STEP;
          const desc = descRefs.current[i];
          const image = imageRefs.current[i];
          const lamina = laminaRefs.current[i];

          // Chegada — centered fade-in.
          if (i > 0) tl.set(lamina, { opacity: 1 }, base);
          tl.fromTo(desc, { opacity: 0 }, { opacity: 1, duration: 1 }, base);

          // Acomodação — description slides left, image descends into place,
          // together, in the same scroll window.
          tl.to(desc, { left: "6%", xPercent: 0, duration: 1 }, base + 1.2);
          tl.to(image, { y: 0, opacity: 1, duration: 1 }, base + 1.2);

          // Troca — current lamina slides out, next one is already fading
          // in centered per its own "chegada" step above. The section
          // background shifts to the next lamina's tone in the same window.
          if (i < SLIDES.length - 1) {
            tl.to(lamina, { xPercent: -12, opacity: 0, duration: 1 }, base + 2.6);
            tl.to(pinRef.current, { backgroundColor: LAMINA_BG[i + 1], duration: 1 }, base + 2.6);
          }
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      // Mobile — no pin (4 slides pinned + horizontal-feeling swaps would
      // trap scroll for too long on a small screen). Falls back to the
      // 4 slides stacked in normal document flow, each fading up on enter.
      mm.add("(max-width: 767px)", () => {
        const triggers: ScrollTrigger[] = [];
        laminaRefs.current.forEach((lamina, i) => {
          if (!lamina) return;
          const desc = descRefs.current[i];
          const image = imageRefs.current[i];
          const targets = [desc, image].filter(Boolean) as HTMLElement[];
          const tween = gsap.fromTo(
            targets,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: { trigger: lamina, start: "top 78%", toggleActions: "play none none reverse" },
            }
          );
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        });
        return () => triggers.forEach((t) => t.kill());
      });
    }, pinRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="solucoes" ref={pinRef} className="relative bg-ink md:h-screen md:overflow-hidden">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.n}
            ref={(el) => {
              laminaRefs.current[i] = el;
            }}
            className="relative mb-20 px-6 py-20 last:mb-0 md:absolute md:inset-0 md:mb-0 md:px-14 md:py-0 lg:px-20"
          >
            <div
              ref={(el) => {
                descRefs.current[i] = el;
              }}
              className="relative max-w-md md:absolute"
            >
              <span className="font-mono text-sm text-electric">{slide.n}</span>
              <h3 className="mt-3 font-heading text-3xl font-bold text-porcelain md:text-4xl">{slide.title}</h3>
              <p className="mt-4 max-w-md text-lg text-porcelain/65">{slide.desc}</p>
              <ul className="mt-8 flex flex-col gap-3">
                {slide.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-porcelain/80">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <MagneticButton href={WHATSAPP_LINK} variant="primary" external>
                  {slide.cta}
                </MagneticButton>
              </div>
            </div>

            <div
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className="relative mx-auto mt-10 h-[320px] w-full max-w-sm md:absolute md:mt-0 md:h-[420px] md:w-[380px]"
            >
              <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-electric/15 blur-3xl" />
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-graphite shadow-2xl shadow-black/50">
                <Image src={slide.image} alt={slide.title} fill sizes="380px" className="object-contain" />
              </div>
            </div>
          </div>
        ))}
      </section>
  );
}
