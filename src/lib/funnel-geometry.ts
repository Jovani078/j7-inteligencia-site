// Geometry + content for the "03 — Aquisição de clientes" scroll-pinned funnel
// (src/components/sections/AcquisitionFunnel.tsx). Kept separate from the
// component so the mobile fallback and the reduced-motion static state can
// reuse the exact same coordinates/data instead of re-deriving them.

export const VB = { w: 700, h: 940 };
export const CORE_CX = 350;

export const ORIGINS = [
  { key: "facebook", x: 190, y: 70, color: "#1877F2" },
  { key: "google", x: 350, y: 60, color: "#F4C35A" },
  { key: "whatsapp", x: 510, y: 70, color: "#25D366" },
] as const;

export const ORIGIN_R = 32;

export const RIM = { cx: 350, cy: 210, rx: 205, ry: 24 };

export const ENTRY_ANCHORS = [
  { x: 230, y: 214 },
  { x: 350, y: 188 },
  { x: 470, y: 214 },
] as const;

// Funnel body silhouette stops (half-width at each y), mirrored L/R to build
// one closed faceted path — deliberately straight facets (not smoothed),
// reading as cut/smoked glass rather than an organic blob.
const BODY_STOPS = [
  { y: 210, hw: 205 },
  { y: 430, hw: 140 },
  { y: 560, hw: 125 }, // qualifier chamber — bulges slightly vs. a strict taper
  { y: 650, hw: 55 },
  { y: 760, hw: 30 },
  { y: 820, hw: 30 },
];

export const FUNNEL_BODY_D = (() => {
  const left = BODY_STOPS.map((s) => `${CORE_CX - s.hw},${s.y}`);
  const right = [...BODY_STOPS].reverse().map((s) => `${CORE_CX + s.hw},${s.y}`);
  return `M${left.join(" L")} L${right.join(" L")} Z`;
})();

export const RING = { cx: 350, cy: 560, r: 118 };
export const SCAN_X = { from: 232, to: 468 };
export const SCAN_Y = { from: 500, to: 620 };

export const EXIT_LINE = { x: 350, y1: 820, y2: 870 };

export const RESULTS = {
  check: { x: 240, y: 905 },
  money: { x: 350, y: 905 },
  bars: {
    baseline: 938,
    x: [430, 465, 500, 535],
    heights: [18, 34, 26, 46],
  },
};

function bezV(p1: readonly [number, number], p2: readonly [number, number], curvature = 0.6) {
  const dy = (p2[1] - p1[1]) * curvature;
  return {
    c1: [p1[0], p1[1] + dy] as [number, number],
    c2: [p2[0], p2[1] - dy] as [number, number],
  };
}

export const ENTRY_PATHS = ORIGINS.map((origin, i) => {
  const p1: [number, number] = [origin.x, origin.y + ORIGIN_R];
  const anchor = ENTRY_ANCHORS[i];
  const p2: [number, number] = [anchor.x, anchor.y];
  const { c1, c2 } = bezV(p1, p2);
  return {
    key: origin.key,
    d: `M${p1[0]},${p1[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`,
  };
});

export type Stage = {
  n: string;
  key: string;
  eyebrow: string;
  heading: string;
  markers: readonly [string, string, string];
  funnelIndicators?: readonly [string, string, string];
  funnelStates?: readonly [string, string, string];
};

export const STAGES: readonly Stage[] = [
  {
    n: "01",
    key: "atrair",
    eyebrow: "ETAPA 01 / ATRAIR",
    heading: "Campanhas posicionam sua empresa diante das pessoas certas.",
    markers: ["Google Ads", "Facebook e Instagram Ads", "WhatsApp"],
  },
  {
    n: "02",
    key: "capturar",
    eyebrow: "ETAPA 02 / CAPTURAR",
    heading: "O interesse vira contato dentro de uma estrutura criada para conversão.",
    markers: ["Página de conversão", "Formulário inteligente", "Contato pelo WhatsApp"],
  },
  {
    n: "03",
    key: "qualificar",
    eyebrow: "ETAPA 03 / QUALIFICAR",
    heading:
      "Os contatos são analisados para identificar quem realmente possui potencial de compra.",
    markers: ["Intenção", "Necessidade", "Momento de compra"],
    funnelIndicators: ["INTERESSE IDENTIFICADO", "DADOS ORGANIZADOS", "LEAD QUALIFICADO"],
  },
  {
    n: "04",
    key: "acompanhar",
    eyebrow: "ETAPA 04 / ACOMPANHAR",
    heading: "O lead recebe o retorno certo até estar pronto para avançar.",
    markers: ["Follow-up", "Remarketing", "Contato comercial"],
    funnelStates: ["NOVO CONTATO", "EM ACOMPANHAMENTO", "OPORTUNIDADE"],
  },
  {
    n: "05",
    key: "converter",
    eyebrow: "ETAPA 05 / CONVERTER",
    heading: "Oportunidades qualificadas chegam ao comercial prontas para avançar.",
    markers: ["Venda", "Receita", "Crescimento"],
  },
] as const;

