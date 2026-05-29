/** Stabiele, anonieme device-id. Eén keer aangemaakt, daarna persistent. */
export function generateUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "u-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Default leaderboard-naam zoals "User1234" tot de gebruiker er zelf een kiest. */
export function defaultDisplayName(uid: string): string {
  let h = 0;
  for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) >>> 0;
  return "User" + (1000 + (h % 9000));
}

export function todayStr(d: Date = new Date()): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

/** Aantal dagen tussen twee YYYY-MM-DD strings (b - a). */
export function dayDiff(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}
