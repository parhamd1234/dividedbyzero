import SignupForm from "./_components/SignupForm";

export default function Home() {
  return (
    <main className="relative flex flex-1 min-h-screen flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-black text-white">
      {/* Atmospheric background: subtle radial glow + dot field */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none dbz-glow"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 35% 30% at 50% 45%, rgba(168,140,255,0.18) 0%, rgba(168,140,255,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 80%)",
        }}
      />

      {/* Foreground */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        {/* Logo mark — kept exactly as-is */}
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Divided by Zero"
          className="w-28 h-28 sm:w-36 sm:h-36 text-white dbz-mark dbz-fade"
        >
          <circle cx="50" cy="16" r="7" fill="currentColor" />
          <rect x="14" y="46" width="72" height="8" rx="4" fill="currentColor" />
          <circle
            cx="50"
            cy="82"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
          />
        </svg>

        <p
          className="mt-12 text-xs sm:text-sm font-medium tracking-[0.4em] uppercase text-white/60 dbz-fade"
          style={{ animationDelay: "120ms" }}
        >
          Divided by Zero
        </p>

        <h1
          className="font-serif mt-6 text-[clamp(1.75rem,3.8vw,3.25rem)] font-medium tracking-[-0.015em] leading-[1.15] dbz-fade"
          style={{ animationDelay: "240ms" }}
        >
          Unlocking the
          <br />
          field mechanics
        </h1>

        <p
          className="mt-8 text-base sm:text-lg text-white/55 max-w-md leading-relaxed dbz-fade"
          style={{ animationDelay: "360ms" }}
        >
          Something is being built at the edges of what&apos;s possible. Be
          first to know when it arrives.
        </p>

        <div
          className="mt-10 w-full dbz-fade"
          style={{ animationDelay: "480ms" }}
        >
          <SignupForm />
        </div>

        <p
          className="mt-10 text-xs font-medium tracking-[0.3em] uppercase text-white/35 dbz-fade"
          style={{ animationDelay: "600ms" }}
        >
          Coming soon
        </p>
      </div>

      <footer className="absolute bottom-6 inset-x-0 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Divided by Zero
      </footer>
    </main>
  );
}
