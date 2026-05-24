export default function Home() {
  return (
    <main className="flex flex-1 min-h-screen flex-col items-center justify-center px-6 py-24 text-center bg-black text-white">
      {/* Logo mark: stylized division sign — dot, bar, ring (the 0) */}
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Divided by Zero"
        className="w-20 h-20 sm:w-28 sm:h-28 text-white"
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

      <p className="mt-10 text-xs sm:text-sm font-medium tracking-[0.35em] uppercase text-white/60">
        Divided by Zero
      </p>

      <h1 className="mt-6 text-4xl sm:text-7xl font-semibold tracking-[-0.03em] leading-[1.05] max-w-3xl">
        Unlocking the
        <br />
        field mechanics.
      </h1>

      <p className="mt-10 text-sm sm:text-base font-medium tracking-[0.25em] uppercase text-white/40">
        Coming soon
      </p>
    </main>
  );
}
