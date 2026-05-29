// Test de ECHTE mergeJava + judge0-adapter via /api/run, op de 3 risicovolle paden:
//  A) test-entry (VerborgenTest) botst met een leerling-Main.java  → rename-logica
//  B) library-bestand zonder main                                  → synthetische Main
//  C) gewone run met een Main die al 'Main' heet                    → entry ongewijzigd
const PORT = process.argv[2] || "3007";
const URL = `http://localhost:${PORT}/api/run`;

const post = async (files) => {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ files }),
  });
  return res.json();
};

// ── A) jas: VerborgenTest (entry, marker) + leerling Main.java (heeft óók main) ──
const jas = [
  { name: "VerborgenTest.java", content: `public class VerborgenTest {
    static int g=0,f=0;
    static void check(String n, boolean ok){ if(ok){g++;System.out.println("[OK]   "+n);}else{f++;System.out.println("[FOUT] "+n);} }
    static void klaar(){ System.out.println(); System.out.println(g+" geslaagd, "+f+" gefaald."); if(f==0) System.out.println("ALLE TESTS GESLAAGD"); }
    public static void main(String[] a){
        check("Maat 5 waarden", Maat.values().length==5);
        check("Maat.M=40", Maat.M.getGrootte()==40);
        Jas j = new Jas(Maat.L, Kleur.ROOD, 49.99);
        check("toString bevat ROOD", j.toString().contains("ROOD"));
        klaar();
    }
}` },
  { name: "Maat.java", content: `public enum Maat { S(38),M(40),L(42),XL(44),XXL(46); private final int grootte; Maat(int g){grootte=g;} public int getGrootte(){return grootte;} }` },
  { name: "Kleur.java", content: `public enum Kleur { ROOD, BLAUW, GROEN, GRIJS, BEIGE, ZWART }` },
  { name: "Jas.java", content: `public class Jas { private Maat m; private Kleur k; private double p; public Jas(Maat m, Kleur k, double p){this.m=m;this.k=k;this.p=p;} public String toString(){ return "Jas [maat="+m+", kleur="+k+", prijs="+p+"]"; } }` },
  { name: "Main.java", content: `import java.util.ArrayList;
public class Main {
    public static void main(String[] args){
        ArrayList<Jas> rek = new ArrayList<>();
        rek.add(new Jas(Maat.M, Kleur.ROOD, 49.99));
        System.out.println("Leerling-Main: " + rek.size());
    }
}` },
];

// ── B) library-bestand zonder main ──
const lib = [
  { name: "Rekening.java", content: `public class Rekening { private double s; public Rekening(double s){this.s=s;} public void stort(double b){s+=b;} public double getSaldo(){return s;} }` },
];

// ── C) gewone run, Main heet al Main ──
const plain = [
  { name: "Main.java", content: `public class Main { public static void main(String[] a){ System.out.println("Hallo vanuit Main"); } }` },
];

async function run() {
  const A = await post(jas);
  const aOut = A?.run?.stdout ?? "";
  console.log(`A) clash-rename : ${aOut.includes("ALLE TESTS GESLAAGD") ? "PASS ✓" : "FAIL ✗"} (${A.wallTimeMs}ms)`);
  if (!aOut.includes("ALLE TESTS GESLAAGD")) {
    console.log("   compile:", (A?.compile?.stderr ?? "").trim().slice(0, 300));
    console.log("   stdout :", aOut.trim().slice(0, 300));
    console.log("   error  :", A?.error ?? "");
  } else if (aOut.includes("Leerling-Main")) {
    console.log("   ⚠️ leerling-Main draaide óók (zou niet mogen) — entry-keuze fout");
  }

  const B = await post(lib);
  const bOut = (B?.run?.stdout ?? "") + (B?.run?.stderr ?? "");
  const bCompileOk = (B?.compile?.code ?? 0) === 0;
  console.log(`B) no-main lib  : ${bCompileOk && bOut.includes("[info]") ? "PASS ✓" : "FAIL ✗"} (${B.wallTimeMs}ms)`);
  if (!(bCompileOk && bOut.includes("[info]"))) {
    console.log("   compile:", (B?.compile?.stderr ?? "").trim().slice(0, 300));
    console.log("   out    :", bOut.trim().slice(0, 300));
  }

  const C = await post(plain);
  const cOut = C?.run?.stdout ?? "";
  console.log(`C) plain Main   : ${cOut.includes("Hallo vanuit Main") ? "PASS ✓" : "FAIL ✗"} (${C.wallTimeMs}ms)`);
  if (!cOut.includes("Hallo vanuit Main")) {
    console.log("   compile:", (C?.compile?.stderr ?? "").trim().slice(0, 300));
    console.log("   stdout :", cOut.trim().slice(0, 300));
  }
}
run();
