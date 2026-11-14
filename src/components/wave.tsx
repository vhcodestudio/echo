"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionTokens, springs } from "@/lib/motion";

export function bars(seed: string, n: number) {
  let h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1103515245 + 12345) >>> 0;
    const env = 0.55 + 0.45 * Math.sin((i / n) * Math.PI * 3.2) ** 2;
    return Math.min(1, 0.12 + (((h >>> 16) % 1000) / 1000) * 0.88 * env);
  });
}

/** Hero waveform: bars rise once on mount, then idle with a subtle CSS shimmer. */
export function HeroWave() {
  const reduce = useReducedMotion();
  const b = bars("echo-hero", 120);
  return (
    <svg viewBox="0 0 720 120" className="breathe h-24 w-full sm:h-32" aria-hidden="true" preserveAspectRatio="none">
      {b.map((v, i) => (
        <motion.rect
          key={i}
          x={i * 6}
          y={60 - v * 56}
          width="3"
          height={v * 112}
          rx="1.5"
          fill={i > 74 && i < 86 ? "var(--color-signal)" : "var(--color-ink)"}
          style={{ transformOrigin: "center", transformBox: "fill-box", ["--i" as string]: i % 24 }}
          initial={{ scaleY: 1 }}
          animate={reduce ? undefined : { scaleY: [0.05, 1] }}
          transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: i * 0.006 }}
        />
      ))}
    </svg>
  );
}

type Range = { start: number; end: number; title: string };

/** Chapter scrubber: waveform split into chapter blocks with a spring-driven playhead. */
export function Scrubber({ seed, ranges, duration, active, onSeek }: {
  seed: string; ranges: Range[]; duration: number; active: number; onSeek: (i: number) => void;
}) {
  const n = 140;
  const b = bars(seed, n);
  const chapterOf = (i: number) => ranges.findIndex((r) => (i / n) * duration < r.end);
  const pos = ranges[active].start / duration;
  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${n * 5} 80`} className="h-20 w-full" aria-hidden="true" preserveAspectRatio="none">
        {b.map((v, i) => {
          const c = chapterOf(i);
          const on = c === active;
          return (
            <rect key={i} x={i * 5} y={40 - v * 36} width="2.6" height={v * 72} rx="1.3"
              fill={on ? "var(--color-signal)" : "var(--color-ink)"} opacity={on ? 1 : c < active ? 0.55 : 0.2}
              style={{ transition: "fill .25s, opacity .25s" }} />
          );
        })}
      </svg>
      <motion.div className="pointer-events-none absolute inset-y-0 w-px bg-ink" initial={false}
        animate={{ left: `${pos * 100}%` }} transition={springs.snappy}>
        <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-ink" />
      </motion.div>
      <div className="absolute inset-0 flex">
        {ranges.map((r, i) => (
          <button key={r.start} onClick={() => onSeek(i)} title={r.title}
            aria-label={`Ir para o capítulo ${i + 1}: ${r.title}`}
            className="group relative h-full border-l border-paper/0 hover:bg-ink/5 focus-visible:bg-ink/5"
            style={{ width: `${((r.end - r.start) / duration) * 100}%` }}>
            <span className="absolute -bottom-6 left-0 font-mono text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
