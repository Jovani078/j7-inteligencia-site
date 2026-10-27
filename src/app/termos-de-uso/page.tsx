import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Termos de Uso | J7 Inteligência",
};

export default function TermosDeUso() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-32 md:pt-40">
        <h1 className="h-headline">Termos de Uso</h1>
        <div className="body-text mt-8 flex flex-col gap-4">
          <p>
            Ao utilizar este site e nossos formulários de contato, você concorda em fornecer
            informações verdadeiras e consente em ser contatado pela J7 Inteligência via WhatsApp
            a partir dos dados enviados.
          </p>
          <p>
            O conteúdo deste site é informativo. Os prazos e escopos de implementação de qualquer
            projeto são definidos individualmente, após diagnóstico, e formalizados em proposta
            comercial específica.
          </p>
          <p>
            Todo o conteúdo, marca e identidade visual deste site pertencem à J7 Inteligência e não
            podem ser reproduzidos sem autorização.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}