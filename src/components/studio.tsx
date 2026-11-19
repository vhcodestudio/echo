"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { chapterRanges, fmt, LABELS, LIMITS, toMarkdown, type Episode, type Platform } from "@/lib/echo";
import { samples } from "@/lib/samples";
import { motionTokens, springs } from "@/lib/motion";
import { Scrubber } from "./wave";
import { dicts, type Lang, type Dict } from "@/lib/i18n";

const TABS = ["chapters", "summary", "posts", "transcript"] as const;
type Tab = (typeof TABS)[number];
type FileInfo = { name: string; size: string; duration?: string };

export function Studio({ lang = "pt" }: { lang?: Lang }) {
  const t = dicts[lang].studio;
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [running, setRunning] = useState<Episode | null>(null);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [file, setFile] = useState<FileInfo | null>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const timers = useRef<number[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run(e: Episode) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setEpisode(null);
    setRunning(e);
    setStep(0);
    setTyped(0);
    const words = e.segments.slice(0, 3).map((s) => s.text).join(" ").split(" ").length;
    const k = reduce ? 0.05 : 1;
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms * k));
    at(500, () => setStep(1));
    for (let w = 1; w <= words; w++) at(500 + w * 45, () => setTyped(w));
    const t = 600 + words * 45;
    at(t, () => setStep(2));
    at(t + 700, () => setStep(3));
    at(t + 1400, () => {
      setRunning(null);
      setEpisode(e);
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
    });
  }

  function onFile(f: File | undefined) {
    setError("");
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      setFile(null);
      return setError(t.notAudio);
    }
    if (f.size > 200 * 1024 * 1024) return setError(t.tooBig);
    const info: FileInfo = { name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB` };
    setFile(info);
    const url = URL.createObjectURL(f);
    const a = new Audio();
    a.preload = "metadata";
    a.onloadedmetadata = () => { setFile({ ...info, duration: fmt(a.duration) }); URL.revokeObjectURL(url); };
    a.onerror = () => URL.revokeObjectURL(url);
    a.src = url;
    run(samples[0]);
  }

  const busy = !!running;

  return (
    <>
      <section id="estudio" aria-labelledby="studio-h" className="scroll-mt-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-2">
          <h2 id="studio-h" className="font-mono text-xs uppercase tracking-[0.2em]">{t.title}</h2>
          <span className="font-mono text-xs text-muted">{t.side}</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <label
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
            className={`relative flex min-h-56 cursor-pointer flex-col justify-between overflow-hidden rounded-[2px] border p-5 transition-colors ${drag ? "border-signal bg-signal/5" : "border-ink/25 bg-card hover:border-ink"} focus-within:border-signal`}
          >
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              <span>{t.yourAudio}</span><span>{t.upTo}</span>
            </div>
            <div>
              <p className="font-serif text-4xl leading-none">{drag ? t.drop : t.drag}</p>
              <p className="mt-2 text-sm text-muted">{t.or} <span className="text-ink underline decoration-signal decoration-2 underline-offset-4">{t.choose}</span> · MP3, WAV, M4A, OGG</p>
            </div>
            {file && (
              <div className="flex items-center gap-3 border-t border-rule pt-3 font-mono text-xs">
                <span className="grid size-7 place-items-center bg-ink text-paper" aria-hidden="true">♪</span>
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="text-muted">{file.size}{file.duration ? ` · ${file.duration}` : ""}</span>
              </div>
            )}
            <input type="file" accept="audio/*" className="sr-only" disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
          </label>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{t.listen}{t.sampleNote && <span className="ml-2 normal-case tracking-normal">· {t.sampleNote}</span>}</p>
            <ol className="mt-3 divide-y divide-rule border-y border-rule">
              {samples.map((s, i) => (
                <li key={s.id}>
                  <button onClick={() => { setFile(null); run(s); }} disabled={busy}
                    className="group grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-3 py-4 text-left disabled:opacity-40">
                    <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-serif text-xl leading-tight group-hover:text-signal">{s.title}</span>
                      <span className="mt-1 block font-mono text-[11px] text-muted">{s.show}</span>
                    </span>
                    <span className="font-mono text-xs text-muted">{fmt(s.duration)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div aria-live="polite">
          {error && <p role="alert" className="mt-4 border-l-2 border-signal pl-3 text-sm">{error}</p>}
          {file && !error && (
            <p className="mt-4 border-l-2 border-ink/30 pl-3 text-sm text-muted">
              {t.local}
            </p>
          )}
        </div>

        <AnimatePresence>
          {running && (
            <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.fast }} className="mt-10 border border-ink bg-card p-5">
              <ol className="grid grid-cols-4 gap-2" aria-label={t.progress}>
                {t.steps.map((s, i) => (
                  <li key={s} aria-current={i === step ? "step" : undefined}>
                    <div className="h-1 overflow-hidden bg-rule">
                      <motion.div className="h-full origin-left bg-signal" initial={false}
                        animate={{ scaleX: i < step ? 1 : i === step ? 0.5 : 0 }} transition={springs.snappy} />
                    </div>
                    <span className={`mt-2 block font-mono text-[11px] uppercase tracking-wider ${i <= step ? "text-ink" : "text-muted"}`}>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 min-h-24 font-serif text-xl leading-relaxed">
                {running.segments.slice(0, 3).map((s) => s.text).join(" ").split(" ").slice(0, typed).join(" ")}
                <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-signal" aria-hidden="true" />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div ref={resultRef} className="scroll-mt-6">
        {episode && <Result key={episode.id} e={episode} t={t} lang={lang} />}
      </div>
    </>
  );
}

function Result({ e, t, lang }: { e: Episode; t: Dict["studio"]; lang: Lang }) {
  const [tab, setTab] = useState<Tab>("chapters");
  const [active, setActive] = useState(0);
  const [q, setQ] = useState("");
  const ranges = chapterRanges(e.chapters, e.duration);
  const reduce = useReducedMotion();
  const words = e.segments.reduce((a, s) => a + s.text.split(" ").length, 0);

  const seekTime = (t: number) => setActive(Math.max(0, ranges.findLastIndex((r) => r.start <= t)));

  function download() {
    const url = URL.createObjectURL(new Blob([toMarkdown(e, dicts[lang].studio.md)], { type: "text/markdown" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${e.id}.md` });
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? e.segments.filter((x) => x.text.toLowerCase().includes(s)) : e.segments;
  }, [q, e.segments]);

  function onTabKey(ev: React.KeyboardEvent, i: number) {
    const d = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const next = TABS[(i + d + TABS.length) % TABS.length];
    setTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  }

  return (
    <motion.article initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distance.lg }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
      className="mt-16 border-t-[3px] border-double border-ink pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span>{e.show}</span>
        <span>{fmt(e.duration)} · {words} {t.words} · {e.chapters.length} {t.chapters}</span>
      </div>
      <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] sm:text-5xl">{e.title}</h2>

      <div className="mt-8">
        <Scrubber goTo={t.goTo} seed={e.id} ranges={ranges} duration={e.duration} active={active} onSeek={(i) => { setActive(i); setTab("chapters"); }} />
        <p className="mt-8 flex items-baseline gap-3 font-mono text-xs">
          <span className="text-signal">{fmt(ranges[active].start)}</span>
          <span className="font-serif text-lg">{ranges[active].title}</span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-b border-rule">
        <div role="tablist" aria-label={t.resultLabel} className="flex gap-5 sm:gap-6">
          {TABS.map((id, i) => (
            <button key={id} role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls="panel" tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)} onKeyDown={(ev) => onTabKey(ev, i)}
              className={`relative shrink-0 pb-3 text-sm ${tab === id ? "text-ink" : "text-muted hover:text-ink"}`}>
              {t.tabs[i]}
              {tab === id && <motion.span layoutId="tab-line" className="absolute inset-x-0 -bottom-px h-[2px] bg-signal" transition={springs.snappy} />}
            </button>
          ))}
        </div>
        <button onClick={download} className="mb-2 border border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider hover:bg-ink hover:text-paper">
          {t.export}
        </button>
      </div>

      <div id="panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distance.sm }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: motionTokens.duration.fast }}>
            {tab === "chapters" && (
              <ol className="relative ml-1 border-l border-rule">
                {ranges.map((c, i) => (
                  <li key={c.start} className="relative pl-6">
                    <span className={`absolute -left-[5px] top-[1.35rem] size-[9px] rounded-full border ${i === active ? "border-signal bg-signal" : i < active ? "border-ink bg-ink" : "border-ink/40 bg-paper"}`} />
                    <button onClick={() => setActive(i)} aria-current={i === active}
                      className="grid w-full grid-cols-[4rem_1fr_auto] items-baseline gap-3 py-3 text-left">
                      <span className="font-mono text-sm text-signal">{fmt(c.start)}</span>
                      <span className={`font-serif text-xl leading-snug sm:text-2xl ${i === active ? "text-ink" : "text-muted hover:text-ink"}`}>{c.title}</span>
                      <span className="font-mono text-[11px] text-muted">{fmt(c.end - c.start)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {tab === "summary" && (
              <div className="grid gap-10 md:grid-cols-[1fr_14rem]">
                <ol className="space-y-6">
                  {e.summary.map((s, i) => (
                    <li key={i} className="grid grid-cols-[2.5rem_1fr] text-lg leading-relaxed">
                      <span className="font-serif text-3xl italic leading-none text-signal">{i + 1}</span>{s}
                    </li>
                  ))}
                </ol>
                <aside className="border-t border-ink pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{t.reading}</p>
                  <p className="mt-1 font-serif text-5xl">~1 min</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{t.episode}</p>
                  <p className="mt-1 font-serif text-5xl">{Math.round(e.duration / 60)} min</p>
                </aside>
              </div>
            )}
            {tab === "posts" && (
              <div className="grid gap-5 md:grid-cols-2">
                {e.posts.map((p) => <Post key={p.platform} platform={p.platform} text={p.text} show={e.show} wide={p.platform === "linkedin"} t={t} />)}
              </div>
            )}
            {tab === "transcript" && (
              <div>
                <label className="flex items-center gap-3 border-b border-ink pb-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{t.search}</span>
                  <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder={t.searchHint}
                    className="min-w-0 flex-1 bg-transparent py-1 font-serif text-xl outline-none placeholder:text-muted/60" />
                  <span className="font-mono text-[11px] text-muted">{filtered.length}</span>
                </label>
                <div className="mt-4 space-y-1">
                  {filtered.map((s) => (
                    <p key={s.start} className="grid grid-cols-[4rem_1fr] gap-3 py-1.5 leading-relaxed">
                      <button onClick={() => seekTime(s.start)} className="self-start text-left font-mono text-sm text-muted hover:text-signal">{fmt(s.start)}</button>
                      <span><Highlight text={s.text} q={q} /></span>
                    </p>
                  ))}
                  {!filtered.length && <p className="py-6 text-muted">{t.none(q)}</p>}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  const s = q.trim();
  if (!s) return <>{text}</>;
  const i = text.toLowerCase().indexOf(s.toLowerCase());
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark className="bg-signal/20 text-ink">{text.slice(i, i + s.length)}</mark>{text.slice(i + s.length)}</>;
}

function Post({ platform, text, show, wide, t }: { platform: Platform; text: string; show: string; wide: boolean; t: Dict["studio"] }) {
  const [copied, setCopied] = useState(false);
  const over = text.length > LIMITS[platform];
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard bloqueado */ }
  }
  const handle = show.split("·")[0].trim();
  return (
    <figure className={`flex flex-col border border-rule bg-card ${wide ? "md:col-span-2" : ""}`}>
      <figcaption className="flex items-center gap-3 border-b border-rule px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-serif text-lg text-paper" aria-hidden="true">{handle[0]}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{handle}</span>
          <span className="block font-mono text-[11px] text-muted">{LABELS[platform]} · {t.draft}</span>
        </span>
        <span className={`font-mono text-[11px] ${over ? "text-signal" : "text-muted"}`}>{text.length}/{LIMITS[platform]}</span>
      </figcaption>
      {platform === "instagram" && (
        <div className="grid aspect-[4/3] place-items-center bg-ink p-6 text-center font-serif text-3xl italic leading-tight text-paper" aria-hidden="true">
          “{text.split("\n")[0].replace(/[☕✏️]/g, "").trim()}”
        </div>
      )}
      <p className="flex-1 whitespace-pre-line px-4 py-4 leading-relaxed">{text}</p>
      <div className="px-4 pb-4">
        <motion.button whileTap={{ scale: motionTokens.scale.press }} onClick={copy}
          className="bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-paper hover:bg-signal">
          {copied ? t.copied : t.copy}
        </motion.button>
      </div>
    </figure>
  );
}
