import type { ReactNode } from "react";
import type { Category } from "../../lib/posts";

export const categoryInfo: Array<{
  key: Category;
  index: string;
  title: string;
  body: string;
  glyph: ReactNode;
}> = [
  {
    key: "signal",
    index: "01",
    title: "Signal",
    body: "Beneath the noise of every system there is a carrier wave. We isolate it, measure it, and learn its grammar.",
    glyph: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 24 C10 24 10 10 16 10 S22 38 28 38 34 24 44 24" />
      </svg>
    ),
  },
  {
    key: "field",
    index: "02",
    title: "Field",
    body: "Nothing acts alone. Forces propagate through a medium — and the medium has mechanics of its own.",
    glyph: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="24" cy="24" r="4" fill="currentColor" stroke="none" />
        <ellipse cx="24" cy="24" rx="18" ry="8" />
        <ellipse cx="24" cy="24" rx="18" ry="8" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="18" ry="8" transform="rotate(120 24 24)" />
      </svg>
    ),
  },
  {
    key: "emergence",
    index: "03",
    title: "Emergence",
    body: "When the structure is understood, behavior stops being a surprise. What looked impossible becomes inevitable.",
    glyph: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="24" cy="36" r="3" />
        <circle cx="14" cy="22" r="3" />
        <circle cx="34" cy="22" r="3" />
        <circle cx="24" cy="9" r="3" />
        <path d="M22 33.5 15.5 24.5 M26 33.5 32.5 24.5 M15.8 19.5 22 11.5 M32.2 19.5 26 11.5" />
      </svg>
    ),
  },
];
