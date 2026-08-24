"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { attachHoverLift } from "@/lib/hover-lift";
import { attachTypewriter } from "@/lib/typewriter";
import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import { WHATSAPP_LINK } from "@/lib/constants";

const FEATURES = [
  {
    title: "Dashboard",
    pain: "Você não vê seu negócio de verdade até ver ele num painel só. Conversas, contatos, taxa de conversão, tudo em tempo real — sem precisar perguntar pra ninguém \"como estão as vendas hoje\".",
  },
  {
    title: "Inbox",
    pain: "Toda conversa do WhatsApp, centralizada. Chega de procurar mensagem perdida em conversa de três dias atrás enquanto o cliente espera resposta.",
  },
  {
    title: "Kanban",
    pain: "Cada lead numa etapa visível. Se você não sabe em que fase da venda cada contato está, você não está vendendo — está torcendo.",
  },
  {
    title: "Follow-up",
    pain: "90% das vendas perdidas não são por \"não\". São por silêncio. O sistema lembra de cobrar antes do cliente esfriar.",
  },
  {
    title: "Campanhas",
    pain: "Manda mensagem em massa pra quem precisa, na hora certa, sem parecer spam — porque é segmentado, não é disparo aleatório.",
  },
  {
    title: "Contatos",
    pain: "Histórico completo de cada cliente, sempre à mão. Sem isso, cada atendente começa a conversa do zero, mesmo com quem já é cliente.",
  },
  {
    title: "Configurações",
    pain: "Conecta WhatsApp, IA e as preferências do seu negócio — configurado uma vez, funcionando todo santo dia depois disso.",
  },
];

