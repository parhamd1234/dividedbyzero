import fs from "fs";
import path from "path";
import { marked } from "marked";

export type Category = "signal" | "field" | "emergence";

export const CATEGORIES: Category[] = ["signal", "field", "emergence"];

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: Category | null;
  html: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2] };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { meta, body } = parseFrontmatter(raw);
      const slug = file
        .replace(/\.md$/, "")
        .replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const cat = meta.category?.toLowerCase();
      return {
        slug,
        title: meta.title ?? slug,
        date: meta.date ?? file.slice(0, 10),
        summary: meta.summary ?? "",
        category: CATEGORIES.includes(cat as Category)
          ? (cat as Category)
          : null,
        html: marked.parse(body, { async: false }),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: Category): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
