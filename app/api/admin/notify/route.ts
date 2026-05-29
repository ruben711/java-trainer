import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/adminAuth";
import { upstashConfigured } from "@/lib/upstash";
import { pushNotification, type NotifType } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: NotifType[] = ["info", "success", "warning", "error"];

export async function POST(req: NextRequest) {
  if (!(await verifyToken(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Niet gemachtigd." }, { status: 401 });
  }
  if (!upstashConfigured()) return NextResponse.json({ error: "Upstash niet geconfigureerd." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.message) {
    return NextResponse.json({ error: "Titel en bericht zijn vereist." }, { status: 400 });
  }
  const type: NotifType = TYPES.includes(body.type) ? body.type : "info";
  const target = typeof body.target === "string" && body.target ? body.target : "all";
  const notif = await pushNotification(target, {
    type,
    title: String(body.title),
    message: String(body.message),
  });
  return NextResponse.json({ ok: true, notif });
}