export default function CrmProduct() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hoverCleanupRef = useRef<(() => void)[]>([]);
  const typewriterRef = useRef<HTMLParagraphElement>(null);
  const typewriterWrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const urgencyTextRef = useRef<HTMLParagraphElement>(null);
  const urgencyWrapRef = useRef<HTMLDivElement>(null);
  const urgencyCursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mainVisual = sectionRef.current!.querySelector("[data-main-visual]");
      if (mainVisual) {
        gsap.fromTo(
          mainVisual,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: mainVisual, start: "top 78%", toggleActions: "play reverse play reverse" },
          }
        );
        hoverCleanupRef.current.push(
          attachHoverLift(mainVisual as HTMLElement, {
            scale: 1.05,
            shadowRest: "none",
            shadowHover: "drop-shadow(0 30px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(47,128,237,0.25))",
            zIndexHover: "30",
          })
        );
      }

      const introEls = sectionRef.current!.querySelectorAll("[data-intro-child]");
      gsap.fromTo(
        introEls,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: introEls[0], start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Typewriter reveal — see src/lib/typewriter.ts for the technique
      // (scrub-driven letter reveal + position-tracking cursor). Reused
      // as-is for both this intro paragraph and the urgency paragraph
      // further down, per the established pattern in PROGRESSO.md.
      if (typewriterRef.current && typewriterWrapRef.current && cursorRef.current) {
        attachTypewriter(typewriterWrapRef.current, typewriterRef.current, cursorRef.current);
      }

      if (urgencyTextRef.current && urgencyWrapRef.current && urgencyCursorRef.current) {
        // Slightly wider scrub window than the intro paragraph — same
        // technique, just paced a touch slower since this is the final,
        // heavier beat right before the CTA (per the optional pacing note).
        attachTypewriter(urgencyWrapRef.current, urgencyTextRef.current, urgencyCursorRef.current, {
          start: "top 85%",
          end: "bottom 35%",
        });
      }

      const cards = sectionRef.current!.querySelectorAll<HTMLElement>("[data-feature-card]");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: cards[0], start: "top 82%", toggleActions: "play none none reverse" },
        }
      );
      cards.forEach((card) => {
        hoverCleanupRef.current.push(
          attachHoverLift(card, {
            scale: 1.03,
            shadowRest: "none",
            shadowHover: "drop-shadow(0 0 24px rgba(47,128,237,0.35))",
            zIndexHover: "20",
            borderRest: "rgba(255,255,255,0.1)",
            borderHover: "rgba(47,128,237,0.6)",
            bgRest: "rgba(5,5,5,0.4)",
            bgHover: "rgba(47,128,237,0.1)",
          })
        );
      });

      const deviceImgs = sectionRef.current!.querySelectorAll<HTMLElement>("[data-device-visual]");
      gsap.fromTo(
        deviceImgs,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: deviceImgs[0], start: "top 82%", toggleActions: "play none none reverse" },
        }
      );
      deviceImgs.forEach((img) => {
        hoverCleanupRef.current.push(
          attachHoverLift(img, {
            scale: 1.1,
            shadowRest: "drop-shadow(0 16px 24px rgba(0,0,0,0.4))",
            shadowHover: "drop-shadow(0 40px 60px rgba(0,0,0,0.75))",
            zIndexHover: "30",
          })
        );
      });

      // Mobile mockup gets its own one-shot 360° "card flip" entrance instead
      // of the plain fade the other device visual gets — full rotateY on
      // desktop (needs the parent's perspective to read as a flip, not a
      // flat squash), simplified to fade+scale on small screens where a
      // full 3D spin tends to look janky rather than elegant.
      const mobileVisual = sectionRef.current!.querySelector("[data-mobile-visual]");
      if (mobileVisual) {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(
            mobileVisual,
            { opacity: 0, scale: 0.85, rotateY: 0 },
            {
              opacity: 1,
              scale: 1,
              rotateY: 360,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: mobileVisual, start: "top 80%", toggleActions: "play none none reverse" },
            }
          );
        });
        mm.add("(max-width: 767px)", () => {
          gsap.fromTo(
            mobileVisual,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: mobileVisual, start: "top 82%", toggleActions: "play none none reverse" },
            }
          );
        });

        // "Come forward" is a hover-only effect, separate from the entrance
        // spin above — the element stays at rest (no elevation, no extra
        // scale) once the spin finishes, and only lifts when a real mouse
        // hovers it. Gated on pointer capability (not the width breakpoint
        // above), since a touch device can still be >=768px wide (tablets).
        hoverCleanupRef.current.push(
          attachHoverLift(mobileVisual as HTMLElement, {
            scale: 1.1,
            shadowRest: "drop-shadow(0 16px 24px rgba(0,0,0,0.4))",
            shadowHover: "drop-shadow(0 40px 60px rgba(0,0,0,0.75))",
            zIndexHover: "30",
          })
        );
      }

    }, sectionRef);

    return () => {
      hoverCleanupRef.current.forEach((cleanup) => cleanup());
      hoverCleanupRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-graphite px-6 py-28 md:px-14 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-electric">
          004 / O sistema
        </span>
        <RevealText
          as="h2"
          className="max-w-4xl font-heading text-4xl font-bold leading-[1.1] text-porcelain md:text-5xl"
        >
          Enquanto você anota cliente no caderno, seu concorrente já tem um CRM rodando sozinho.
        </RevealText>
        <p className="mt-6 max-w-2xl text-lg text-porcelain/65">
          Não é outro app pra você aprender. É o sistema que a própria J7 usa e agora estrutura pra
          funcionar no seu negócio — simples de configurar, difícil de ficar sem depois que você vê
          funcionando.
        </p>

        <div data-main-visual className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-electric/15 blur-3xl" />
          <Image
            src="/images/j7crm-laptop-mockup.png"
            alt="J7 CRM — dashboard, inbox, kanban, follow-up, campanhas, contatos e configurações, tudo integrado"
            width={1448}
            height={1086}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-16 grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div ref={typewriterWrapRef} className="relative">
            <p ref={typewriterRef} className="text-lg text-porcelain/75">
              O J7 CRM nasceu de um problema real: gente perdendo venda porque o WhatsApp virou uma
              bagunça de conversa perdida, contato esquecido e proposta que ninguém lembrou de
              cobrar. A gente resolveu isso pra gente primeiro. Agora resolve pro seu negócio também.
            </p>
            <span ref={cursorRef} className="typewriter-cursor" aria-hidden="true" />
          </div>
          <div
            data-intro-child
            className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50"
          >
            <Image
              src="/images/j7crm-campanhas-mockup.png"
              alt="Tela de campanhas do J7 CRM"
              width={1448}
              height={1086}
              sizes="(min-width: 768px) 400px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-feature-card
              className="hover-lift rounded-2xl border border-white/10 bg-ink/40 p-6"
            >
              <h3 className="font-heading text-xl font-bold text-porcelain">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-porcelain/65">{f.pain}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <div
            data-mobile-visual
            className="hover-lift relative z-[1] mx-auto w-full max-w-[320px] [perspective:1200px] [filter:drop-shadow(0_16px_24px_rgba(0,0,0,0.4))]"
          >
            <Image
              src="/images/j7crm-mobile-mockup.png"
              alt="J7 CRM funcionando no celular"
              width={941}
              height={1672}
              sizes="(min-width: 768px) 320px, 260px"
              className="h-auto w-full"
            />
          </div>
          <div
            data-device-visual
            className="hover-lift relative z-[1] mx-auto w-full max-w-[280px] [filter:drop-shadow(0_16px_24px_rgba(0,0,0,0.4))]"
          >
            <Image
              src="/images/j7crm-login-mockup.png"
              alt="Tela de login do J7 CRM"
              width={1122}
              height={1402}
              sizes="(min-width: 768px) 280px, 220px"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-16 border-l-2 border-electric/50 pl-6">
          <div ref={urgencyWrapRef} className="relative max-w-3xl">
            <p ref={urgencyTextRef} className="text-lg font-medium text-porcelain">
              Todo negócio que decidiu não ter isso ainda está competindo do mesmo jeito que
              competia há 5 anos. E quem tem, está vendendo com a metade do esforço. A diferença
              entre os dois não aparece no primeiro mês — aparece no relatório de fim de ano, quando
              um cresceu e o outro só trabalhou mais.
            </p>
            <span ref={urgencyCursorRef} className="typewriter-cursor" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-10">
          <MagneticButton href={WHATSAPP_LINK} variant="primary" external>
            QUERO O J7 CRM NO MEU NEGÓCIO
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
