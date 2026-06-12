import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, formatDate } from "../../../lib/posts";
import FieldCanvas from "../../_components/FieldCanvas";
import MouseGlow from "../../_components/MouseGlow";

export const revalidate = 300;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} — Divided by Zero`,
    description: post.summary,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <div className="relative min-h-screen bg-black text-white">
      <FieldCanvas />
      <MouseGlow />

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-24 sm:py-32">
        <Link
          href="/notes"
          className="text-xs font-medium tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors"
        >
          ← Field Notes
        </Link>

        <p className="mt-10 text-[11px] font-mono tracking-[0.25em] uppercase text-white/35">
          {formatDate(post.date)}
          {post.category && (
            <Link
              href={`/notes/${post.category}`}
              className="ml-3 text-[rgba(198,178,255,0.7)] hover:text-[rgb(198,178,255)] transition-colors"
            >
              {post.category}
            </Link>
          )}
        </p>
        <h1 className="font-serif mt-3 text-[clamp(1.9rem,4.2vw,3rem)] font-medium tracking-[-0.015em] leading-[1.15]">
          {post.title}
        </h1>

        <article
          className="dbz-prose mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-10 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Divided by Zero
      </footer>
    </div>
  );
}
