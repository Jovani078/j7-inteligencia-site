"use client";

import { useForm } from "react-hook-form";
import RevealText from "@/components/ui/RevealText";
import { PHONE_NUMBER, WHATSAPP_LINK } from "@/lib/constants";

type FormValues = {
  nome: string;
  empresa: string;
  whatsapp: string;
  dificuldade: string;
};

const FIELD_CLASS =
  "w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-porcelain placeholder:text-porcelain/30 outline-none transition-colors focus:border-electric";

export default function Diagnostic() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const message = [
      "Olá! Quero solicitar um diagnóstico estratégico.",
      `Nome: ${data.nome}`,
      `Empresa: ${data.empresa}`,
      `WhatsApp: ${data.whatsapp}`,
      `Principal dificuldade: ${data.dificuldade}`,
    ].join("\n");
    window.open(
      `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <section
      id="diagnostico"
      className="bg-graphite px-6 py-20 md:px-14 lg:px-20"
    >
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow-tag mb-6 block text-electric">
            010 / Diagnóstico
          </span>
          <RevealText
            as="h2"
            className="h-headline text-white"
          >
            Descubra onde sua empresa está perdendo tempo, oportunidades e dinheiro.
          </RevealText>
          <p className="texto-apoio mt-6 max-w-md text-porcelain/65">
            Em uma conversa estratégica, analisamos seu atendimento, processo comercial e
            aquisição de clientes para identificar onde a inteligência artificial pode gerar
            impacto real.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-whatsapp hover:underline"
          >
            Prefiro conversar pelo WhatsApp →
          </a>

          <div className="mt-8 rounded-2xl border border-electric/30 bg-electric/10 p-5">
            <p className="label-badge flex items-center gap-2 font-bold text-electric-light">
              <span aria-hidden="true">⏱</span> Garantia de implementação em 7 dias
            </p>
            <p className="body-text mt-2 text-porcelain/70">
              Se em até 7 dias sua operação não estiver com o atendimento automatizado rodando, a
              gente continua ajustando sem custo extra até funcionar.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={FIELD_CLASS}
              placeholder="Nome"
              {...register("nome", { required: true })}
            />
            <input
              className={FIELD_CLASS}
              placeholder="Empresa"
              {...register("empresa", { required: true })}
            />
          </div>
          <input
            className={FIELD_CLASS}
            placeholder="WhatsApp"
            {...register("whatsapp", { required: true })}
          />
          <textarea
            className={FIELD_CLASS}
            placeholder="Principal dificuldade atual"
            rows={4}
            {...register("dificuldade", { required: true })}
          />

          {Object.keys(errors).length > 0 && (
            <p className="text-sm text-red-400">Preencha os campos obrigatórios.</p>
          )}
          {isSubmitSuccessful && (
            <p className="text-sm text-electric">Abrindo o WhatsApp com seus dados…</p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-full bg-electric px-7 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-porcelain"
          >
            Solicitar diagnóstico estratégico
          </button>
        </form>
      </div>
    </section>
  );
}
