import { NextRequest, NextResponse } from "next/server";
import { executeJavaBackend } from "@/lib/exec";
import { rateLimit } from "@/lib/rateLimit";
import type { ExecFile } from "@/lib/types";

// Node runtime: grotere payloads + langere timeouts dan Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Eén uitvoering per X seconden per gebruiker/sessie (beschermt de Judge0-quota).
const RUN_COOLDOWN_MS = Number(process.env.RUN_COOLDOWN_MS || 20_000);
const MAX_FILES = 30;
const MAX_TOTAL_BYTES = 200_000;
const MAX_STDIN = 10_000;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}

export async function POST(req: NextRequest) {
  // Limiteer per sessie (anonieme uid). Valt terug op IP als er geen sessie is —
  // zo throttelen klasgenoten achter één gedeeld (school)IP elkaar niet.
  const sess = (req.headers.get("x-jt-session") || "")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64);
  const key = sess ? `rl:run:sess:${sess}` : `rl:run:ip:${clientIp(req)}`;
  const rl = await rateLimit(key, RUN_COOLDOWN_MS);
  if (!rl.allowed) {
    const secs = Math.max(1, Math.ceil(rl.retryAfterMs / 1000));
    return NextResponse.json(
      {
        ok: false,
        error: `Even rustig aan — je kan om de ${Math.round(
          RUN_COOLDOWN_MS / 1000,
        )} seconden één keer uitvoeren. Probeer over ${secs}s opnieuw.`,
        retryAfter: secs,
      },
      { status: 429, headers: { "Retry-After": String(secs) } },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldige payload." },
      { status: 400 },
    );
  }

  const files = body?.files;
  if (!Array.isArray(files) || files.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Geen bestanden meegestuurd." },
      { status: 400 },
    );
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, error: `Te veel bestanden (max ${MAX_FILES}).` },
      { status: 400 },
    );
  }

  let total = 0;
  const clean: ExecFile[] = [];
  for (const f of files) {
    if (typeof f?.name !== "string" || typeof f?.content !== "string") {
      return NextResponse.json(
        { ok: false, error: "Bestandsformaat ongeldig." },
        { status: 400 },
      );
    }
    total += f.content.length + f.name.length;
    clean.push({ name: f.name, content: f.content });
  }
  if (total > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Code te groot om uit te voeren." },
      { status: 413 },
    );
  }

  const stdin =
    typeof body.stdin === "string" ? body.stdin.slice(0, MAX_STDIN) : "";

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 20_000);
  try {
    const result = await executeJavaBackend(clean, stdin, ac.signal);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Onverwachte fout bij uitvoeren: " + (e?.message ?? "") },
      { status: 500 },
    );
  } finally {
    clearTimeout(timer);
  }
}
