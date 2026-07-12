"use client";

import { useEffect, useRef, useState } from "react";

type Result = { note: string; evidence: string };

export default function MedNotes() {
  const [pin, setPin] = useState("");
  const [dictation, setDictation] = useState("");
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [draft, setDraft] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPin(localStorage.getItem("mednotes_pin") ?? "");
  }, []);

  async function api(body: Record<string, string>) {
    const r = await fetch("/api/mednotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return r.json();
  }

  async function go() {
    setErr("");
    setResult(null);
    setDraft(false);
    setCopied(false);
    localStorage.setItem("mednotes_pin", pin);
    setState("working");
    setElapsed(0);
    const t0 = Date.now();
    const sub = await api({ op: "submit", pin, dictation });
    if (!sub.job_id) {
      setState("error");
      setErr(sub.error === "bad pin" ? "Wrong PIN." : sub.error || "Submit failed.");
      return;
    }
    timer.current = setInterval(async () => {
      setElapsed(Math.round((Date.now() - t0) / 1000));
      const s = await api({ op: "status", pin, job_id: sub.job_id });
      if (s.state === "done") {
        setResult({ note: s.note ?? "", evidence: s.evidence ?? "" });
        setDraft(false);
        setState("done");
        // note is final; keep polling (max ~8 min) for the background evidence report
        if (s.evidence || Date.now() - t0 > 8 * 60 * 1000) {
          clearInterval(timer.current!);
          if (!s.evidence)
            setResult((r) =>
              r ? { ...r, evidence: "Evidence pass didn't return this run." } : r
            );
        }
      } else if (s.state === "processing" && s.note) {
        setResult({ note: s.note, evidence: "" });
        setDraft(true);
      } else if (s.state === "error" || s.state === "gone") {
        clearInterval(timer.current!);
        setState("error");
        setErr(s.error || "Job lost — is the Mac worker running?");
      }
    }, 3000);
  }

  async function copyNote() {
    if (!result) return;
    await navigator.clipboard.writeText(result.note);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      <h1 className="mb-1 text-2xl font-semibold">MedNotes</h1>
      <p className="mb-6 text-sm text-white/50">
        Dictation → AI Medical Notes → evidence pass → polished note.
      </p>

      <input
        type="password"
        inputMode="numeric"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="mb-3 w-32 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/50"
      />

      <textarea
        value={dictation}
        onChange={(e) => setDictation(e.target.value)}
        placeholder="Paste or dictate the case…"
        rows={10}
        className="mb-3 w-full rounded-md border border-white/20 bg-white/5 p-3 text-sm leading-relaxed outline-none focus:border-white/50"
      />

      <button
        onClick={go}
        disabled={state === "working" || !pin || !dictation.trim()}
        className="rounded-md bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-40"
      >
        {state === "working" ? `Working… ${elapsed}s` : "Generate note"}
      </button>

      {state === "error" && (
        <p className="mt-4 rounded-md border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300">
          {err}
        </p>
      )}

      {result && (
        <section className="mt-8">
          {draft && (
            <p className="mb-3 rounded-md border border-amber-300/30 bg-amber-300/10 p-2 text-xs text-amber-200">
              Draft — polish + evidence pass running, final version will replace
              this automatically.
            </p>
          )}
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-medium">{draft ? "Note (draft)" : "Note"}</h2>
            <button
              onClick={copyNote}
              className="rounded-md border border-white/30 px-3 py-1 text-xs hover:bg-white/10"
            >
              {copied ? "Copied ✓" : "Copy note"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded-md border border-white/15 bg-white/5 p-4 text-sm leading-relaxed">
            {result.note}
          </pre>

          {state === "done" && !result.evidence && (
            <p className="mt-6 rounded-md border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200/70">
              Evidence pass running in background — will appear here in ~2 min.
              Safe to copy the note and move on.
            </p>
          )}
          {result.evidence && (
            <>
              <h2 className="mt-6 mb-2 text-lg font-medium text-emerald-300/90">
                Evidence — not for chart
              </h2>
              {result.evidence.includes("SUGGESTED CHANGE:") && (
                <p className="mb-2 rounded-md border border-amber-300/40 bg-amber-300/10 p-2 text-xs font-medium text-amber-200">
                  ⚠ Evidence suggests amendments to the charted note — see below.
                </p>
              )}
              <pre className="whitespace-pre-wrap rounded-md border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm leading-relaxed text-white/80">
                {result.evidence}
              </pre>
            </>
          )}
        </section>
      )}
    </main>
  );
}
