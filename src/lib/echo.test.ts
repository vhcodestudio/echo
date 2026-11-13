import { describe, expect, it } from "vitest";
import { fmt, chapterRanges, postFits, LIMITS, toMarkdown } from "./echo";
import { samples } from "./samples";

describe("fmt", () => {
  it("formats seconds as mm:ss and h:mm:ss", () => {
    expect(fmt(0)).toBe("00:00");
    expect(fmt(75.9)).toBe("01:15");
    expect(fmt(3725)).toBe("1:02:05");
  });
});

describe("chapterRanges", () => {
  it("closes each chapter at the next start and the last at duration", () => {
    const r = chapterRanges([{ start: 0, title: "a" }, { start: 60, title: "b" }], 200);
    expect(r).toEqual([
      { start: 0, end: 60, title: "a" },
      { start: 60, end: 200, title: "b" },
    ]);
  });
});

describe("samples", () => {
  it.each(samples.map((s) => [s.id, s] as const))("%s respects platform limits", (_, s) => {
    for (const p of s.posts) expect(postFits(p.platform, p.text)).toBe(true);
  });

  it.each(samples.map((s) => [s.id, s] as const))("%s has ordered segments within duration", (_, s) => {
    s.segments.forEach((seg, i) => {
      expect(seg.start).toBeLessThan(s.duration);
      if (i) expect(seg.start).toBeGreaterThanOrEqual(s.segments[i - 1].start);
    });
  });
});

describe("postFits", () => {
  it("rejects X posts over 280 chars", () => {
    expect(postFits("x", "a".repeat(LIMITS.x + 1))).toBe(false);
  });
});

describe("toMarkdown", () => {
  it("includes title, chapters with timestamps and posts", () => {
    const md = toMarkdown(samples[0]);
    expect(md).toContain(`# ${samples[0].title}`);
    expect(md).toContain("- 00:00 ");
    expect(md).toContain("## LinkedIn");
  });
});
