"use client";

import { useEffect, useRef } from "react";
import { gsap, MotionPathPlugin, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import { WHATSAPP_LINK } from "@/lib/constants";

type CardContent = { n: string; title: string; desc: string; status: string };

const ROW_CONTENT: { left: CardContent; right: CardContent }[] = [
  {
    left: {
      n: "01",
      title: "CLIENTE SEM RESPOSTA",
      desc: "O cliente chamou e ninguém respondeu.",
      status: "AGUARDANDO ATENDIMENTO",
    },
    right: {
      n: "01",
      title: "RESPOSTA IMEDIATA",
      desc: "O cliente recebe atendimento a qualquer hora.",
      status: "ATENDIMENTO 24/7",
    },
  },
  {
    left: {
      n: "02",
      title: "CONTATOS ESPALHADOS",
      desc: "Conversas divididas entre WhatsApp, planilhas e anotações.",
      status: "SEM CONTROLE",
    },
    right: {
      n: "02",
      title: "CONTATOS CENTRALIZADOS",
      desc: "Cada conversa e informação fica registrada em um só lugar.",
      status: "TUDO ORGANIZADO",
    },
  },
  {
    left: {
      n: "03",
      title: "ORÇAMENTO ESQUECIDO",
      desc: "A proposta foi enviada, mas ninguém fez o acompanhamento.",
      status: "SEM FOLLOW-UP",
    },
    right: {
      n: "03",
      title: "FOLLOW-UP AUTOMÁTICO",
      desc: "A IA acompanha cada oportunidade no momento certo.",
      status: "ACOMPANHAMENTO ATIVO",
    },
  },
  {
    left: {
      n: "04",
      title: "GESTOR SOBRECARREGADO",
      desc: "O gestor precisa acompanhar e cobrar tudo manualmente.",
      status: "OPERAÇÃO TRAVADA",
    },
    right: {
      n: "04",
      title: "GESTOR NO CONTROLE",
      desc: "A equipe trabalha melhor e o gestor acompanha os resultados.",
      status: "PRONTO PARA ESCALAR",
    },
  },
];

const ACTIONS = ["RESPONDE", "ORGANIZA", "ACOMPANHA", "QUALIFICA"];

const OPERATION_PHRASE =
  "Sua operação continua trabalhando, mesmo quando sua equipe não está online.";

const LEFT_JITTER = [-1.3, 0.9, -0.7, 1.1];

// Desktop diagram geometry — a 1200x800 coordinate space. Every connecting
// line is a single path with two cubic-bezier segments that both terminate
// at the exact core center; the opaque core disc (rendered on top) hides
// the convergence, so no per-connection entry/exit trig is needed.
const VB = { w: 1200, h: 800 };
const CORE = { cx: 600, cy: 400 };
const ROW_Y = [100, 300, 500, 700];
const CARD_X_LEFT = 312;
const CARD_X_RIGHT = 888;

function bez(p1: [number, number], p2: [number, number], curvature = 0.55) {
  const dx = (p2[0] - p1[0]) * curvature;
  return {
    c1: [p1[0] + dx, p1[1]] as [number, number],
    c2: [p2[0] - dx, p2[1]] as [number, number],
  };
}

const ROWS = ROW_CONTENT.map((content, i) => {
  const y = ROW_Y[i];
  const cardL: [number, number] = [CARD_X_LEFT, y];
  const cardR: [number, number] = [CARD_X_RIGHT, y];
  const core: [number, number] = [CORE.cx, CORE.cy];
  const left = bez(cardL, core);
  const right = bez(core, cardR);
  const d = `M${cardL[0]},${cardL[1]} C${left.c1[0]},${left.c1[1]} ${left.c2[0]},${left.c2[1]} ${core[0]},${core[1]} C${right.c1[0]},${right.c1[1]} ${right.c2[0]},${right.c2[1]} ${cardR[0]},${cardR[1]}`;
  return { ...content, y, cardL, cardR, d };
});

function StatusPill({ tone, children }: { tone: "warm" | "cool"; children: React.ReactNode }) {
  return (
    <span
      className={`mt-3 inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
        tone === "warm"
          ? "border-[#d9603f]/30 bg-[#d9603f]/10 text-[#e2896f]"
          : "border-electric/30 bg-electric/10 text-electric-light"
      }`}
    >
      {children}
    </span>
  );
}

function ActionPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-electric/30 bg-graphite/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-electric-light backdrop-blur-sm md:text-[10px]">
      {children}
    </span>
  );
}

