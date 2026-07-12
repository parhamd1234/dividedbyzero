import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

// Only SHA-256 hashes live in the repo; cleartext stays on the Mac (note-forge/.env).
const PIN_HASH = "5970b57552e20298af08155023201686a1266a3af4e7a6611bdbb58e92c69bd3";
const SECRET_HASH = "79ad46fe7bdc7aaa252a06edf8e030e3cec3b910018aee5b8776cbda78977ac8";

type Job = {
  id: string;
  dictation: string;
  state: "queued" | "processing" | "done" | "error";
  note?: string;
  evidence?: string;
  error?: string;
  createdAt: number;
};

// In-process store — jobs are transient (minutes); wiped on redeploy, which is fine.
const g = globalThis as unknown as { __mednotes?: Map<string, Job> };
const jobs = (g.__mednotes ??= new Map<string, Job>());

const TTL_MS = 60 * 60 * 1000;

function sha256(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

function sweep() {
  const now = Date.now();
  for (const [id, j] of jobs) if (now - j.createdAt > TTL_MS) jobs.delete(id);
}

export async function POST(req: NextRequest) {
  sweep();
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const op = body.op;

  // --- physician-facing ops (PIN) ---
  if (op === "submit" || op === "status") {
    if (sha256(body.pin ?? "") !== PIN_HASH)
      return NextResponse.json({ error: "bad pin" }, { status: 403 });

    if (op === "submit") {
      const dictation = (body.dictation ?? "").trim();
      if (!dictation) return NextResponse.json({ error: "empty" }, { status: 400 });
      if (dictation.length > 40_000)
        return NextResponse.json({ error: "too long" }, { status: 400 });
      const id = crypto.randomUUID().slice(0, 8);
      jobs.set(id, { id, dictation, state: "queued", createdAt: Date.now() });
      return NextResponse.json({ job_id: id });
    }

    const j = jobs.get(body.job_id ?? "");
    if (!j) return NextResponse.json({ state: "gone" });
    return NextResponse.json({
      state: j.state,
      note: j.note,
      evidence: j.evidence,
      error: j.error,
    });
  }

  // --- Mac worker ops (secret) ---
  if (op === "claim" || op === "complete" || op === "progress" || op === "evidence") {
    if (sha256(body.secret ?? "") !== SECRET_HASH)
      return NextResponse.json({ error: "bad secret" }, { status: 403 });

    if (op === "claim") {
      for (const j of jobs.values()) {
        if (j.state === "queued") {
          j.state = "processing";
          return NextResponse.json({ job_id: j.id, dictation: j.dictation });
        }
      }
      return NextResponse.json({});
    }

    if (op === "progress") {
      const j = jobs.get(body.job_id ?? "");
      if (j && j.state === "processing") j.note = body.note ?? "";
      return NextResponse.json({ ok: true });
    }

    if (op === "evidence") {
      const j = jobs.get(body.job_id ?? "");
      if (j && j.state === "done") j.evidence = body.evidence ?? "";
      return NextResponse.json({ ok: true });
    }

    const j = jobs.get(body.job_id ?? "");
    if (!j) return NextResponse.json({ error: "gone" }, { status: 404 });
    if (body.error) {
      j.state = "error";
      j.error = body.error;
    } else {
      j.state = "done";
      j.note = body.note ?? "";
      j.evidence = body.evidence ?? "";
      j.dictation = ""; // drop source text once processed
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "bad op" }, { status: 400 });
}
