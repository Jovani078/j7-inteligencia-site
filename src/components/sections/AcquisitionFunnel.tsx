"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { WHATSAPP_LINK } from "@/lib/constants";
import {
  VB,
  ORIGINS,
  ORIGIN_R,
  RIM,
  ENTRY_PATHS,
  FUNNEL_BODY_D,
  RING,
  SCAN_X,
  SCAN_Y,
  EXIT_LINE,
  RESULTS,
  STAGES,
  LEADS,
  buildLeadKeyframes,
  FUNNEL_COLORS,
} from "@/lib/funnel-geometry";

const LEAD_KEYFRAMES = LEADS.map((l) => buildLeadKeyframes(l));

// The funnel's actual content (origins + body) only occupies the middle
// portion of the 700-wide geometry canvas — crop the SVG's viewBox to that
// content instead of the full canvas so the funnel reads as large/dominant
// rather than floating with dead margin on both sides.
const VIEW_X = 110;
const VIEW_W = 480;
const VIEW_BOX = `${VIEW_X} 0 ${VIEW_W} ${VB.h}`;

const DESCRIPTION = "Colocamos sua empresa diante de quem já está procurando uma solução.";
const FINAL_LINE_1 = "TRÁFEGO NÃO É O RESULTADO.";
const FINAL_LINE_2 = "O RESULTADO É TRANSFORMAR ATENÇÃO EM OPORTUNIDADE.";
const FINAL_CTA = "QUERO ATRAIR NOVOS CLIENTES →";

function OriginIcon({ kind }: { kind: (typeof ORIGINS)[number]["key"] }) {
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#F5F7FA">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.66 15.4 3.57 14.24 3.57c-2.4 0-4.05 1.47-4.05 4.16v2.16H7.5v3.1h2.69v8h3.31Z" />
      </svg>
    );
  }
  if (kind === "google") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M22.1 12.2c0-.7-.06-1.4-.18-2.1H12v4h5.66a4.85 4.85 0 0 1-2.1 3.2v2.6h3.4c2-1.83 3.14-4.53 3.14-7.7Z" />
        <path fill="#34A853" d="M12 22c2.83 0 5.2-.93 6.96-2.53l-3.4-2.6c-.94.63-2.15 1-3.56 1-2.73 0-5.05-1.84-5.88-4.32H2.62v2.68A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.12 13.55A6 6 0 0 1 5.8 12c0-.54.1-1.06.32-1.55V7.77H2.62A10 10 0 0 0 1.6 12c0 1.6.38 3.1 1.02 4.23l3.5-2.68Z" />
        <path fill="#EA4335" d="M12 5.98c1.54 0 2.92.53 4 1.56l3-3C17.2 2.7 14.83 1.8 12 1.8a10 10 0 0 0-9.38 5.97l3.5 2.68C6.95 7.8 9.27 5.98 12 5.98Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#F5F7FA">
      <path d="M12 2.4A9.6 9.6 0 0 0 3.7 17.2L2.4 21.6l4.5-1.3A9.6 9.6 0 1 0 12 2.4Zm5.1 13.6c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 1.9.8 2 .1.2.1.4 0 .6-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.2.5.2.6.3.1.2.1.7-.1 1.3Z" />
    </svg>
  );
}

