import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { PreloadProvider } from "@/lib/preload-context";
import { montserrat } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://resolveia.com.br"),
  title: "J7 Inteligência | Inteligência que vira operação",
  description:
    "A J7 Inteligência implementa inteligência artificial, automações, sites e estratégias de aquisição para sua empresa vender mais sem aumentar o peso da operação. Atendimento em Dois Irmãos, Vale dos Sinos, Porto Alegre, RS e todo o Brasil.",
  keywords: [
    "inteligência artificial para empresas",
    "automação WhatsApp",
    "IA para WhatsApp",
    "agência de automação Dois Irmãos",
    "site inteligente RS",
    "aquisição de clientes Vale dos Sinos",
  ],
  openGraph: {
    title: "J7 Inteligência | Sua empresa não precisa de mais trabalho, precisa de uma operação mais inteligente.",
    description:
      "Inteligência artificial, automação e aquisição de clientes para empresas que querem escalar sem sobrecarregar a operação.",
    locale: "pt_BR",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "J7 Inteligência",
  description:
    "Inteligência artificial, automação, sites inteligentes e aquisição de clientes para empresas.",
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
    <html lang="pt-BR" className={montserrat.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-ink text-porcelain font-body antialiased">
        <PreloadProvider>
          <Preloader />
          <Cursor />
          <ScrollProgress />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </PreloadProvider>
      </body>
    </html>
  );
}
