"use client";

import { useEffect, useRef, useState } from "react";
import { chapterRanges, fmt, LABELS, LIMITS, toMarkdown, type Episode } from "@/lib/echo";
import { samples } from "@/lib/samples";

const STEPS = ["Lendo o áudio", "Transcrevendo", "Encontrando capítulos", "Escrevendo resumo e posts"];
const TABS = ["Capítulos", "Resumo", "Posts", "Transcrição"] as const;
type Tab = (typeof TABS)[number];

function bars(seed: string, n = 72) {
  let h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return Array.from({ length: n }, () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return 0.2 + ((h >>> 16) % 1000) / 1250;
  });
}

function Wave({ seed, live = false, progress }: { seed: string; live?: boolean; progress?: number }) {
  const b = bars(seed);
  return (
    <svg viewBox={`0 0 ${b.length * 6} 60`} className="h-14 w-full" aria-hidden="true" preserveAspectRatio="none">
      {b.map((v, i) => (
        <rect
          key={i}
          x={i * 6}
          y={30 - v * 28}
          width="3"
          height={v * 56}
          rx="1.5"
          className={live ? "bar-live" : ""}
          style={live ? { animationDelay: `${(i % 12) * 80}ms` } : undefined}
          fill={progress !== undefined && i / b.length < progress ? "var(--color-signal)" : "var(--color-ink)"}
          opacity={progress !== undefined && i / b.length >= progress ? 0.25 : 1}
        />
      ))}
    </svg>
  );
}

export function Studio() {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [step, setStep] = useState(-1);
  const [note, setNote] = useState("");
  const [tab, setTab] = useState<Tab>("Capítulos");
  const [active, setActive] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run(e: Episode, message = "") {
    timers.current.forEach(clearTimeout);
    setEpisode(null);
    setNote(message);
    setTab("Capítulos");
    setActive(0);
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i), i * (fast ? 50 : 650)));
    });
    timers.current.push(
      window.setTimeout(() => {
        setStep(-1);
        setEpisode(e);
      }, STEPS.length * (fast ? 50 : 650)),
    );
  }

  function onFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("audio/")) return setNote("Esse arquivo não parece ser de áudio. Tente MP3, WAV ou M4A.");
    run(samples[0], `Recebemos “${f.name}”. Na versão pública o áudio não sai do seu navegador, então mostramos um episódio de exemplo.`);
  }

  const processing = step >= 0;

  return (
    <section className="mt-12" aria-labelledby="start">
      <h2 id="start" className="sr-only">Começar</h2>
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <label className="group flex cursor-pointer flex-col justify-between rounded-sm border border-dashed border-ink/40 bg-card p-5 transition-colors hover:border-signal focus-within:border-signal">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Seu áudio</span>
          <span className="mt-6 font-serif text-3xl">Solte um arquivo aqui</span>
          <span className="mt-1 text-sm text-muted">ou toque para escolher · MP3, WAV, M4A</span>
          <input type="file" accept="audio/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Ou teste com um exemplo</span>
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => run(s)}
              disabled={processing}
              className="rounded-sm border border-rule bg-card p-3 text-left transition-colors hover:border-ink disabled:opacity-50"
            >
              <span className="block text-sm font-medium leading-snug">{s.title}</span>
              <span className="mt-1 block font-mono text-xs text-muted">{s.show} · {fmt(s.duration)}</span>
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {note && <p className="mt-4 border-l-2 border-signal pl-3 text-sm text-muted">{note}</p>}
        {processing && (
          <div className="mt-10">
            <Wave seed="processing" live />
            <ol className="mt-4 space-y-1 font-mono text-sm">
              {STEPS.map((s, i) => (
                <li key={s} className={i < step ? "text-muted line-through" : i === step ? "text-ink" : "text-muted/50"}>
                  {i === step ? "→ " : "  "}{s}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {episode && <Result e={episode} tab={tab} setTab={setTab} active={active} setActive={setActive} />}
    </section>
  );
}

function Result({ e, tab, setTab, active, setActive }: {
  e: Episode; tab: Tab; setTab: (t: Tab) => void; active: number; setActive: (i: number) => void;
}) {
  const ranges = chapterRanges(e.chapters, e.duration);

  function download() {
    const url = URL.createObjectURL(new Blob([toMarkdown(e)], { type: "text/markdown" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${e.id}.md` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article className="rise mt-12 border-t-2 border-ink pt-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">{e.show}</p>
      <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">{e.title}</h2>
      <div className="mt-6"><Wave seed={e.id} progress={ranges[active].start / e.duration} /></div>

      <div role="tablist" aria-label="Resultado" className="mt-6 flex gap-5 overflow-x-auto border-b border-rule">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls="panel"
            onClick={() => setTab(t)}
            className={`-mb-px shrink-0 border-b-2 py-2 text-sm ${tab === t ? "border-signal text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {t}
          </button>
        ))}
        <button onClick={download} className="ml-auto shrink-0 py-2 font-mono text-xs text-muted underline hover:text-ink">
          baixar .md
        </button>
      </div>

      <div id="panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-6">
        {tab === "Capítulos" && (
          <ol>
            {ranges.map((c, i) => (
              <li key={c.start}>
                <button
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={`grid w-full grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 border-b border-rule py-3 text-left ${i === active ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  <span className="font-mono text-sm text-signal">{fmt(c.start)}</span>
                  <span className="font-serif text-xl">{c.title}</span>
                  <span className="font-mono text-xs">{fmt(c.end - c.start)}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
        {tab === "Resumo" && (
          <ul className="space-y-4">
            {e.summary.map((s, i) => (
              <li key={i} className="grid grid-cols-[2rem_1fr] text-lg leading-relaxed">
                <span className="font-mono text-sm text-signal">{String(i + 1).padStart(2, "0")}</span>{s}
              </li>
            ))}
          </ul>
        )}
        {tab === "Posts" && (
          <div className="space-y-6">
            {e.posts.map((p) => <Post key={p.platform} platform={p.platform} text={p.text} />)}
          </div>
        )}
        {tab === "Transcrição" && (
          <div className="space-y-3">
            {e.segments.map((s) => (
              <p key={s.start} className="grid grid-cols-[4.5rem_1fr] gap-3 leading-relaxed">
                <span className="font-mono text-sm text-muted">{fmt(s.start)}</span>{s.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Post({ platform, text }: { platform: keyof typeof LABELS; text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="rounded-sm border border-rule bg-card p-5">
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest">
        <span>{LABELS[platform]}</span>
        <span className="text-muted">{text.length}/{LIMITS[platform]}</span>
      </div>
      <p className="mt-3 whitespace-pre-line leading-relaxed">{text}</p>
      <button onClick={copy} className="mt-4 rounded-sm bg-ink px-3 py-1.5 font-mono text-xs text-paper hover:bg-signal">
        {copied ? "copiado" : "copiar"}
      </button>
    </div>
  );
}
