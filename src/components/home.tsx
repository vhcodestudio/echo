import Link from "next/link";
import { Studio } from "@/components/studio";
import { HeroWave } from "@/components/wave";
import { LangSwitch } from "@/components/lang-switch";
import { dicts, type Lang } from "@/lib/i18n";

export function Home({ lang }: { lang: Lang }) {
  const d = dicts[lang];
  return (
    <div className="grain">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        {d.skip}
      </a>
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="flex items-center justify-between border-b border-ink py-4">
          <Link href="/" className="font-serif text-2xl italic leading-none">echo</Link>
          <nav aria-label={d.nav.label} className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em]">
            <a href="#estudio" className="hover:text-signal">{d.nav.studio}</a>
            <a href="#como" className="hidden hover:text-signal sm:inline">{d.nav.how}</a>
            <span className="flex items-center gap-1.5 border border-ink px-2 py-1"><span className="size-1.5 animate-pulse rounded-full bg-signal" />Demo</span>
            <LangSwitch lang={lang} label={d.nav.language} />
          </nav>
        </header>

        <main id="conteudo">
          <section className="grid gap-10 pb-16 pt-12 sm:pt-20 lg:grid-cols-[1fr_17rem] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{d.hero.eyebrow}</p>
              <h1 className="mt-5 font-serif text-[clamp(3.25rem,10vw,8.5rem)] leading-[0.88] tracking-[-0.02em]">
                {d.hero.h1[0]}<br />
                <em className="text-signal">{d.hero.h1[1]}</em><br />
                {d.hero.h1[2]}
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
                {d.hero.lead}
              </p>
              <a href="#estudio" className="mt-8 inline-flex items-center gap-3 bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-paper hover:bg-signal">
                {d.hero.cta} <span aria-hidden="true">↓</span>
              </a>
            </div>
            <aside aria-label={d.hero.tracksLabel} className="self-end">
              <p className="border-b border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.2em]">{d.hero.tracks}</p>
              <ol>
                {d.hero.items.map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[2rem_1fr] border-b border-rule py-3">
                    <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <span><span className="block font-serif text-xl leading-none">{t}</span><span className="mt-1 block text-sm text-muted">{d}</span></span>
                  </li>
                ))}
              </ol>
            </aside>
          </section>

          <div className="border-y border-ink py-4">
            <HeroWave />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted" aria-hidden="true">
              {["00:00", "05:00", "10:00", "15:00", "20:00", "25:00"].map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>

          <div className="py-16"><Studio lang={lang} /></div>

          <section id="como" aria-labelledby="como-h" className="scroll-mt-8 border-t border-ink py-16">
            <h2 id="como-h" className="font-mono text-xs uppercase tracking-[0.2em]">{d.how.title}</h2>
            <ol className="mt-8 grid gap-10 md:grid-cols-3">
              {d.how.items.map(([t, d], i) => (
                <li key={t}>
                  <span className="font-serif text-7xl italic leading-none text-signal">{i + 1}</span>
                  <h3 className="mt-3 font-serif text-3xl">{t}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{d}</p>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <footer className="flex flex-wrap justify-between gap-3 border-t border-ink py-6 font-mono text-[11px] text-muted">
          <span>echo · {d.footer.project} <a className="text-ink underline" href="https://github.com/vhcodestudio">vhcodestudio</a></span>
          <span>{d.footer.note}</span>
        </footer>
      </div>
    </div>
  );
}
