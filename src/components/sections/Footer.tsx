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
    <footer className="bg-ink px-6 pb-10 pt-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="relative block h-10 w-28">
              <Image
                src="/j7-logo.png"
                alt="J7 Inteligência"
                fill
                sizes="112px"
                className="object-contain object-left"
              />
            </span>
            <p className="body-text mt-4 max-w-xs text-white/55">
              Inteligência que vira operação.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="label-badge mb-1 text-white/40">Contato</span>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent">
              {PHONE_DISPLAY}
            </a>
            <a href={`tel:+${PHONE_NUMBER_SECONDARY}`} className="text-white/70 hover:text-accent">
              {PHONE_DISPLAY_SECONDARY}
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent">
              WhatsApp
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent">
              Instagram: @jovanicharao
            </a>
            <a href={GOOGLE_REVIEWS_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent">
              Google Meu Negócio
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="label-badge mb-1 text-white/40">Empresa</span>
            <span className="text-white/70">Horário: segunda a sexta, a partir das 8h</span>
            <a href="/politica-de-privacidade" className="text-white/70 hover:text-accent">
              Política de Privacidade
            </a>
            <a href="/termos-de-uso" className="text-white/70 hover:text-accent">
              Termos de Uso
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} J7 Inteligência. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}