"use client";

import { useForm } from "react-hook-form";
import { PHONE_NUMBER, WHATSAPP_LINK } from "@/lib/constants";

type FormValues = {
  nome: string;
  empresa: string;
  whatsapp: string;
  dificuldade: string;
};

const FIELD_CLASS =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-accent";

export default function Diagnostic() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormValues>();

  // Submit integration: opens WhatsApp (WHATSAPP_LINK's number) with the
  // form data pre-filled as a message — no backend/API route involved.
  // Preserved as-is from the previous version, only restyled.
  const onSubmit = (data: FormValues) => {
    const message = [
      "Olá! Quero solicitar um diagnóstico.",
      `Nome: ${data.nome}`,
      `Empresa: ${data.empresa}`,
      `WhatsApp: ${data.whatsapp}`,
      `Principal dificuldade: ${data.dificuldade}`,
    ].join("\n");
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="diagnostico" className="bg-ink px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="h-headline text-white">Descubra o que sua empresa pode automatizar.</h2>
          <p className="texto-apoio mt-6 max-w-md text-white/65">
            Converse com a J7 para identificar tarefas repetitivas, entender as possibilidades e
            definir os próximos passos.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-whatsapp hover:underline"
          >
            Prefiro conversar pelo WhatsApp →
          </a>

          <p className="body-text mt-10 text-sm text-white/45">
            Ao enviar, você concorda com nossa{" "}
            <a href="/politica-de-privacidade" className="underline underline-offset-2 hover:text-accent">
              Política de Privacidade
            </a>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nome" className="sr-only">
                Nome
              </label>
              <input
                id="nome"
                className={FIELD_CLASS}
                placeholder="Nome"
                aria-invalid={!!errors.nome}
                {...register("nome", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="empresa" className="sr-only">
                Empresa
              </label>
              <input
                id="empresa"
                className={FIELD_CLASS}
                placeholder="Empresa"
                aria-invalid={!!errors.empresa}
                {...register("empresa", { required: true })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="whatsapp" className="sr-only">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              className={FIELD_CLASS}
              placeholder="WhatsApp"
              aria-invalid={!!errors.whatsapp}
              {...register("whatsapp", { required: true })}
            />
          </div>
          <div>
            <label htmlFor="dificuldade" className="sr-only">
              Principal dificuldade atual
            </label>
            <textarea
              id="dificuldade"
              className={FIELD_CLASS}
              placeholder="Principal dificuldade atual"
              rows={4}
              aria-invalid={!!errors.dificuldade}
              {...register("dificuldade", { required: true })}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="text-sm text-red-400">
              Preencha os campos obrigatórios.
            </p>
          )}
          {isSubmitSuccessful && (
            <p role="status" className="text-sm text-accent">
              Abrindo o WhatsApp com seus dados…
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full bg-white px-7 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-accent hover:text-white disabled:opacity-60"
          >
            Solicitar diagnóstico
          </button>
        </form>
      </div>
    </section>
  );
}