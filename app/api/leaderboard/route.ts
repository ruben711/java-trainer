import { NextRequest, NextResponse } from "next/server";
import { upstashConfigured } from "@/lib/upstash";
import { listEntries, upsertSelf } from "@/lib/leaderboardStore";
import { safeCustomTag, safeNameStyle } from "@/lib/nameStyle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!upstashConfigured()) {
    return NextResponse.json({ configured: false, entries: [] });
  }
  try {
    const entries = await listEntries();
    return NextResponse.json({ configured: true, entries });
  } catch (e: any) {
    return NextResponse.json(
      { configured: true, entries: [], error: String(e?.message ?? e) },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!upstashConfigured()) {
    return NextResponse.json({ configured: false });
  }
  const body = await req.json().catch(() => null);
  if (!body?.uid || typeof body.uid !== "string") {
    return NextResponse.json({ error: "uid vereist" }, { status: 400 });
  }
  try {
    await upsertSelf({
      uid: body.uid,
      name: typeof body.name === "string" ? body.name : "User",
      xp: Number(body.xp) || 0,
      solved: Number(body.solved) || 0,
      nameStyle:
        body.nameStyle === undefined ? undefined : safeNameStyle(body.nameStyle),
      customTag:
        body.customTag === undefined ? undefined : safeCustomTag(body.customTag),
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
