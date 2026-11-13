import type { Metadata, Viewport } from "next";
import { Instrument_Serif, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });
const sans = Inter_Tight({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "echo — áudio vira conteúdo",
  description: "Suba um episódio e receba transcrição, capítulos com timestamps, resumo e posts para LinkedIn, X e Instagram.",
  metadataBase: new URL("https://echo-vhcode.vercel.app"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph:{ title: "echo — áudio vira conteúdo", description: "Transcrição, capítulos, resumo e posts a partir de um áudio.", type: "website" },
};

export const viewport: Viewport = { themeColor: "#f3eee4" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${mono.variable} ${sans.variable} antialiased`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "echo",
              url: "https://echo-vhcode.vercel.app",
              applicationCategory: "MultimediaApplication",
              description: "Transforma áudio em transcrição, capítulos, resumo e posts para redes sociais.",
              author: { "@type": "Organization", name: "vhcodestudio" },
            }),
          }}
        />
      </body>
    </html>
  );
}
