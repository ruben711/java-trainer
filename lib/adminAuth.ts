const SECRET = process.env.ADMIN_SECRET || "";
const PASSWORD = process.env.ADMIN_PASSWORD || "";

export const ADMIN_COOKIE = "jt_admin";
export const ADMIN_TTL_SECONDS = 7 * 24 * 60 * 60;

export function adminConfigured(): boolean {
  return !!(SECRET && PASSWORD);
}

export function checkPassword(pw: string): boolean {
  if (!adminConfigured() || typeof pw !== "string") return false;
  // lengte-onafhankelijke vergelijking
  if (pw.length !== PASSWORD.length) return false;
  let diff = 0;
  for (let i = 0; i < pw.length; i++) diff |= pw.charCodeAt(i) ^ PASSWORD.charCodeAt(i);
  return diff === 0;
}

function b64url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64url(sig);
}

export async function createToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_TTL_SECONDS;
  const payload = `admin.${exp}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifyToken(token?: string | null): Promise<boolean> {
  if (!token || !SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  const expected = await hmac(`${role}.${expStr}`);
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return false;
  if (Number(expStr) < Math.floor(Date.now() / 1000)) return false;
  return role === "admin";
}

// ── Brute-force bescherming (in-memory, per IP) ──
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; until: number }>();

export function isLockedOut(ip: string): boolean {
  const a = attempts.get(ip);
  return !!a && a.until > Date.now() && a.count >= MAX_ATTEMPTS;
}

export function recordFailure(ip: string): void {
  const now = Date.now();
  const a = attempts.get(ip);
  if (!a || a.until < now) attempts.set(ip, { count: 1, until: now + LOCKOUT_MS });
  else attempts.set(ip, { count: a.count + 1, until: now + LOCKOUT_MS });
}

export function clearFailures(ip: string): void {
  attempts.delete(ip);
}
