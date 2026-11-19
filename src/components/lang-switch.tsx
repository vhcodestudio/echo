import { htmlLang, langLabel, langPath, LANGS, type Lang } from "@/lib/i18n";

/** PT / EN / ES links. Each language is its own page, so plain links are enough. */
export function LangSwitch({ lang, label, className = "" }: { lang: Lang; label: string; className?: string }) {
  return (
    <ul aria-label={label} className={`flex items-center gap-1 ${className}`}>
      {LANGS.map((l) => (
        <li key={l}>
          <a href={langPath(l)} hrefLang={htmlLang[l]} lang={htmlLang[l]} title={langLabel[l]} aria-current={l === lang ? "page" : undefined}
            className={`inline-grid min-h-8 min-w-8 place-items-center px-1.5 uppercase ${l === lang ? "underline decoration-2 underline-offset-4" : "opacity-60 hover:opacity-100"}`}>
            <span aria-hidden="true">{l}</span><span className="sr-only">{langLabel[l]}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
