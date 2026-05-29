import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_TTL_SECONDS,
  adminConfigured,
  checkPassword,
  clearFailures,
  createToken,
  isLockedOut,
  recordFailure,
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin is niet geconfigureerd. Zet ADMIN_PASSWORD en ADMIN_SECRET in .env.local." },
      { status: 503 },
    );
  }
  const ip = clientIp(req);
  if (isLockedOut(ip)) {
    return NextResponse.json(
      { error: "Te veel mislukte pogingen. Probeer over 15 minuten opnieuw." },
      { status: 429 },
    );
  }
  const body = await req.json().catch(() => ({}));
  if (!checkPassword(body?.password)) {
    recordFailure(ip);
    return NextResponse.json({ error: "Foutief wachtwoord." }, { status: 401 });
  }
  clearFailures(ip);
  const token = await createToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_TTL_SECONDS,
  });
  return res;
}
