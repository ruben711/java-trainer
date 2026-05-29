import { NextRequest, NextResponse } from "next/server";
import { upstashConfigured } from "@/lib/upstash";
import { logEvent } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!upstashConfigured()) {
    return NextResponse.json({ ok: false, configured: false });
  }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Ongeldige payload." }, { status: 400 });
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-vercel-ip-country-region") ||
    undefined;
  try {
    await logEvent({
      uid: String(body.uid || "").slice(0, 64),
      name: String(body.name || "").slice(0, 40),
      type: String(body.type || "event").slice(0, 40),
      detail: String(body.detail || "").slice(0, 160),
      country: country || undefined,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
