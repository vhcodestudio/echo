export type Platform = "linkedin" | "x" | "instagram";
export type Segment = { start: number; text: string };
export type Chapter = { start: number; title: string };
export type Episode = {
  id: string;
  title: string;
  show: string;
  duration: number;
  segments: Segment[];
  chapters: Chapter[];
  summary: string[];
  posts: { platform: Platform; text: string }[];
};

export const LIMITS: Record<Platform, number> = { linkedin: 3000, x: 280, instagram: 2200 };
export const LABELS: Record<Platform, string> = { linkedin: "LinkedIn", x: "X", instagram: "Instagram" };

export function fmt(sec: number) {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function chapterRanges(chapters: Chapter[], duration: number) {
  return chapters.map((c, i) => ({ ...c, end: chapters[i + 1]?.start ?? duration }));
}

export const postFits = (p: Platform, text: string) => text.length <= LIMITS[p];

export function toMarkdown(e: Episode, h = { chapters: "Capítulos", summary: "Resumo", transcript: "Transcrição" }) {
  return [
    `# ${e.title}`,
    `_${e.show} · ${fmt(e.duration)}_`,
    "",
    `## ${h.chapters}`,
    ...e.chapters.map((c) => `- ${fmt(c.start)} ${c.title}`),
    "",
    `## ${h.summary}`,
    ...e.summary.map((s) => `- ${s}`),
    "",
    ...e.posts.flatMap((p) => [`## ${LABELS[p.platform]}`, p.text, ""]),
    `## ${h.transcript}`,
    ...e.segments.map((s) => `[${fmt(s.start)}] ${s.text}`),
  ].join("\n");
}
