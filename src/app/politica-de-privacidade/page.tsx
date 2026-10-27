import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Política de Privacidade | J7 Inteligência",
};

export default function PoliticaDePrivacidade() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-32 md:pt-40">
        <h1 className="h-headline">Política de Privacidade</h1>
        <div className="body-text mt-8 flex flex-col gap-4">
          <p>
            A J7 Inteligência coleta apenas as informações fornecidas voluntariamente por você em
            nossos formulários de contato e diagnóstico (nome, empresa, WhatsApp e descrição da
            dificuldade relatada), utilizadas exclusivamente para retorno comercial via WhatsApp.
          </p>
          <p>
            Não compartilhamos seus dados com terceiros para fins de marketing. Você pode solicitar
            a exclusão dos seus dados a qualquer momento entrando em contato pelo WhatsApp
            disponível no rodapé deste site.
          </p>
          <p>
            Este site não utiliza cookies de rastreamento além dos estritamente necessários ao seu
            funcionamento.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}