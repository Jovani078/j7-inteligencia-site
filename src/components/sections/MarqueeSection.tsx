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
    <section className="border-y border-white/5 bg-ink py-10">
      <Marquee
        items={ITEMS}
        highlight="ESCALA"
        className="overflow-hidden"
        textClassName="font-display text-[5vw] font-bold uppercase leading-none tracking-tight md:text-[2.6vw]"
      />
    </section>
  );
}
