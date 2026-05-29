import { NextRequest, NextResponse } from "next/server";
import { upstashConfigured } from "@/lib/upstash";
import { getNotifications } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!upstashConfigured()) {
    return NextResponse.json({ configured: false, notifications: [] });
  }
  const uid = req.nextUrl.searchParams.get("uid") || "";
  try {
    const notifications = await getNotifications(uid);
    return NextResponse.json({ configured: true, notifications });
  } catch (e: any) {
    return NextResponse.json(
      { configured: true, notifications: [], error: String(e?.message ?? e) },
      { status: 500 },
    );
  }
}
