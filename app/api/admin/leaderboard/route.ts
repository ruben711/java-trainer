import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/adminAuth";
import { upstashConfigured } from "@/lib/upstash";
import { adminUpdate, deleteEntry, listEntries } from "@/lib/leaderboardStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard(req: NextRequest): Promise<boolean> {
  return verifyToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Niet gemachtigd." }, { status: 401 });
  if (!upstashConfigured()) return NextResponse.json({ configured: false, entries: [] });
  return NextResponse.json({ configured: true, entries: await listEntries() });
}

export async function POST(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Niet gemachtigd." }, { status: 401 });
  if (!upstashConfigured()) return NextResponse.json({ error: "Upstash niet geconfigureerd." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.uid) return NextResponse.json({ error: "uid vereist." }, { status: 400 });

  if (body.action === "delete") {
    await deleteEntry(body.uid);
    return NextResponse.json({ ok: true });
  }
  await adminUpdate(body.uid, {
    name: body.name,
    xp: body.xp !== undefined ? Number(body.xp) : undefined,
    solved: body.solved !== undefined ? Number(body.solved) : undefined,
    isAdmin: body.isAdmin,
  });
  return NextResponse.json({ ok: true });
}
