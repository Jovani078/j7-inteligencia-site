import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import { montserrat } from "@/lib/fonts";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function Rupture() {
  return (
    <section className="relative bg-graphite px-6 py-20 md:px-14 lg:px-20">
      <div className={`mx-auto max-w-6xl ${montserrat.variable}`}>
        <span className="eyebrow-tag mb-6 block text-electric">
          002 / O problema
        </span>
        <RevealText as="h2" className="h-headline block text-white">
          CADA MINUTO SEM RESPOSTA
        </RevealText>
        <RevealText as="p" className="h-destaque mt-1 block text-electric">
          É UM CLIENTE A CAMINHO DO CONCORRENTE.
        </RevealText>

        <p className="texto-apoio mt-8 max-w-2xl text-porcelain/65">
          Sua equipe perde tempo respondendo perguntas repetidas, organizando contatos
          manualmente e tentando lembrar quem precisa de retorno.
        </p>
        <p className="texto-apoio mt-4 max-w-2xl text-porcelain/65">
          Enquanto sua equipe dorme, o cliente que chamou às 22h já foi procurar o concorrente.
        </p>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
          <video
            className="h-full w-full object-cover"
            src="/videos/rupture.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        {/* Closing */}
        <div className="mx-auto mt-20 max-w-2xl text-center md:mt-24">
          <p className="text-2xl font-extrabold uppercase leading-snug text-white md:text-3xl">
            DO PRIMEIRO CONTATO AO FOLLOW-UP:{" "}
            <span className="font-semibold text-electric">A IA MANTÉM SUA OPERAÇÃO EM MOVIMENTO.</span>
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton href={WHATSAPP_LINK} variant="primary" external>
              Quero parar de perder cliente pra concorrência
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
