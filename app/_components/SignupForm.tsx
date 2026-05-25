"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export default function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // Wire to Supabase / Resend later. For now, simulate.
    await new Promise((r) => setTimeout(r, 500));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-white/70 tracking-wide">
        You&apos;re on the list.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 max-w-md mx-auto"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="you@domain.com"
        className="flex-1 rounded-full bg-white/[0.06] border border-white/15 px-5 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        aria-label="Sign up"
        className="rounded-full bg-white text-black w-12 h-12 shrink-0 flex items-center justify-center hover:bg-white/85 transition-colors disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 8 L13 8 M9 4 L13 8 L9 12" />
        </svg>
      </button>
    </form>
  );
}
