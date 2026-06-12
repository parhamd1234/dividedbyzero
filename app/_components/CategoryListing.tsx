import Link from "next/link";
import { getPostsByCategory, formatDate, type Category } from "../../lib/posts";
import { categoryInfo } from "./categories";
import FieldCanvas from "./FieldCanvas";
import MouseGlow from "./MouseGlow";
import Reveal from "./Reveal";

export default function CategoryListing({ category }: { category: Category }) {
  const info = categoryInfo.find((c) => c.key === category)!;
  const posts = getPostsByCategory(category);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <FieldCanvas />
      <MouseGlow />

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-24 sm:py-32">
        <Reveal>
          <nav className="flex items-center gap-4 text-xs font-medium tracking-[0.3em] uppercase text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">
              ← Divided by Zero
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/notes" className="hover:text-white/70 transition-colors">
              Field Notes
            </Link>
          </nav>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 w-14 h-14 text-[rgb(198,178,255)]">{info.glyph}</div>
        </Reveal>
        <Reveal delay={200}>
          <h1 className="font-serif mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-medium tracking-[-0.015em]">
            {info.title}
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-4 text-white/50 leading-relaxed max-w-lg">{info.body}</p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2">
          {posts.length === 0 && (
            <Reveal delay={400}>
              <p className="text-white/40">Nothing logged here yet.</p>
            </Reveal>
          )}
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={400 + i * 100}>
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
