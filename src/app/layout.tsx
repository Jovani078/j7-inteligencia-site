import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://resolveia.com.br"),
  title: "J7 Inteligência | Inteligência que vira operação",
  description:
    "A J7 Inteligência implementa agentes de IA para WhatsApp, automações, sites e CRM para empresas organizarem o atendimento e as oportunidades comerciais. Atendimento em Dois Irmãos, Vale dos Sinos, Porto Alegre, RS e todo o Brasil.",
  keywords: [
    "inteligência artificial para empresas",
    "automação WhatsApp",
    "IA para WhatsApp",
    "agência de automação Dois Irmãos",
    "CRM para WhatsApp",
    "atendimento automatizado RS",
  ],
  openGraph: {
    title: "J7 Inteligência | Seu cliente chama. Sua IA atende.",
    description:
      "Agentes de IA para WhatsApp, automação e CRM para empresas organizarem o atendimento sem sobrecarregar a operação.",
    locale: "pt_BR",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "J7 Inteligência",
  description:
    "Agentes de inteligência artificial para WhatsApp, automação e CRM para empresas.",
  telephone: "+55-51-99861-9776",
  areaServed: [
    "Dois Irmãos",
    "Vale dos Sinos",
    "Porto Alegre",
    "Rio Grande do Sul",
    "Brasil",
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "RS",
    addressCountry: "BR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "6",
  },
  sameAs: ["https://instagram.com/jovanicharao"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-bg text-ink font-body antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}