function CardBlock({ data, tone, jitter }: { data: CardContent; tone: "warm" | "cool"; jitter?: number }) {
  return (
    <div
      className="relative rounded-2xl border border-white/10 bg-graphite/70 p-5 shadow-lg shadow-black/30 backdrop-blur-sm"
      style={jitter ? { transform: `rotate(${jitter}deg)` } : undefined}
    >
      <span
        className={`font-mono text-xs ${tone === "warm" ? "text-[#e2896f]" : "text-electric"}`}
      >
        {data.n}
      </span>
      <p className="mt-1 font-heading text-base font-bold leading-snug text-porcelain">
        {data.title}
      </p>
      <p className="mt-2 text-sm text-porcelain/65">{data.desc}</p>
      <StatusPill tone={tone}>{data.status}</StatusPill>
    </div>
  );
}

export default function Rupture() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const diagramRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coreFlashRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const pathGlowRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const leftCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightFlashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const actionRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const leftLabelRef = useRef<HTMLSpanElement>(null);

  const mobileRootRef = useRef<HTMLDivElement>(null);
  const mobileLineTopRef = useRef<HTMLDivElement>(null);
  const mobileLineBottomRef = useRef<HTMLDivElement>(null);
  const mobileLeftItemsRef = useRef<HTMLDivElement>(null);
  const mobileRightItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(
        [...leftCardRefs.current, ...rightCardRefs.current, ...actionRefs.current],
        { opacity: 1, x: 0, y: 0, scale: 1, filter: "none" }
      );
      pathRefs.current.forEach((p) => {
        if (p) gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 });
      });
      if (mobileLineTopRef.current) gsap.set(mobileLineTopRef.current, { scaleY: 1 });
      if (mobileLineBottomRef.current) gsap.set(mobileLineBottomRef.current, { scaleY: 1 });
      if (mobileLeftItemsRef.current) {
        gsap.set(mobileLeftItemsRef.current.querySelectorAll("[data-mobile-card]"), {
          opacity: 1,
          x: 0,
        });
      }
      if (mobileRightItemsRef.current) {
        gsap.set(mobileRightItemsRef.current.querySelectorAll("[data-mobile-card]"), {
          opacity: 1,
          x: 0,
        });
      }
      return;
    }

    const activeTweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];

    const ctx = gsap.context(() => {
      // ---- Desktop hub-and-spoke entrance ----
      if (diagramRef.current) {
        const lens = pathRefs.current.map((p) => (p ? p.getTotalLength() : 0));
        pathRefs.current.forEach((p, i) => {
          if (!p) return;
          gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] });
          const glow = pathGlowRefs.current[i];
          if (glow) gsap.set(glow, { strokeDasharray: lens[i], strokeDashoffset: lens[i] });
        });
        gsap.set(dotRefs.current, { opacity: 0 });
        gsap.set(actionRefs.current, { opacity: 0, scale: 0.7 });

        // Decorative-only (energy dots, core pulse/halo, ring rotation) —
        // gated by section visibility (onEnter/onEnterBack start them,
        // onLeave/onLeaveBack kill them) rather than a one-shot onComplete,
        // so they never keep animating off-screen and always restart clean
        // when the user re-enters from either scroll direction.
        let idleTweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];
        const startIdle = () => {
          if (idleTweens.length) return;
          ROWS.forEach((row, i) => {
            const dot = dotRefs.current[i];
            if (!dot) return;
            const duration = 4 + Math.random() * 1.4;

            const motionTween = gsap.to(dot, {
              motionPath: { path: row.d },
              duration,
              repeat: -1,
              ease: "sine.inOut",
              onRepeat: () => {
                const flash = rightFlashRefs.current[i];
                if (flash) {
                  idleTweens.push(
                    gsap.fromTo(
                      flash,
                      { opacity: 0 },
                      { opacity: 0.8, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }
                    )
                  );
                }
                if (coreFlashRef.current) {
                  idleTweens.push(
                    gsap.fromTo(
                      coreFlashRef.current,
                      { opacity: 0 },
                      { opacity: 0.35, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }
                    )
                  );
                }
              },
            });

            const fadeTl = gsap.timeline({ repeat: -1 });
            fadeTl
              .fromTo(dot, { opacity: 0 }, { opacity: 1, duration: duration * 0.15, ease: "sine.out" })
              .to(dot, { opacity: 1, duration: duration * 0.6 })
              .to(dot, { opacity: 0, duration: duration * 0.25, ease: "sine.in" });

            idleTweens.push(motionTween, fadeTl);
          });

          if (coreRef.current) {
            idleTweens.push(
              gsap.to(coreRef.current, {
                scale: 1.015,
                duration: 3.2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
              }),
              gsap.to(coreRef.current, {
                "--halo-opacity": 0.28,
                "--halo-scale": 1.07,
                duration: 3.2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
              } as gsap.TweenVars)
            );
          }
          if (ringRef.current) {
            idleTweens.push(
              gsap.to(ringRef.current, {
                rotate: 360,
                duration: 34,
                repeat: -1,
                ease: "none",
                transformOrigin: "50% 50%",
              })
            );
          }
          activeTweens.push(...idleTweens);
        };
        const stopIdle = () => {
          idleTweens.forEach((t) => t.kill());
          idleTweens = [];
        };

        // Single scrubbed timeline — every beat is a fromTo with explicit
        // start/end state, so scroll position drives it directly and it's
        // fully reversible (scrolling back up un-draws the connections and
        // fades the cards back out) instead of the previous once-triggered
        // entrance.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: diagramRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onEnter: startIdle,
            onEnterBack: startIdle,
            onLeave: stopIdle,
            onLeaveBack: stopIdle,
          },
        });

        // 1. Left ("antes") cards appear
        tl.fromTo(
          leftCardRefs.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1, ease: "power2.inOut", stagger: 0.12 }
        );

        // 2. Left half of each connection draws in
        tl.to(
          pathRefs.current,
          {
            strokeDashoffset: (i: number) => lens[i] * 0.5,
            duration: 1.2,
            ease: "power2.inOut",
            stagger: 0.1,
          },
          "-=0.3"
        );
        tl.to(
          pathGlowRefs.current,
          {
            strokeDashoffset: (i: number) => lens[i] * 0.5,
            duration: 1.2,
            ease: "power2.inOut",
            stagger: 0.1,
          },
          "<"
        );

        // 3 + 4. Energy reaches the core — brighten it
        tl.fromTo(
          coreFlashRef.current,
          { opacity: 0 },
          { opacity: 0.55, duration: 0.4, ease: "power2.inOut" },
          "-=0.15"
        );
        tl.fromTo(coreRef.current, { scale: 1 }, { scale: 1.05, duration: 0.4, ease: "power2.inOut" }, "<");
        tl.to(coreRef.current, { scale: 1, duration: 0.5, ease: "power2.inOut" });
        tl.to(coreFlashRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "<");

        // 5. Core actions appear
        tl.fromTo(
          actionRefs.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.inOut", stagger: 0.08 },
          "-=0.3"
        );

        // 6. Right half of each connection draws in
        tl.to(
          pathRefs.current,
          { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", stagger: 0.1 },
          "-=0.2"
        );
        tl.to(pathGlowRefs.current, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", stagger: 0.1 }, "<");

        // 7 + 8. Right ("depois") cards appear, shifting from dim to full color
        tl.fromTo(
          rightCardRefs.current,
          { opacity: 0, x: 50, filter: "grayscale(1) brightness(0.7)" },
          { opacity: 1, x: 0, duration: 1, ease: "power2.inOut", stagger: 0.12 },
          "-=0.6"
        );
        tl.to(
          rightCardRefs.current,
          { filter: "grayscale(0) brightness(1)", duration: 0.9, ease: "power2.inOut", stagger: 0.1 },
          "-=0.5"
        );

        activeTweens.push(tl);
      }

      // ---- Mobile journey entrance ----
      if (mobileLeftItemsRef.current) {
        const items = mobileLeftItemsRef.current.querySelectorAll("[data-mobile-card]");
        gsap.fromTo(
          items,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.inOut",
            stagger: 0.12,
            scrollTrigger: {
              trigger: mobileLeftItemsRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
        if (mobileLineTopRef.current) {
          gsap.fromTo(
            mobileLineTopRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              scrollTrigger: {
                trigger: mobileLeftItemsRef.current,
                start: "top 75%",
                end: "bottom bottom",
                scrub: true,
              },
            }
          );
        }
      }

      if (mobileRightItemsRef.current) {
        const items = mobileRightItemsRef.current.querySelectorAll("[data-mobile-card]");
        gsap.fromTo(
          items,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.inOut",
            stagger: 0.12,
            scrollTrigger: {
              trigger: mobileRightItemsRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
        if (mobileLineBottomRef.current) {
          gsap.fromTo(
            mobileLineBottomRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              scrollTrigger: {
                trigger: mobileRightItemsRef.current,
                start: "top 75%",
                end: "bottom bottom",
                scrub: true,
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => {
      activeTweens.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-graphite px-6 py-28 md:px-14 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-electric">
          002 / O problema
        </span>
        <h2 className="font-heading text-4xl font-bold leading-[1.05] text-porcelain md:text-6xl">
          <RevealText as="span">O QUE VOCÊ FAZ NO BRAÇO TODO DIA,</RevealText>{" "}
          <RevealText as="span" className="text-electric">
            A IA FAZ SOZINHA
          </RevealText>{" "}
          <RevealText as="span" className="font-normal text-porcelain/85 italic">
            — 24 HORAS, 7 DIAS POR SEMANA.
          </RevealText>
        </h2>

        <p className="mt-8 max-w-2xl text-lg text-porcelain/65">
          Sua equipe perde tempo respondendo perguntas repetidas, organizando contatos
          manualmente e tentando lembrar quem precisa de retorno.
        </p>
        <p className="mt-4 max-w-2xl text-lg text-porcelain/65">
          Enquanto sua equipe dorme, o cliente que chamou às 22h já foi procurar o concorrente.
        </p>

        {/* Desktop — Antes da IA | J7 | Depois da IA */}
        <div className="mt-20 hidden md:block">
          <div className="grid grid-cols-3">
            <span ref={leftLabelRef} className="font-mono text-xs uppercase tracking-[0.25em] text-[#e2896f]">
              Antes da IA <span className="text-porcelain/40">· Operação manual</span>
            </span>
            <span />
            <span className="text-right font-mono text-xs uppercase tracking-[0.25em] text-electric-light">
              <span className="text-porcelain/40">Operação automatizada ·</span> Depois da IA
            </span>
          </div>

          <div
            ref={diagramRef}
            className="relative mx-auto mt-6 w-full"
            style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              fill="none"
            >
              <defs>
                <linearGradient id="ruptureFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d9603f" />
                  <stop offset="46%" stopColor="#2f80ed" />
                  <stop offset="54%" stopColor="#2f80ed" />
                  <stop offset="100%" stopColor="#5fd9c4" />
                </linearGradient>
                <filter id="ruptureSoftBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <filter id="ruptureDotGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>

              {ROWS.map((row, i) => (
                <path
                  key={`glow-${i}`}
                  ref={(el) => { pathGlowRefs.current[i] = el; }}
                  d={row.d}
                  stroke="url(#ruptureFlowGradient)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.22}
                  filter="url(#ruptureSoftBlur)"
                />
              ))}
              {ROWS.map((row, i) => (
                <path
                  key={`line-${i}`}
                  ref={(el) => { pathRefs.current[i] = el; }}
                  d={row.d}
                  stroke="url(#ruptureFlowGradient)"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {ROWS.map((row, i) => (
                <g key={`endpoints-${i}`}>
                  <circle cx={row.cardL[0]} cy={row.cardL[1]} r={7} fill="#e2896f" opacity={0.5} filter="url(#ruptureDotGlow)" />
                  <circle cx={row.cardL[0]} cy={row.cardL[1]} r={2.5} fill="#f3d3c4" />
                  <circle cx={row.cardR[0]} cy={row.cardR[1]} r={7} fill="#5fd9c4" opacity={0.5} filter="url(#ruptureDotGlow)" />
                  <circle cx={row.cardR[0]} cy={row.cardR[1]} r={2.5} fill="#dbfff5" />
                </g>
              ))}

              {ROWS.map((_, i) => (
                <g key={`dot-${i}`} ref={(el) => { dotRefs.current[i] = el; }} opacity={0}>
                  <circle r={5} fill="#eaf3ff" opacity={0.45} filter="url(#ruptureDotGlow)" />
                  <circle r={2.2} fill="#eaf3ff" />
                </g>
              ))}
            </svg>

            {ROWS.map((row, i) => (
              <div
                key={`left-card-${i}`}
                ref={(el) => { leftCardRefs.current[i] = el; }}
                className="absolute w-[25%]"
                style={{ left: "2%", top: `${(row.y / VB.h) * 100}%`, transform: "translateY(-50%)" }}
              >
                <CardBlock data={row.left} tone="warm" jitter={LEFT_JITTER[i]} />
              </div>
            ))}

            {ROWS.map((row, i) => (
              <div
                key={`right-card-${i}`}
                ref={(el) => { rightCardRefs.current[i] = el; }}
                className="absolute w-[25%]"
                style={{ right: "2%", top: `${(row.y / VB.h) * 100}%`, transform: "translateY(-50%)" }}
              >
                <div className="relative">
                  <CardBlock data={row.right} tone="cool" />
                  <div
                    ref={(el) => { rightFlashRefs.current[i] = el; }}
                    className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-electric-light opacity-0"
                  />
                </div>
              </div>
            ))}

            <div
              ref={coreRef}
              className="rupture-core absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-graphite text-center"
              style={{ width: "19%", aspectRatio: "1 / 1" }}
            >
              <div ref={ringRef} className="rupture-ring" />
              <div
                ref={coreFlashRef}
                className="pointer-events-none absolute inset-0 rounded-full bg-electric-light opacity-0"
              />

              <div className="absolute left-1/2 flex -translate-x-1/2 gap-2" style={{ top: "-19%" }}>
                <span ref={(el) => { actionRefs.current[0] = el; }}>
                  <ActionPill>{ACTIONS[0]}</ActionPill>
                </span>
                <span ref={(el) => { actionRefs.current[1] = el; }}>
                  <ActionPill>{ACTIONS[1]}</ActionPill>
                </span>
              </div>
              <div className="absolute left-1/2 flex -translate-x-1/2 gap-2" style={{ bottom: "-19%" }}>
                <span ref={(el) => { actionRefs.current[2] = el; }}>
                  <ActionPill>{ACTIONS[2]}</ActionPill>
                </span>
                <span ref={(el) => { actionRefs.current[3] = el; }}>
                  <ActionPill>{ACTIONS[3]}</ActionPill>
                </span>
              </div>

              <span className="relative font-display text-2xl font-bold uppercase leading-tight tracking-wide text-porcelain lg:text-3xl">
                J<span className="text-electric">7</span>
              </span>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-sm text-center text-sm italic text-porcelain/55">
            {OPERATION_PHRASE}
          </p>
        </div>

        {/* Mobile — vertical journey: antes → núcleo → depois */}
        <div ref={mobileRootRef} className="mt-20 md:hidden">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#e2896f]">
            Antes da IA <span className="text-porcelain/40">· Operação manual</span>
          </span>

          <div ref={mobileLeftItemsRef} className="relative mt-6 flex flex-col gap-5 pl-6">
            <div
              ref={mobileLineTopRef}
              className="absolute left-0 top-1 h-full w-px"
              style={{ background: "linear-gradient(to bottom, #d9603f, #2f80ed)" }}
            >
              {[15, 45, 75, 100].map((pct) => (
                <span
                  key={pct}
                  className="rupture-mobile-dot absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${Math.min(pct, 98)}%` }}
                />
              ))}
            </div>
            {ROWS.map((row, i) => (
              <div key={`m-left-${i}`} data-mobile-card>
                <CardBlock data={row.left} tone="warm" />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <div
              className="rupture-core rupture-core--mobile relative flex items-center justify-center rounded-full bg-graphite text-center"
              style={{ width: 120, height: 120 }}
            >
              <span className="relative font-display text-xl font-bold uppercase leading-tight tracking-wide text-porcelain">
                J<span className="text-electric">7</span>
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {ACTIONS.map((a) => (
              <ActionPill key={a}>{a}</ActionPill>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-xs text-center text-sm italic text-porcelain/55">
            {OPERATION_PHRASE}
          </p>

          <span className="mt-10 block font-mono text-xs uppercase tracking-[0.25em] text-electric-light">
            Depois da IA <span className="text-porcelain/40">· Operação automatizada</span>
          </span>

          <div ref={mobileRightItemsRef} className="relative mt-6 flex flex-col gap-5 pl-6">
            <div
              ref={mobileLineBottomRef}
              className="absolute left-0 top-1 h-full w-px"
              style={{ background: "linear-gradient(to bottom, #2f80ed, #5fd9c4)" }}
            >
              {[15, 45, 75, 100].map((pct) => (
                <span
                  key={pct}
                  className="rupture-mobile-dot absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${Math.min(pct, 98)}%` }}
                />
              ))}
            </div>
            {ROWS.map((row, i) => (
              <div key={`m-right-${i}`} data-mobile-card>
                <CardBlock data={row.right} tone="cool" />
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="mx-auto mt-20 max-w-2xl text-center md:mt-24">
          <p className="font-heading text-2xl font-bold uppercase leading-snug text-porcelain md:text-3xl">
            DO PRIMEIRO CONTATO AO FOLLOW-UP:{" "}
            <span className="text-electric">A IA MANTÉM SUA OPERAÇÃO EM MOVIMENTO.</span>
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton href={WHATSAPP_LINK} variant="primary" external>
              QUERO AUTOMATIZAR MINHA OPERAÇÃO →
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
