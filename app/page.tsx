// Cap CDN caching at 5 min — Hostinger's hCDN never purges on deploy,
// so the default year-long s-maxage left stale edges serving old builds.
export const revalidate = 300;

import AmbientAudio from "./_components/AmbientAudio";
import FieldCanvas from "./_components/FieldCanvas";
import KineticHeading from "./_components/KineticHeading";
import MouseGlow from "./_components/MouseGlow";
import Reveal from "./_components/Reveal";
import SignupForm from "./_components/SignupForm";

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Divided by Zero"
      className={className}
    >
      <circle cx="50" cy="16" r="7" fill="currentColor" className="dbz-fill" />
      <rect
        x="14"
        y="46"
        width="72"
        height="8"
        rx="4"
        fill="currentColor"
        className="dbz-fill"
        style={{ animationDelay: "300ms" }}
      />
      <circle
        cx="50"
        cy="82"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="dbz-draw"
        pathLength={200}
      />
    </svg>
  );
}

const principles = [
  {
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

export default function Home() {
  return (
    <div className="relative bg-black text-white">
      {/* Persistent atmosphere across the whole page */}
      <FieldCanvas />
      <MouseGlow />
      <AmbientAudio />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none dbz-glow"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 35% 30% at 50% 45%, rgba(168,140,255,0.18) 0%, rgba(168,140,255,0) 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl w-full flex flex-col items-center">
          <Mark className="w-28 h-28 sm:w-36 sm:h-36 text-white dbz-mark" />

          <p
            className="mt-12 text-xs sm:text-sm font-medium tracking-[0.4em] uppercase text-white/60 dbz-fade"
            style={{ animationDelay: "120ms" }}
          >
            Divided by Zero
          </p>

          <KineticHeading
            as="h1"
            className="font-serif mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium tracking-[-0.02em] leading-[1.08]"
            stagger={90}
            duration={800}
            delay={1500}
          >
            {"Unlocking the field mechanics"}
          </KineticHeading>

          <p
            className="mt-8 text-base sm:text-lg text-white/55 max-w-md leading-relaxed dbz-fade"
            style={{ animationDelay: "2600ms" }}
          >
            Something is being built at the edges of what&apos;s possible.
          </p>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 inset-x-0 z-10 flex justify-center dbz-fade"
          style={{ animationDelay: "3200ms" }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
            <span className="dbz-scroll-line block w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="relative z-10 px-6 py-28 sm:py-40">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.35em] uppercase text-white/40">
              01 — The premise
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif mt-8 text-[clamp(1.6rem,3.4vw,2.75rem)] font-medium leading-[1.3] tracking-[-0.01em] text-white/90">
              Every model breaks somewhere. Division by zero isn&apos;t an error —
              it&apos;s the map telling you where the territory begins.
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-8 text-white/50 leading-relaxed max-w-xl">
              We work at the singularities: the places where conventional tools
              return <span className="text-white/80 font-mono text-sm">undefined</span> and
              most people turn back. That is where the interesting structure
              lives — and where the field mechanics can finally be read.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ PRINCIPLES ============ */}
      <section className="relative z-10 px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.35em] uppercase text-white/40">
              02 — The approach
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.index} delay={i * 150}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-500 hover:border-[rgba(168,140,255,0.4)] hover:bg-white/[0.05]">
                  <div className="w-12 h-12 text-white/60 group-hover:text-[rgb(198,178,255)] transition-colors duration-500">
                    {p.glyph}
                  </div>
                  <p className="mt-6 text-[11px] font-mono tracking-[0.3em] text-white/30">
                    {p.index}
                  </p>
                  <h3 className="font-serif mt-2 text-xl text-white/90">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SIGNUP ============ */}
      <section className="relative z-10 px-6 py-28 sm:py-40 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none dbz-glow"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 45% 50% at 50% 55%, rgba(168,140,255,0.12) 0%, rgba(168,140,255,0) 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto flex flex-col items-center">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.35em] uppercase text-white/40">
              03 — First contact
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif mt-8 text-[clamp(1.75rem,3.8vw,3rem)] font-medium leading-[1.2] tracking-[-0.015em]">
              Be there when it switches on
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 text-white/50 max-w-md leading-relaxed">
              No noise, no newsletter cadence. One message when the field goes
              live — and early access for those on the list.
            </p>
          </Reveal>
          <Reveal delay={450} className="mt-10 w-full">
            <SignupForm />
          </Reveal>
          <Reveal delay={600}>
            <p className="mt-10 text-xs font-medium tracking-[0.3em] uppercase text-white/35">
              Coming soon
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div className="flex items-center gap-3">
            <Mark className="w-5 h-5 text-white/50" />
            <span className="tracking-[0.2em] uppercase">Divided by Zero</span>
          </div>
          <p>© {new Date().getFullYear()} Divided by Zero — Toronto, Canada</p>
        </div>
      </footer>
    </div>
  );
}
