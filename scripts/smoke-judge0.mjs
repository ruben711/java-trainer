// Smoke test: stuurt een samengevoegde multi-class Java-bron (zoals mergeJava
// produceert) naar de gratis Judge0-instantie en checkt de output.
// Gebruik: node scripts/smoke-judge0.mjs
const BASE = (process.env.JUDGE0_URL || "https://ce.judge0.com").replace(/\/+$/, "");
const KEY = process.env.JUDGE0_KEY || "";
const LANG = Number(process.env.JUDGE0_LANGUAGE_ID || 62);

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
const unb64 = (s) => (s ? Buffer.from(s, "base64").toString("utf8") : "");

const headers = { "content-type": "application/json" };
if (KEY) {
  headers["X-RapidAPI-Key"] = KEY;
  headers["X-RapidAPI-Host"] = new URL(BASE).host;
}

// Zoals mergeJava: imports bovenaan, geen public, entry-klasse heet Main.
const source = `import java.util.ArrayList;

class Rekening {
  private double saldo;
  Rekening(double s) { saldo = s; }
  void stort(double b) { saldo += b; }
  double getSaldo() { return saldo; }
}

class Main {
  public static void main(String[] a) {
    ArrayList<Rekening> lijst = new ArrayList<>();
    Rekening r = new Rekening(100);
    r.stort(50);
    lijst.add(r);
    if (lijst.get(0).getSaldo() == 150.0) System.out.println("ALLE TESTS GESLAAGD");
    else System.out.println("FOUT: " + r.getSaldo());
  }
}
`;

const started = Date.now();
let res = await fetch(`${BASE}/submissions?base64_encoded=true&wait=true`, {
  method: "POST",
  headers,
  body: JSON.stringify({ source_code: b64(source), language_id: LANG, stdin: b64("") }),
});
console.log("HTTP", res.status, res.statusText);
let data = await res.json();

if (data?.token && !data.status) {
  process.stdout.write("pollen");
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 600));
    const r = await fetch(
      `${BASE}/submissions/${data.token}?base64_encoded=true&fields=stdout,stderr,compile_output,status,exit_code,time`,
      { headers },
    );
    data = await r.json();
    process.stdout.write(".");
    if (data?.status && data.status.id >= 3) break;
  }
  console.log("");
}

const stdout = unb64(data?.stdout);
const stderr = unb64(data?.stderr);
const compile = unb64(data?.compile_output);
console.log("status :", data?.status?.id, data?.status?.description);
console.log("tijd   :", data?.time, "s |", Date.now() - started, "ms wall");
if (compile.trim()) console.log("compile:\n" + compile);
if (stderr.trim()) console.log("stderr :\n" + stderr);
console.log("stdout :\n" + stdout);
console.log(
  stdout.includes("ALLE TESTS GESLAAGD")
    ? "\n✅ SMOKE OK — multi-class merge compileert + draait op Judge0"
    : "\n❌ SMOKE FAILED — marker niet gevonden",
);