export const STAGE_LABELS = STAGES.map((s) => `${s.n} / ${s.key.toUpperCase()}`);

// --- Leads -------------------------------------------------------------
// Fixed (not random) so server/client render identically. originIndex maps
// into ORIGINS; xJitter spreads each lead horizontally around the funnel
// centerline at the rim stage; qualifies/isHero drive stage 3-5 branching.

export type Lead = {
  id: number;
  originIndex: 0 | 1 | 2;
  qualifies: boolean;
  isHero?: boolean;
  xJitter: number;
};

export const LEADS: Lead[] = [
  { id: 0, originIndex: 0, qualifies: true, xJitter: -160 },
  { id: 1, originIndex: 0, qualifies: true, xJitter: -120 },
  { id: 2, originIndex: 0, qualifies: false, xJitter: -80 },
  { id: 3, originIndex: 1, qualifies: true, xJitter: -20 },
  { id: 4, originIndex: 1, qualifies: true, isHero: true, xJitter: 0 },
  { id: 5, originIndex: 1, qualifies: false, xJitter: 20 },
  { id: 6, originIndex: 1, qualifies: true, xJitter: 40 },
  { id: 7, originIndex: 2, qualifies: true, xJitter: 90 },
  { id: 8, originIndex: 2, qualifies: false, xJitter: 130 },
  { id: 9, originIndex: 2, qualifies: true, xJitter: 160 },
  { id: 10, originIndex: 2, qualifies: true, xJitter: 190 },
  { id: 11, originIndex: 0, qualifies: false, xJitter: -180 },
];

const AMBER = "#F59E0B";
const GOLD = "#F4C35A";
const GRAY = "#9CA3AF";

export type LeadKeyframe = { x: number; y: number; scale: number; opacity: number; fill: string };
export type LeadKeyframes = { s1: LeadKeyframe; s2: LeadKeyframe; s3: LeadKeyframe; s4: LeadKeyframe; s5: LeadKeyframe };

export function buildLeadKeyframes(lead: Lead): LeadKeyframes {
  const origin = ORIGINS[lead.originIndex];
  const originX = origin.x;
  const originY = origin.y + ORIGIN_R;
  const entryX = CORE_CX + lead.xJitter;
  const sideSign = lead.xJitter >= 0 ? 1 : -1;

  const s1: LeadKeyframe = { x: originX, y: originY, scale: 0.6, opacity: 0, fill: AMBER };
  const s2: LeadKeyframe = { x: entryX, y: 214, scale: 0.85, opacity: 1, fill: AMBER };

  const s3: LeadKeyframe = lead.qualifies
    ? { x: CORE_CX + lead.xJitter * 0.4, y: 560, scale: 1, opacity: 1, fill: GOLD }
    : { x: CORE_CX + sideSign * 210, y: 560, scale: 0.8, opacity: 0.4, fill: GRAY };

  const s4: LeadKeyframe = lead.qualifies
    ? { x: CORE_CX + lead.xJitter * 0.12, y: 680, scale: 0.9, opacity: 1, fill: GOLD }
    : { x: CORE_CX + sideSign * 230, y: 560, scale: 0.6, opacity: 0.15, fill: GRAY };

  const s5: LeadKeyframe = lead.isHero
    ? { x: CORE_CX, y: 850, scale: 1.1, opacity: 1, fill: GOLD }
    : lead.qualifies
      ? { x: CORE_CX, y: 780, scale: 0.7, opacity: 0.5, fill: GOLD }
      : { x: CORE_CX + sideSign * 230, y: 560, scale: 0.5, opacity: 0, fill: GRAY };

  return { s1, s2, s3, s4, s5 };
}

export const FUNNEL_COLORS = {
  bg: "#050608",
  graphite: "#11151C",
  copper: "#B96A32",
  amber: AMBER,
  gold: GOLD,
  white: "#F5F7FA",
  gray: GRAY,
};
