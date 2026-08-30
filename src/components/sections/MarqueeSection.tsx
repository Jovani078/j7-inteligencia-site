import Marquee from "@/components/ui/Marquee";

const ITEMS = [
  "INTELIGÊNCIA ARTIFICIAL",
  "•",
  "AUTOMAÇÃO",
  "•",
  "WHATSAPP",
  "•",
  "AQUISIÇÃO DE CLIENTES",
  "•",
  "SITES INTELIGENTES",
  "•",
  "ESCALA",
  "•",
];

export default function MarqueeSection() {
  return (
    <section className="border-y border-white/5 bg-ink py-5">
      <Marquee
        items={ITEMS}
        highlight="ESCALA"
        className="overflow-hidden"
        textClassName="font-display text-[4vw] font-bold uppercase leading-none tracking-tight md:text-[2vw]"
      />
    </section>
  );
}
