// Test de per-sessie rate-limit op /api/run (1 run / 20s).
//  - sessie A 1e keer  → 200 (toegelaten, draait)
//  - sessie A 2e keer  → 429 (geblokkeerd, raakt Judge0 NIET)
//  - sessie B          → 200 (eigen teller, los van A)
const PORT = process.argv[2] || "3007";
const URL = `http://localhost:${PORT}/api/run`;
const files = [{ name: "Main.java", content: 'public class Main { public static void main(String[] a){ System.out.println("ok"); } }' }];

async function call(session) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "content-type": "application/json", ...(session ? { "x-jt-session": session } : {}) },
    body: JSON.stringify({ files }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, retryAfter: res.headers.get("retry-after"), ok: body.ok, error: body.error };
}

const A1 = await call("sessie-A");
console.log("A #1 :", A1.status, "ok=" + A1.ok, A1.error ? `| ${A1.error}` : "");
const A2 = await call("sessie-A");
console.log("A #2 :", A2.status, "ok=" + A2.ok, "retry-after=" + A2.retryAfter, A2.error ? `| ${A2.error}` : "");
const B1 = await call("sessie-B");
console.log("B #1 :", B1.status, "ok=" + B1.ok, B1.error ? `| ${B1.error}` : "");

// Gate-gericht: A1/B1 mogen door (≠429), A2 wordt geblokkeerd (429).
const pass =
  A1.status !== 429 && A2.status === 429 && A2.ok === false && B1.status !== 429;
console.log(pass ? "\n✅ RATE-LIMIT OK (A geblokkeerd, B onafhankelijk)" : "\n❌ RATE-LIMIT FAILED");
