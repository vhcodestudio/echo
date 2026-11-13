import { Studio } from "@/components/studio";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <header className="flex items-baseline justify-between border-b border-rule pb-4 font-mono text-xs uppercase tracking-widest text-muted">
        <span className="text-ink">echo</span>
        <span>modo demo</span>
      </header>
      <h1 className="mt-10 font-serif text-5xl leading-[0.95] sm:text-7xl">
        Você grava.<br />
        <em className="text-signal">A gente escreve</em> o resto.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Suba um episódio e receba transcrição com timestamps, capítulos, um resumo que dá para ler em um minuto e posts
        prontos para LinkedIn, X e Instagram.
      </p>
      <Studio />
      <footer className="mt-24 border-t border-rule pt-4 font-mono text-xs text-muted">
        Feito por <a className="underline hover:text-ink" href="https://github.com/vhcodestudio">vhcodestudio</a>. Nesta versão
        pública a transcrição usa episódios de exemplo; a transcrição real roda localmente com FunASR.
      </footer>
    </main>
  );
}
