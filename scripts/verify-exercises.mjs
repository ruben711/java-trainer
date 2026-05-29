// Batch 5: per-hoofdstuk de ontbrekende uitersten (heel klein/makkelijk + groot/moeilijk).
const PORT = process.argv[2] || "3005";
const URL = `http://localhost:${PORT}/api/run`;
const MARKER = "ALLE TESTS GESLAAGD";
const HELPER = `    static int geslaagd = 0, gefaald = 0;
    static void check(String naam, boolean ok) {
        if (ok) { geslaagd++; System.out.println("[OK]   " + naam); }
        else    { gefaald++; System.out.println("[FOUT] " + naam); }
    }
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    static void klaar() {
        System.out.println();
        System.out.println(geslaagd + " geslaagd, " + gefaald + " gefaald.");
        if (gefaald == 0) System.out.println("${MARKER}");
    }`;
const T = (imports, body) => ({ name: "VerborgenTest.java", content: `${imports}public class VerborgenTest {\n${HELPER}\n    public static void main(String[] args) {\n${body}\n        klaar();\n    }\n}` });

const exercises = [
  // ── H6 (groot/moeilijk): Kaartspel — enums + static factory + ArrayList ──
  { id: "kaartspel", solution: [
    { name: "Kleur.java", content: `public enum Kleur { HARTEN, RUITEN, KLAVEREN, SCHOPPEN }` },
    { name: "Waarde.java", content: `public enum Waarde {
    TWEE(2), DRIE(3), VIER(4), VIJF(5), ZES(6), ZEVEN(7), ACHT(8), NEGEN(9), TIEN(10),
    BOER(11), VROUW(12), KONING(13), AAS(14);
    private final int punten;
    Waarde(int punten) { this.punten = punten; }
    public int getPunten() { return punten; }
}` },
    { name: "Kaart.java", content: `public class Kaart {
    private final Kleur kleur;
    private final Waarde waarde;
    public Kaart(Kleur kleur, Waarde waarde) { this.kleur = kleur; this.waarde = waarde; }
    public Kleur getKleur() { return kleur; }
    public Waarde getWaarde() { return waarde; }
    public int getPunten() { return waarde.getPunten(); }
    public String toString() { return waarde + " van " + kleur; }
}` },
    { name: "Stapel.java", content: `import java.util.ArrayList;
public class Stapel {
    private ArrayList<Kaart> kaarten = new ArrayList<>();
    public void voegToe(Kaart k) { kaarten.add(k); }
    public int aantal() { return kaarten.size(); }
    public Kaart neemBovenste() { return kaarten.remove(kaarten.size() - 1); }
    public int totaalPunten() {
        int t = 0; for (Kaart k : kaarten) t += k.getPunten(); return t;
    }
    public static Stapel volledigeStapel() {
        Stapel s = new Stapel();
        for (Kleur kl : Kleur.values())
            for (Waarde w : Waarde.values())
                s.voegToe(new Kaart(kl, w));
        return s;
    }
}` }],
    test: T("", `        check("4 kleuren", Kleur.values().length == 4);
        check("13 waarden", Waarde.values().length == 13);
        check("AAS = 14 punten", Waarde.AAS.getPunten() == 14);
        check("TWEE = 2 punten", Waarde.TWEE.getPunten() == 2);
        Stapel s = Stapel.volledigeStapel();
        check("volledige stapel 52 kaarten", s.aantal() == 52);
        check("totaal 416 punten", s.totaalPunten() == 416);
        Kaart top = s.neemBovenste();
        check("na neemBovenste 51", s.aantal() == 51);
        check("kaart heeft punten", top.getPunten() == top.getWaarde().getPunten());`) },

  // ── H8 (groot/moeilijk): Bestelling — class design, meerdere klassen ──
  { id: "bestelling", solution: [
    { name: "Product.java", content: `public class Product {
    private String naam; private double prijs;
    public Product(String naam, double prijs) { this.naam = naam; this.prijs = prijs; }
    public String getNaam() { return naam; }
    public double getPrijs() { return prijs; }
}` },
    { name: "Bestelregel.java", content: `public class Bestelregel {
    private Product product; private int aantal;
    public Bestelregel(Product product, int aantal) { this.product = product; this.aantal = aantal; }
    public Product getProduct() { return product; }
    public int getAantal() { return aantal; }
    public double getSubtotaal() { return product.getPrijs() * aantal; }
}` },
    { name: "Bestelling.java", content: `import java.util.ArrayList;
public class Bestelling {
    private ArrayList<Bestelregel> regels = new ArrayList<>();
    public void voegToe(Product product, int aantal) { regels.add(new Bestelregel(product, aantal)); }
    public double getTotaal() { double t = 0; for (Bestelregel r : regels) t += r.getSubtotaal(); return t; }
    public int getAantalProducten() { int n = 0; for (Bestelregel r : regels) n += r.getAantal(); return n; }
    public Bestelregel getDuursteRegel() {
        Bestelregel duurste = null;
        for (Bestelregel r : regels)
            if (duurste == null || r.getSubtotaal() > duurste.getSubtotaal()) duurste = r;
        return duurste;
    }
}` }],
    test: T("", `        Product appel = new Product("appel", 0.5);
        Product brood = new Product("brood", 2.0);
        Bestelregel r = new Bestelregel(brood, 3);
        check("subtotaal brood x3 = 6.0", eq(r.getSubtotaal(), 6.0));
        Bestelling b = new Bestelling();
        b.voegToe(appel, 4);
        b.voegToe(brood, 2);
        check("totaal = 6.0", eq(b.getTotaal(), 6.0));
        check("aantal producten = 6", b.getAantalProducten() == 6);
        check("duurste regel = brood", b.getDuursteRegel().getProduct().getNaam().equals("brood"));`) },

  // ── OBJ (klein/makkelijk): Voorraad — HashMap basis ──
  { id: "voorraad", solution: [
    { name: "Voorraad.java", content: `import java.util.HashMap;
public class Voorraad {
    private HashMap<String, Integer> stock = new HashMap<>();
    public void voegToe(String product, int aantal) {
        stock.put(product, stock.getOrDefault(product, 0) + aantal);
    }
    public int getAantal(String product) { return stock.getOrDefault(product, 0); }
}` }],
    test: T("", `        Voorraad v = new Voorraad();
        v.voegToe("appel", 3);
        v.voegToe("appel", 2);
        check("appel = 5", v.getAantal("appel") == 5);
        check("onbekend = 0", v.getAantal("peer") == 0);`) },

  // ── OBJ (groot/moeilijk): Woordenfrequentie — HashMap + max ──
  { id: "woordenfrequentie", solution: [
    { name: "Woordenteller.java", content: `import java.util.HashMap;
public class Woordenteller {
    private HashMap<String, Integer> tellingen = new HashMap<>();
    public void verwerk(String tekst) {
        for (String woord : tekst.toLowerCase().split(" ")) {
            if (woord.isEmpty()) continue;
            tellingen.put(woord, tellingen.getOrDefault(woord, 0) + 1);
        }
    }
    public int frequentie(String woord) { return tellingen.getOrDefault(woord.toLowerCase(), 0); }
    public int aantalUnieke() { return tellingen.size(); }
    public String meestVoorkomend() {
        String beste = null; int max = -1;
        for (String w : tellingen.keySet())
            if (tellingen.get(w) > max) { max = tellingen.get(w); beste = w; }
        return beste;
    }
}` }],
    test: T("", `        Woordenteller w = new Woordenteller();
        w.verwerk("de kat de hond de vis");
        check("de = 3", w.frequentie("de") == 3);
        check("kat = 1", w.frequentie("kat") == 1);
        check("aantal unieke = 4", w.aantalUnieke() == 4);
        check("meest voorkomend = de", w.meestVoorkomend().equals("de"));`) },

  // ── H10 (groot/moeilijk): Personeel — hierarchie + polymorfisme ──
  { id: "personeel", solution: [
    { name: "Werknemer.java", content: `public class Werknemer {
    private String naam; private double basisloon;
    public Werknemer(String naam, double basisloon) { this.naam = naam; this.basisloon = basisloon; }
    public String getNaam() { return naam; }
    public double getBasisloon() { return basisloon; }
    public double getMaandloon() { return basisloon; }
}` },
    { name: "Manager.java", content: `public class Manager extends Werknemer {
    private double bonus;
    public Manager(String naam, double basisloon, double bonus) { super(naam, basisloon); this.bonus = bonus; }
    public double getMaandloon() { return getBasisloon() + bonus; }
}` },
    { name: "Verkoper.java", content: `public class Verkoper extends Werknemer {
    private double commissiePercentage; private double omzet;
    public Verkoper(String naam, double basisloon, double commissiePercentage, double omzet) {
        super(naam, basisloon); this.commissiePercentage = commissiePercentage; this.omzet = omzet;
    }
    public double getMaandloon() { return getBasisloon() + omzet * commissiePercentage / 100.0; }
}` },
    { name: "Bedrijf.java", content: `import java.util.ArrayList;
public class Bedrijf {
    private ArrayList<Werknemer> werknemers = new ArrayList<>();
    public void voegToe(Werknemer w) { werknemers.add(w); }
    public double getTotaleLoonkost() {
        double t = 0; for (Werknemer w : werknemers) t += w.getMaandloon(); return t;
    }
    public Werknemer getDuurste() {
        Werknemer d = null;
        for (Werknemer w : werknemers)
            if (d == null || w.getMaandloon() > d.getMaandloon()) d = w;
        return d;
    }
}` }],
    test: T("", `        Werknemer w = new Werknemer("Jan", 2000);
        check("gewone werknemer 2000", eq(w.getMaandloon(), 2000));
        Manager m = new Manager("Ann", 3000, 500);
        check("manager 3500", eq(m.getMaandloon(), 3500));
        Verkoper v = new Verkoper("Bo", 1500, 10, 10000);
        check("verkoper 2500", eq(v.getMaandloon(), 2500));
        Bedrijf bedrijf = new Bedrijf();
        bedrijf.voegToe(w); bedrijf.voegToe(m); bedrijf.voegToe(v);
        check("totale loonkost 8000", eq(bedrijf.getTotaleLoonkost(), 8000));
        check("duurste = Ann", bedrijf.getDuurste().getNaam().equals("Ann"));`) },

  // ── H12 (klein/makkelijk): Aanzetbaar — interface basis ──
  { id: "aanzetbaar", solution: [
    { name: "Aanzetbaar.java", content: `public interface Aanzetbaar {
    void aan();
    void uit();
    boolean isAan();
}` },
    { name: "Lamp.java", content: `public class Lamp implements Aanzetbaar {
    private boolean toestand = false;
    public void aan() { toestand = true; }
    public void uit() { toestand = false; }
    public boolean isAan() { return toestand; }
}` }],
    test: T("", `        Aanzetbaar a = new Lamp();
        check("start uit", !a.isAan());
        a.aan();
        check("na aan() aan", a.isAan());
        a.uit();
        check("na uit() uit", !a.isAan());`) },
];

async function run() {
  for (const ex of exercises) {
    const files = [ex.test, ...ex.solution];
    let data;
    try {
      const res = await fetch(URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ files }) });
      data = await res.json();
    } catch (e) { console.log(`### ${ex.id}: NETWERKFOUT ${e.message}`); continue; }
    const stdout = data?.run?.stdout ?? "";
    const compileErr = data?.compile?.stderr ?? "";
    const passed = stdout.includes(MARKER);
    console.log(`### ${ex.id}: ${passed ? "PASS ✓" : "FAIL ✗"} (${data.wallTimeMs}ms)`);
    if (compileErr.trim() && !passed) console.log("  COMPILE: " + compileErr.trim().split("\n").slice(0,3).join(" | "));
    if (stdout.trim() && !passed) console.log("  STDOUT: " + stdout.trim());
    if (!stdout.trim() && data.error) console.log("  ERROR: " + data.error);
  }
}
run();