export default function AcquisitionFunnel() {
  const pinRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const funnelBodyRef = useRef<SVGPathElement>(null);
  const funnelRimRef = useRef<SVGEllipseElement>(null);
  const originRefs = useRef<(SVGGElement | null)[]>([]);
  const entryPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const entryGlowRefs = useRef<(SVGPathElement | null)[]>([]);
  const entryParticleRefs = useRef<(SVGGElement | null)[]>([]);
  const leadRefs = useRef<(SVGCircleElement | null)[]>([]);
  const ringRef = useRef<SVGGElement>(null);
  const scanRef = useRef<SVGLineElement>(null);
  const rimHaloRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGGElement>(null);
  const moneyRef = useRef<SVGGElement>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const counterARef = useRef<HTMLSpanElement>(null);
  const counterBRef = useRef<HTMLSpanElement>(null);
  const indicatorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stateRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageLabelRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (funnelBodyRef.current) gsap.set(funnelBodyRef.current, { strokeDasharray: "none", strokeDashoffset: 0, attr: { "fill-opacity": 1 } });
      if (funnelRimRef.current) gsap.set(funnelRimRef.current, { strokeDasharray: "none", strokeDashoffset: 0 });
      gsap.set(originRefs.current, { opacity: 1, x: 0, y: 0 });
      entryPathRefs.current.forEach((p) => p && gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 }));
      entryGlowRefs.current.forEach((p) => p && gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 }));
      gsap.set(entryParticleRefs.current, { opacity: 0 });
      leadRefs.current.forEach((el, i) => {
        if (!el) return;
        const kf = LEAD_KEYFRAMES[i].s5;
        gsap.set(el, { attr: { cx: kf.x, cy: kf.y }, opacity: kf.opacity, scale: kf.scale, fill: kf.fill });
      });
      if (ringRef.current) gsap.set(ringRef.current, { rotation: 130, transformOrigin: "50% 50%" });
      if (scanRef.current) gsap.set(scanRef.current, { opacity: 0 });
      gsap.set([checkRef.current, moneyRef.current], { opacity: 1, scale: 1 });
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const h = RESULTS.bars.heights[i];
        gsap.set(bar, { attr: { height: h, y: RESULTS.bars.baseline - h } });
      });
      gsap.set(counterARef.current, { opacity: 0 });
      gsap.set(counterBRef.current, { opacity: 1 });
      gsap.set(indicatorRefs.current, { opacity: 0.6 });
      gsap.set(stateRefs.current, { opacity: 0.6 });
      if (progressFillRef.current) gsap.set(progressFillRef.current, { scaleX: 1 });
      return;
    }

    const activeTweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];

    const ctx = gsap.context(() => {
      if (rimHaloRef.current) {
        activeTweens.push(
          gsap.to(rimHaloRef.current, {
            "--halo-opacity": 0.4,
            "--halo-scale": 1.18,
            duration: 3.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          } as gsap.TweenVars)
        );
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        if (!pinRef.current) return;

        const bodyLen = funnelBodyRef.current?.getTotalLength() ?? 0;
        const rimLen = funnelRimRef.current?.getTotalLength() ?? 0;
        if (funnelBodyRef.current) {
          gsap.set(funnelBodyRef.current, {
            strokeDasharray: bodyLen,
            strokeDashoffset: bodyLen,
            attr: { "fill-opacity": 0 },
          });
        }
        if (funnelRimRef.current) {
          gsap.set(funnelRimRef.current, { strokeDasharray: rimLen, strokeDashoffset: rimLen });
        }

        const entryLens = entryPathRefs.current.map((p) => (p ? p.getTotalLength() : 0));
        entryPathRefs.current.forEach((p, i) => {
          if (!p) return;
          gsap.set(p, { strokeDasharray: entryLens[i], strokeDashoffset: entryLens[i] });
          const glow = entryGlowRefs.current[i];
          if (glow) gsap.set(glow, { strokeDasharray: entryLens[i], strokeDashoffset: entryLens[i] });
        });
        gsap.set(entryParticleRefs.current, { opacity: 0 });
        gsap.set(originRefs.current, { opacity: 0.45 });
        gsap.set(scanRef.current, { opacity: 0 });
        gsap.set(indicatorRefs.current, { opacity: 0 });
        gsap.set(stateRefs.current, { opacity: 0 });
        gsap.set(counterARef.current, { opacity: 0 });
        gsap.set(counterBRef.current, { opacity: 0 });
        gsap.set([checkRef.current, moneyRef.current], { opacity: 0, scale: 0.6 });
        barRefs.current.forEach((bar) => bar && gsap.set(bar, { attr: { height: 0, y: RESULTS.bars.baseline } }));

        LEAD_KEYFRAMES.forEach((kf, i) => {
          const el = leadRefs.current[i];
          if (!el) return;
          gsap.set(el, { attr: { cx: kf.s1.x, cy: kf.s1.y }, opacity: kf.s1.opacity, scale: kf.s1.scale, fill: kf.s1.fill });
        });

        textRefs.current.forEach((block, i) => {
          if (!block) return;
          const heading = block.querySelector<HTMLElement>("[data-heading]");
          const markers = block.querySelectorAll<HTMLElement>("[data-marker]");
          const final = block.querySelector<HTMLElement>("[data-final]");
          const cta = block.querySelector<HTMLElement>("[data-cta]");
          gsap.set([heading, ...Array.from(markers)], { opacity: i === 0 ? 1 : 0, y: 0 });
          if (final) gsap.set(final, { opacity: 0 });
          if (cta) gsap.set(cta, { opacity: 0 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: "+=2500",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const bounds = [0, 0.2, 0.4, 0.65, 0.82, 1];
              const stage = p < 0.2 ? 0 : p < 0.4 ? 1 : p < 0.65 ? 2 : p < 0.82 ? 3 : 4;
              if (progressFillRef.current) {
                const localStart = bounds[stage];
                const localEnd = bounds[stage + 1];
                const localProgress = (p - localStart) / (localEnd - localStart);
                gsap.set(progressFillRef.current, { scaleX: Math.min(Math.max(localProgress, 0), 1) });
              }
              if (stageLabelRef.current) {
                const s = STAGES[stage];
                stageLabelRef.current.textContent = `${s.n} / ${s.key.toUpperCase()}`;
              }
            },
          },
        });

        tl.addLabel("s1", 0)
          .addLabel("s2", 20)
          .addLabel("s3", 40)
          .addLabel("s4", 65)
          .addLabel("s5", 82)
          .addLabel("end", 100);

        // Stage 1 — ATRAIR: the funnel silhouette traces itself first (body
        // outline, then rim), glass fill settles in, then logos stagger in.
        tl.to(funnelBodyRef.current, { strokeDashoffset: 0, duration: 14, ease: "none" }, "s1");
        tl.to(funnelRimRef.current, { strokeDashoffset: 0, duration: 10, ease: "none" }, "s1+=3");
        tl.to(funnelBodyRef.current, { attr: { "fill-opacity": 0.9 }, duration: 6, ease: "power1.out" }, "s1+=10");

        tl.fromTo(originRefs.current[0], { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 6 }, "s1+=2");
        tl.fromTo(originRefs.current[1], { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 6 }, "s1+=5");
        tl.fromTo(originRefs.current[2], { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 6 }, "s1+=8");

        // Stage 2 — CAPTURAR: entry paths draw in, particles travel them,
        // first leads arrive, demonstrative counter swaps.
        tl.to(entryPathRefs.current, { strokeDashoffset: 0, stagger: 3, duration: 12, ease: "none" }, "s2");
        tl.to(entryGlowRefs.current, { strokeDashoffset: 0, stagger: 3, duration: 12, ease: "none" }, "<");
        ENTRY_PATHS.forEach((path, i) => {
          const dot = entryParticleRefs.current[i];
          if (!dot) return;
          tl.set(dot, { opacity: 1 }, `s2+=${i * 3}`);
          tl.to(dot, { motionPath: { path: path.d }, duration: 10, ease: "none" }, `s2+=${i * 3}`);
          tl.to(dot, { opacity: 0, duration: 2 }, `s2+=${i * 3 + 10}`);
        });
        LEAD_KEYFRAMES.forEach((kf, i) => {
          const el = leadRefs.current[i];
          if (!el) return;
          tl.to(
            el,
            { attr: { cx: kf.s2.x, cy: kf.s2.y }, opacity: kf.s2.opacity, scale: kf.s2.scale, fill: kf.s2.fill, duration: 8 },
            `s2+=${4 + (i % 5)}`
          );
        });
        tl.set(counterARef.current, { opacity: 1 }, "s2+=3");
        tl.to(counterARef.current, { opacity: 0, duration: 2 }, "s2+=13");
        tl.fromTo(counterBRef.current, { opacity: 0 }, { opacity: 1, duration: 2 }, "s2+=13");

        // Stage 3 — QUALIFICAR: ring rotates, scan line sweeps, leads split
        // into qualified (gold, center) vs discarded (gray, sideways).
        tl.to(ringRef.current, { rotation: 130, transformOrigin: "50% 50%", ease: "none", duration: 22 }, "s3");
        tl.fromTo(
          scanRef.current,
          { opacity: 1, attr: { y1: SCAN_Y.from, y2: SCAN_Y.from } },
          { attr: { y1: SCAN_Y.to, y2: SCAN_Y.to }, duration: 18, ease: "none" },
          "s3+=2"
        );
        tl.to(scanRef.current, { opacity: 0, duration: 2 }, "s3+=20");
        LEAD_KEYFRAMES.forEach((kf, i) => {
          const el = leadRefs.current[i];
          if (!el) return;
          tl.to(
            el,
            { attr: { cx: kf.s3.x, cy: kf.s3.y }, opacity: kf.s3.opacity, scale: kf.s3.scale, fill: kf.s3.fill, duration: 10 },
            `s3+=${4 + (i % 6)}`
          );
        });
        tl.to(indicatorRefs.current, { opacity: 1, stagger: 4, duration: 2 }, "s3+=3");
        tl.to(indicatorRefs.current, { opacity: 0, duration: 3 }, "s3+=22");

        // Stage 4 — ACOMPANHAR: qualified leads move through the neck,
        // follow-up states light up one at a time.
        LEAD_KEYFRAMES.forEach((kf, i) => {
          const el = leadRefs.current[i];
          if (!el) return;
          tl.to(
            el,
            { attr: { cx: kf.s4.x, cy: kf.s4.y }, opacity: kf.s4.opacity, scale: kf.s4.scale, fill: kf.s4.fill, duration: 8 },
            `s4+=${2 + (i % 5)}`
          );
        });
        tl.set(stateRefs.current, { opacity: 0.3 }, "s4");
        tl.to(stateRefs.current[0], { opacity: 1, duration: 1.5 }, "s4");
        tl.to(stateRefs.current[0], { opacity: 0.3, duration: 1.5 }, "s4+=5");
        tl.to(stateRefs.current[1], { opacity: 1, duration: 1.5 }, "s4+=5");
        tl.to(stateRefs.current[1], { opacity: 0.3, duration: 1.5 }, "s4+=11");
        tl.to(stateRefs.current[2], { opacity: 1, duration: 1.5 }, "s4+=11");
        tl.to(stateRefs.current, { opacity: 0, duration: 2 }, "s5");

        // Stage 5 — CONVERTER: hero lead exits, results light up, chart
        // grows, closing line + CTA appear.
        LEAD_KEYFRAMES.forEach((kf, i) => {
          const el = leadRefs.current[i];
          if (!el) return;
          tl.to(
            el,
            { attr: { cx: kf.s5.x, cy: kf.s5.y }, opacity: kf.s5.opacity, scale: kf.s5.scale, fill: kf.s5.fill, duration: 8 },
            `s5+=${2 + (i % 4)}`
          );
        });
        tl.fromTo(checkRef.current, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 5 }, "s5+=6");
        tl.fromTo(moneyRef.current, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 5 }, "s5+=8");
        barRefs.current.forEach((bar, i) => {
          if (!bar) return;
          const h = RESULTS.bars.heights[i];
          tl.fromTo(
            bar,
            { attr: { height: 0, y: RESULTS.bars.baseline } },
            { attr: { height: h, y: RESULTS.bars.baseline - h }, duration: 4, ease: "power2.out" },
            `s5+=${9 + i * 1.5}`
          );
        });

        // Text crossfade — one heading/marker set visible at a time, stable
        // container height, no overlap.
        textRefs.current.forEach((block, i) => {
          if (!block || i === 0) return;
          const label = `s${i + 1}`;
          const heading = block.querySelector<HTMLElement>("[data-heading]");
          const markers = block.querySelectorAll<HTMLElement>("[data-marker]");
          const prevBlock = textRefs.current[i - 1];
          const prevHeading = prevBlock?.querySelector<HTMLElement>("[data-heading]");
          const prevMarkers = prevBlock?.querySelectorAll<HTMLElement>("[data-marker]");
          if (prevHeading) tl.to(prevHeading, { opacity: 0, y: -18, duration: 3 }, label);
          if (prevMarkers?.length) tl.to(Array.from(prevMarkers), { opacity: 0, duration: 1.5 }, label);
          if (heading) tl.fromTo(heading, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 3 }, label);
          if (markers.length)
            tl.fromTo(Array.from(markers), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 2, stagger: 0.5 }, `${label}+=1`);
          if (i === 4) {
            const final = block.querySelector<HTMLElement>("[data-final]");
            const cta = block.querySelector<HTMLElement>("[data-cta]");
            if (final) tl.to(final, { opacity: 1, duration: 3 }, `${label}+=6`);
            if (cta) tl.to(cta, { opacity: 1, duration: 3 }, `${label}+=9`);
          }
        });

        activeTweens.push(tl);
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        if (!mobileRef.current) return;
        const stages = mobileRef.current.querySelectorAll<HTMLElement>("[data-mobile-stage]");
        stages.forEach((stage) => {
          gsap.fromTo(
            stage,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: { trigger: stage, start: "top 82%", toggleActions: "play none none reverse" },
            }
          );
        });
        return () => {
          stages.forEach((stage) => gsap.killTweensOf(stage));
        };
      });
    }, [pinRef, mobileRef]);

    return () => {
      activeTweens.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* Desktop — pinned 5-stage scrub narrative */}
      <div
        ref={pinRef}
        className="relative hidden overflow-hidden md:block"
        style={{ background: FUNNEL_COLORS.bg }}
      >
        <div className="mx-auto grid h-[100svh] max-w-6xl grid-cols-2 items-center gap-10 px-6 py-6 md:px-14 lg:gap-16 lg:px-20">
          <div className="relative">
            <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: FUNNEL_COLORS.copper }}>
              03 / AQUISIÇÃO DE CLIENTES
            </span>
            <p className="mt-3 max-w-md text-base" style={{ color: FUNNEL_COLORS.gray }}>
              {DESCRIPTION}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span
                ref={stageLabelRef}
                className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] tabular-nums"
                style={{ color: FUNNEL_COLORS.amber }}
              >
                01 / ATRAIR
              </span>
              <div className="h-[3px] flex-1 rounded-full bg-white/10">
                <div
                  ref={progressFillRef}
                  className="h-full origin-left rounded-full"
                  style={{ transform: "scaleX(0)", background: FUNNEL_COLORS.amber }}
                />
              </div>
            </div>

            <div className={reduced ? "relative mt-6" : "relative mt-6 h-[230px] lg:h-[200px]"}>
              {STAGES.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                  className={reduced ? "relative mb-12" : "absolute inset-0"}
                >
                  <h3
                    data-heading
                    className="font-heading text-2xl font-bold leading-snug lg:text-[1.7rem]"
                    style={{ color: FUNNEL_COLORS.white }}
                  >
                    {s.heading}
                  </h3>
                  <ul className="mt-6 flex flex-col gap-2">
                    {s.markers.map((m) => (
                      <li key={m} data-marker className="text-sm" style={{ color: FUNNEL_COLORS.gray }}>
                        {m}
                      </li>
                    ))}
                  </ul>
                  {i === 4 && (
                    <>
                      <p
                        data-final
                        className="mt-4 max-w-sm font-heading text-sm font-semibold uppercase leading-snug"
                        style={{ color: FUNNEL_COLORS.white }}
                      >
                        {FINAL_LINE_1}
                        <br />
                        {FINAL_LINE_2}
                      </p>
                      <div data-cta className="mt-4">
                        <MagneticButton href={WHATSAPP_LINK} variant="primary" external>
                          {FINAL_CTA}
                        </MagneticButton>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative mx-auto"
            style={{ height: "min(76svh, 660px)", aspectRatio: `${VIEW_W} / ${VB.h}` }}
          >
            <div
              ref={rimHaloRef}
              className="funnel-ambient-halo"
              style={{
                left: `${((RIM.cx - VIEW_X) / VIEW_W) * 100}%`,
                top: `${(RIM.cy / VB.h) * 100}%`,
                width: "50%",
                height: "13%",
              }}
            />
            <svg viewBox={VIEW_BOX} className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="funnelBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={FUNNEL_COLORS.graphite} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={FUNNEL_COLORS.bg} stopOpacity="0.96" />
                </linearGradient>
                <linearGradient id="funnelRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={FUNNEL_COLORS.copper} />
                  <stop offset="50%" stopColor={FUNNEL_COLORS.gold} />
                  <stop offset="100%" stopColor={FUNNEL_COLORS.copper} />
                </linearGradient>
                <linearGradient id="entryLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={FUNNEL_COLORS.copper} />
                  <stop offset="100%" stopColor={FUNNEL_COLORS.amber} />
                </linearGradient>
                <filter id="funnelSoftBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <filter id="funnelDotGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>

              {/* Funnel body */}
              <path
                ref={funnelBodyRef}
                d={FUNNEL_BODY_D}
                fill="url(#funnelBodyGrad)"
                stroke={FUNNEL_COLORS.copper}
                strokeOpacity="0.6"
                strokeWidth={1.75}
              />
              <ellipse
                ref={funnelRimRef}
                cx={RIM.cx}
                cy={RIM.cy}
                rx={RIM.rx}
                ry={RIM.ry}
                fill="none"
                stroke="url(#funnelRimGrad)"
                strokeWidth={2.5}
              />

              {/* Entry paths */}
              {ENTRY_PATHS.map((p, i) => (
                <path
                  key={`glow-${p.key}`}
                  ref={(el) => {
                    entryGlowRefs.current[i] = el;
                  }}
                  d={p.d}
                  stroke="url(#entryLineGrad)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={0.2}
                  filter="url(#funnelSoftBlur)"
                  fill="none"
                />
              ))}
              {ENTRY_PATHS.map((p, i) => (
                <path
                  key={`line-${p.key}`}
                  ref={(el) => {
                    entryPathRefs.current[i] = el;
                  }}
                  d={p.d}
                  stroke="url(#entryLineGrad)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
              {ENTRY_PATHS.map((p, i) => (
                <g key={`particle-${p.key}`} ref={(el) => { entryParticleRefs.current[i] = el; }}>
                  <circle r={4} fill={FUNNEL_COLORS.gold} opacity={0.5} filter="url(#funnelDotGlow)" />
                  <circle r={2} fill={FUNNEL_COLORS.white} />
                </g>
              ))}

              {/* Qualifier ring + scan line */}
              <g ref={ringRef}>
                <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill="none" stroke={FUNNEL_COLORS.gold} strokeOpacity={0.7} strokeWidth={1.5} strokeDasharray="3 7" />
              </g>
              <line
                ref={scanRef}
                x1={SCAN_X.from}
                x2={SCAN_X.to}
                y1={SCAN_Y.from}
                y2={SCAN_Y.from}
                stroke={FUNNEL_COLORS.amber}
                strokeWidth={1.5}
                opacity={0}
              />

              {/* Origin modules */}
              {ORIGINS.map((origin, i) => (
                <g key={origin.key} ref={(el) => { originRefs.current[i] = el; }}>
                  <circle cx={origin.x} cy={origin.y} r={ORIGIN_R + 10} fill={origin.color} opacity={0.16} filter="url(#funnelSoftBlur)" />
                  <circle cx={origin.x} cy={origin.y} r={ORIGIN_R} fill="#0d1016" stroke={FUNNEL_COLORS.copper} strokeOpacity={0.5} strokeWidth={1.2} />
                  <foreignObject x={origin.x - 12} y={origin.y - 12} width={24} height={24}>
                    <div className="flex h-full w-full items-center justify-center">
                      <OriginIcon kind={origin.key} />
                    </div>
                  </foreignObject>
                </g>
              ))}

              {/* Leads */}
              {LEAD_KEYFRAMES.map((kf, i) => (
                <circle
                  key={LEADS[i].id}
                  ref={(el) => {
                    leadRefs.current[i] = el;
                  }}
                  cx={kf.s1.x}
                  cy={kf.s1.y}
                  r={7}
                  fill={kf.s1.fill}
                  opacity={kf.s1.opacity}
                  filter="url(#funnelDotGlow)"
                />
              ))}

              {/* Exit line */}
              <line x1={EXIT_LINE.x} x2={EXIT_LINE.x} y1={EXIT_LINE.y1} y2={EXIT_LINE.y2} stroke={FUNNEL_COLORS.amber} strokeWidth={2} strokeLinecap="round" opacity={0.6} />

              {/* Results */}
              <g ref={checkRef} transform={`translate(${RESULTS.check.x}, ${RESULTS.check.y})`}>
                <circle r={22} fill="none" stroke={FUNNEL_COLORS.amber} strokeWidth={2} />
                <path d="M-10,0 L-3,8 L11,-9" fill="none" stroke={FUNNEL_COLORS.amber} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <g ref={moneyRef} transform={`translate(${RESULTS.money.x}, ${RESULTS.money.y})`}>
                <circle r={22} fill="none" stroke={FUNNEL_COLORS.gold} strokeWidth={2} />
                <text x={0} y={7} textAnchor="middle" fontSize={18} fontWeight={700} fill={FUNNEL_COLORS.gold}>
                  R$
                </text>
              </g>
              {RESULTS.bars.x.map((x, i) => (
                <rect
                  key={x}
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  x={x - 10}
                  y={RESULTS.bars.baseline}
                  width={20}
                  height={0}
                  fill={FUNNEL_COLORS.amber}
                  opacity={0.85}
                  rx={2}
                />
              ))}
            </svg>

            {/* Stage 3 indicators */}
            <div className="pointer-events-none absolute left-1/2 top-[46%] flex -translate-x-1/2 flex-col items-center gap-1">
              {(STAGES[2].funnelIndicators ?? []).map((label, i) => (
                <span
                  key={label}
                  ref={(el) => {
                    indicatorRefs.current[i] = el;
                  }}
                  className="whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em]"
                  style={{ borderColor: "rgba(185,106,50,0.4)", color: FUNNEL_COLORS.gold, background: "rgba(5,6,8,0.85)" }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Stage 4 states */}
            <div className="pointer-events-none absolute left-1/2 top-[70%] flex -translate-x-1/2 gap-2">
              {(STAGES[3].funnelStates ?? []).map((label, i) => (
                <span
                  key={label}
                  ref={(el) => {
                    stateRefs.current[i] = el;
                  }}
                  className="whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em]"
                  style={{ borderColor: "rgba(185,106,50,0.4)", color: FUNNEL_COLORS.amber, background: "rgba(5,6,8,0.85)" }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Stage 2 demonstrative counter */}
            <div
              className="pointer-events-none absolute left-1/2 w-full max-w-[85%] -translate-x-1/2 text-center"
              style={{ top: `${(130 / VB.h) * 100}%` }}
            >
              <span ref={counterARef} className="block font-mono text-base font-bold tabular-nums" style={{ color: FUNNEL_COLORS.white }}>
                128 VISITAS
              </span>
              <span ref={counterBRef} className="-mt-5 block font-mono text-sm font-bold leading-snug tabular-nums" style={{ color: FUNNEL_COLORS.gold }}>
                34 CONTATOS CAPTURADOS
                <br />
                <span className="font-mono text-[10px] font-normal uppercase tracking-wider" style={{ color: FUNNEL_COLORS.gray }}>
                  exemplo
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/tablet — vertical journey, no pin */}
      <div
        ref={mobileRef}
        className="relative px-6 py-20 md:hidden"
        style={{ background: FUNNEL_COLORS.bg }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: FUNNEL_COLORS.copper }}>
          03 / AQUISIÇÃO DE CLIENTES
        </span>
        <p className="mt-3 max-w-sm text-base" style={{ color: FUNNEL_COLORS.gray }}>
          {DESCRIPTION}
        </p>

        <div className={reduced ? "mt-12 flex flex-col gap-16" : "mt-12 flex flex-col gap-20"}>
          {STAGES.map((s, i) => (
            <div key={s.n} data-mobile-stage className="flex flex-col items-center gap-5 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: FUNNEL_COLORS.amber }}>
                {s.eyebrow}
              </span>
              <h3 className="font-heading text-2xl font-bold leading-snug" style={{ color: FUNNEL_COLORS.white }}>
                {s.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {s.markers.map((m) => (
                  <li key={m} className="text-sm" style={{ color: FUNNEL_COLORS.gray }}>
                    {m}
                  </li>
                ))}
              </ul>

              <MobileFunnelSnapshot stage={i} />

              {i === 4 && (
                <div className="mt-2 w-full">
                  <p className="font-heading text-base font-semibold uppercase leading-snug" style={{ color: FUNNEL_COLORS.white }}>
                    {FINAL_LINE_1}
                    <br />
                    {FINAL_LINE_2}
                  </p>
                  <div className="mt-6 w-full">
                    <MagneticButton href={WHATSAPP_LINK} variant="primary" external className="w-full text-center">
                      {FINAL_CTA}
                    </MagneticButton>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MobileFunnelSnapshot({ stage }: { stage: number }) {
  const leads = LEAD_KEYFRAMES.slice(0, 5);
  const stageKey = (["s1", "s2", "s3", "s4", "s5"] as const)[stage];

  return (
    <svg viewBox={VIEW_BOX} className="h-56 w-40" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`mfBody${stage}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={FUNNEL_COLORS.graphite} stopOpacity="0.9" />
          <stop offset="100%" stopColor={FUNNEL_COLORS.bg} stopOpacity="0.96" />
        </linearGradient>
      </defs>
      <path d={FUNNEL_BODY_D} fill={`url(#mfBody${stage})`} stroke={FUNNEL_COLORS.copper} strokeOpacity={0.35} strokeWidth={1.5} />
      <ellipse cx={RIM.cx} cy={RIM.cy} rx={RIM.rx} ry={RIM.ry} fill="none" stroke={FUNNEL_COLORS.gold} strokeOpacity={0.7} strokeWidth={3} />

      {stage === 0 &&
        ORIGINS.map((origin) => (
          <circle key={origin.key} cx={origin.x} cy={origin.y} r={ORIGIN_R} fill="#0d1016" stroke={FUNNEL_COLORS.copper} strokeWidth={2} />
        ))}

      {stage >= 1 &&
        ENTRY_PATHS.map((p) => <path key={p.key} d={p.d} stroke={FUNNEL_COLORS.amber} strokeOpacity={0.6} strokeWidth={2.5} fill="none" />)}

      {stage >= 2 && <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill="none" stroke={FUNNEL_COLORS.copper} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 8" />}

      {stage >= 1 &&
        stage <= 3 &&
        leads.map((kf, i) => {
          const point = kf[stageKey];
          return <circle key={i} cx={point.x} cy={point.y} r={9} fill={point.fill} opacity={Math.max(point.opacity, 0.5)} />;
        })}

      {stage === 4 && (
        <>
          <line x1={EXIT_LINE.x} x2={EXIT_LINE.x} y1={EXIT_LINE.y1} y2={EXIT_LINE.y2} stroke={FUNNEL_COLORS.amber} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          <g transform={`translate(${RESULTS.check.x}, ${RESULTS.check.y})`}>
            <circle r={26} fill="none" stroke={FUNNEL_COLORS.amber} strokeWidth={3} />
            <path d="M-11,0 L-3,9 L12,-10" fill="none" stroke={FUNNEL_COLORS.amber} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform={`translate(${RESULTS.money.x}, ${RESULTS.money.y})`}>
            <circle r={26} fill="none" stroke={FUNNEL_COLORS.gold} strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fontSize={20} fontWeight={700} fill={FUNNEL_COLORS.gold}>
              R$
            </text>
          </g>
          {RESULTS.bars.x.map((x, i) => {
            const h = RESULTS.bars.heights[i];
            return (
              <rect
                key={x}
                x={x - 10}
                y={RESULTS.bars.baseline - h}
                width={20}
                height={h}
                fill={FUNNEL_COLORS.amber}
                opacity={0.85}
                rx={2}
              />
            );
          })}
        </>
      )}
    </svg>
  );
}
