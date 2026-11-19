import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { dicts, htmlLang, langPath, LANGS, type Lang } from "@/lib/i18n";

const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });
const sans = Inter_Tight({ variable: "--font-sans", subsets: ["latin"] });

export function metadataFor(lang: Lang): Metadata {
  const { title, description } = dicts[lang].meta;
  return {
    title, description,
    metadataBase: new URL("https://echo-vhcode.vercel.app"),
    alternates: { canonical: langPath(lang), languages: { ...Object.fromEntries(LANGS.map((l) => [htmlLang[l], langPath(l)])), "x-default": "/" } },
    robots: { index: true, follow: true },
    referrer: "strict-origin-when-cross-origin",
    openGraph: { title, description, type: "website" },
  };
}

export function Shell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={htmlLang[lang]} className={`${serif.variable} ${mono.variable} ${sans.variable} antialiased`}>
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
              description: dicts[lang].meta.description,
              author: { "@type": "Organization", name: "vhcodestudio" },
            }),
          }}
        />
      </body>
    </html>
  );
}
