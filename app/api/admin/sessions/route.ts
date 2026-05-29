import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/adminAuth";
import { upstashConfigured } from "@/lib/upstash";
import { getEvents } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await verifyToken(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Niet gemachtigd." }, { status: 401 });
  }
  if (!upstashConfigured()) return NextResponse.json({ configured: false, events: [] });
  const events = await getEvents(150);
  return NextResponse.json({ configured: true, events });
}
