import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, verifyToken } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authed = await verifyToken(req.cookies.get(ADMIN_COOKIE)?.value);
  return NextResponse.json({ authed, configured: adminConfigured() });
}
