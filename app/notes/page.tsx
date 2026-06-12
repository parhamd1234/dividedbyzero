import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "../../lib/posts";
import FieldCanvas from "../_components/FieldCanvas";
import MouseGlow from "../_components/MouseGlow";
import Reveal from "../_components/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Field Notes — Divided by Zero",
  description: "Observations, experiments, and transmissions from the field.",
};

export default function NotesPage() {
  const posts = getAllPosts();

  return (
    <div className="relative min-h-screen bg-black text-white">
      <FieldCanvas />
      <MouseGlow />

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-24 sm:py-32">
        <Reveal>
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            ← Divided by Zero
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="font-serif mt-10 text-[clamp(2rem,4.5vw,3.25rem)] font-medium tracking-[-0.015em]">
            Field Notes
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-4 text-white/50 leading-relaxed">
            Observations, experiments, and transmissions from the field. No
            cadence — a note appears when there is something worth writing
            down.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2">
          {posts.length === 0 && (
            <p className="text-white/40">Nothing logged yet.</p>
          )}
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={300 + i * 100}>
              <Link
                href={`/notes/${post.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 hover:border-[rgba(168,140,255,0.4)] hover:bg-white/[0.05]"
              >
                <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/35">
                  {formatDate(post.date)}
                </p>
                <h2 className="font-serif mt-2 text-2xl text-white/90 group-hover:text-white transition-colors">
                  {post.title}
                </h2>
                {post.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {post.summary}
                  </p>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-10 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Divided by Zero
      </footer>
    </div>
  );
}
