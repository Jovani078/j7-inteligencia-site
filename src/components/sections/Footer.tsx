import Image from "next/image";
import {
  PHONE_DISPLAY,
  PHONE_DISPLAY_SECONDARY,
  PHONE_NUMBER_SECONDARY,
  WHATSAPP_LINK,
  INSTAGRAM_LINK,
  GOOGLE_REVIEWS_LINK,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-graphite px-6 pb-10 pt-20 md:px-14 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 shrink-0">
                <Image src="/j7-icon.png" alt="J7 Inteligência" fill sizes="48px" />
              </span>
              <p className="text-xl font-extrabold text-white">
                J7 <span className="text-electric">Inteligência</span>
              </p>
            </div>
            <p className="body-text mt-4 max-w-xs text-porcelain/55">
              Inteligência que vira operação. IA, automação e aquisição de clientes para empresas.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="label-badge mb-1 text-porcelain/40">
              Contato
            </span>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-porcelain/70 hover:text-electric">
              {PHONE_DISPLAY}
            </a>
            <a href={`tel:+${PHONE_NUMBER_SECONDARY}`} className="text-porcelain/70 hover:text-electric">
              {PHONE_DISPLAY_SECONDARY}
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-porcelain/70 hover:text-electric">
              WhatsApp
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-porcelain/70 hover:text-electric">
              Instagram: @jovanicharao
            </a>
            <a href={GOOGLE_REVIEWS_LINK} target="_blank" rel="noopener noreferrer" className="text-porcelain/70 hover:text-electric">
              Google Meu Negócio
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="label-badge mb-1 text-porcelain/40">
              Empresa
            </span>
            <span className="text-porcelain/70">
              Horário: segunda a sexta, a partir das 8h
            </span>
            <a href="/politica-de-privacidade" className="text-porcelain/70 hover:text-electric">
              Política de Privacidade
            </a>
            <a href="/termos-de-uso" className="text-porcelain/70 hover:text-electric">
              Termos de Uso
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-center">
          <p className="text-lg font-semibold text-white">
            Menos processos manuais. Mais inteligência para crescer.
          </p>
          <p className="text-xs text-porcelain/35">
            © {new Date().getFullYear()} J7 Inteligência. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
