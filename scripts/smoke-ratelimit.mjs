// Test de per-sessie rate-limit op /api/run (3 runs / 20s).
//  - sessie A 1e-3e keer → toegelaten (≠429)
//  - sessie A 4e keer    → 429 (geblokkeerd, raakt Judge0 NIET)
//  - sessie B            → toegelaten (eigen teller, los van A)
const PORT = process.argv[2] || "3005";
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

const a = [];
for (let i = 1; i <= 4; i++) {
  const r = await call("sessie-A");
  a.push(r);
  console.log(`A #${i} :`, r.status, "ok=" + r.ok, r.error ? `| ${r.error}` : "");
}
const B1 = await call("sessie-B");
console.log("B #1 :", B1.status, "ok=" + B1.ok, B1.error ? `| ${B1.error}` : "");

// Gate-gericht: A#1-3 mogen door (≠429), A#4 geblokkeerd (429), B onafhankelijk.
const pass =
  a[0].status !== 429 &&
  a[1].status !== 429 &&
  a[2].status !== 429 &&
  a[3].status === 429 &&
  a[3].ok === false &&
  B1.status !== 429;
console.log(pass ? "\n✅ RATE-LIMIT OK (3 toegelaten, 4e geblokkeerd, B onafhankelijk)" : "\n❌ RATE-LIMIT FAILED");
