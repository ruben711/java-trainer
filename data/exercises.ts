import type { Exercise } from "@/lib/exercises";
import { EXTRA_EXERCISES } from "./exercises-extra";

const TEST_HELPER = `    static int geslaagd = 0, gefaald = 0;
    static void check(String naam, boolean ok) {
        if (ok) { geslaagd++; System.out.println("[OK]   " + naam); }
        else    { gefaald++; System.out.println("[FOUT] " + naam); }
    }
    static void checkEq(String naam, Object verwacht, Object gekregen) {
        if (java.util.Objects.equals(verwacht, gekregen)) { geslaagd++; System.out.println("[OK]   " + naam); }
        else { gefaald++; System.out.println("[FOUT] " + naam + " | verwacht: " + verwacht + " | kreeg: " + gekregen); }
    }
    static void checkNaby(String naam, double verwacht, double gekregen) {
        if (Math.abs(verwacht - gekregen) < 1e-6) { geslaagd++; System.out.println("[OK]   " + naam); }
        else { gefaald++; System.out.println("[FOUT] " + naam + " | verwacht: " + verwacht + " | kreeg: " + gekregen); }
    }
    static void klaar() {
        System.out.println();
        System.out.println(geslaagd + " geslaagd, " + gefaald + " gefaald.");
        if (gefaald == 0) System.out.println("ALLE TESTS GESLAAGD");
    }`;

export const EXERCISES: Exercise[] = [
  // ─────────────────────────────────────────────────────────────────
  {
    id: "jas",
    chapterId: "H6",
    title: "Jas (enums & ArrayList)",
    difficulty: "easy",
    tags: ["enum", "ArrayList", "toString"],
    prompt: `Ontwerp een klasse **Jas** met een maat, een kleur en een prijs.

- De **maat** is van het type \`Maat\`, een **enum** met deze waarden en bijhorende grootte: \`S\`=38, \`M\`=40, \`L\`=42, \`XL\`=44, \`XXL\`=46. Voorzie een methode \`getGrootte()\`.
- De **kleur** is van het type \`Kleur\`, een **enum**: \`ROOD\`, \`BLAUW\`, \`GROEN\`, \`GRIJS\`, \`BEIGE\`, \`ZWART\`.
- De **prijs** is een \`double\`.
- Voorzie een constructor \`Jas(Maat maat, Kleur kleur, double prijs)\`, getters \`getMaat()\`, \`getKleur()\`, \`getPrijs()\` en een \`toString()\` die kleur, maat en prijs toont.

Maak in \`Main\` een paar \`Jas\`-objecten en voeg ze toe aan een \`ArrayList<Jas>\` (het kledingrek). Toon eerst alle maten met hun grootte, dan alle kleuren, en ten slotte alle jassen.`,
    example: `Mogelijke maten:
  S = 38
  M = 40
  ...
Kledingrek:
  Jas [maat=M (40), kleur=ROOD, prijs=49.99]`,
    starterFiles: [
      { name: "Maat.java", content: `public enum Maat {
    // TODO: voeg de waarden toe met hun grootte (S=38, M=40, L=42, XL=44, XXL=46)
    S, M, L, XL, XXL;

    // TODO: veld 'grootte', constructor en getGrootte()
}
` },
      { name: "Kleur.java", content: `public enum Kleur {
    // TODO: ROOD, BLAUW, GROEN, GRIJS, BEIGE, ZWART
}
` },
      { name: "Jas.java", content: `public class Jas {
    // TODO: velden maat (Maat), kleur (Kleur), prijs (double)

    // TODO: constructor Jas(Maat maat, Kleur kleur, double prijs)

    // TODO: getters getMaat(), getKleur(), getPrijs()

    // TODO: toString() met kleur, maat (+ grootte) en prijs
}
` },
      { name: "Main.java", content: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // TODO: toon alle maten met hun grootte
        // TODO: toon alle kleuren
        // TODO: maak een ArrayList<Jas> en toon de jassen
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "enum\\s+Maat", message: "Maat moet een enum zijn." },
        { pattern: "enum\\s+Kleur", message: "Kleur moet een enum zijn." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        check("Maat heeft 5 waarden", Maat.values().length == 5);
        check("Maat.S grootte = 38", Maat.S.getGrootte() == 38);
        check("Maat.M grootte = 40", Maat.M.getGrootte() == 40);
        check("Maat.XXL grootte = 46", Maat.XXL.getGrootte() == 46);
        check("Kleur heeft 6 waarden", Kleur.values().length == 6);
        Jas j = new Jas(Maat.L, Kleur.ROOD, 49.99);
        check("getMaat", j.getMaat() == Maat.L);
        check("getKleur", j.getKleur() == Kleur.ROOD);
        check("getPrijs", Math.abs(j.getPrijs() - 49.99) < 0.001);
        String s = j.toString();
        check("toString bevat kleur", s.contains("ROOD"));
        check("toString bevat prijs", s.contains("49"));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Maat.java", content: `public enum Maat {
    S(38), M(40), L(42), XL(44), XXL(46);
    private final int grootte;
    Maat(int grootte) { this.grootte = grootte; }
    public int getGrootte() { return grootte; }
}
` },
      { name: "Kleur.java", content: `public enum Kleur {
    ROOD, BLAUW, GROEN, GRIJS, BEIGE, ZWART
}
` },
      { name: "Jas.java", content: `public class Jas {
    private Maat maat;
    private Kleur kleur;
    private double prijs;

    public Jas(Maat maat, Kleur kleur, double prijs) {
        this.maat = maat;
        this.kleur = kleur;
        this.prijs = prijs;
    }

    public Maat getMaat() { return maat; }
    public Kleur getKleur() { return kleur; }
    public double getPrijs() { return prijs; }

    public String toString() {
        return "Jas [maat=" + maat + " (" + maat.getGrootte() + "), kleur=" + kleur + ", prijs=" + prijs + "]";
    }
}
` },
      { name: "Main.java", content: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        System.out.println("Mogelijke maten:");
        for (Maat m : Maat.values()) {
            System.out.println("  " + m + " = " + m.getGrootte());
        }
        System.out.println("Mogelijke kleuren:");
        for (Kleur k : Kleur.values()) {
            System.out.println("  " + k);
        }
        ArrayList<Jas> kledingrek = new ArrayList<>();
        kledingrek.add(new Jas(Maat.M, Kleur.ROOD, 49.99));
        kledingrek.add(new Jas(Maat.L, Kleur.ZWART, 79.50));
        kledingrek.add(new Jas(Maat.XL, Kleur.BLAUW, 59.95));
        System.out.println("Kledingrek:");
        for (Jas j : kledingrek) {
            System.out.println("  " + j);
        }
    }
}
` },
    ],
    relatedConcepts: ["enum", "ArrayList"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "watersportclub-boten",
    chapterId: "H10",
    title: "Watersportclub: zeil- en motorboten",
    difficulty: "medium",
    tags: ["overerving", "extends", "super", "polymorfisme"],
    prompt: `Een watersportclub verhuurt boten aan haar leden. Er zijn **zeilboten** en **motorboten**.

**Boot** (basisklasse): naam, \`basisprijsPerUur\` (double) en of er een **radar** aan boord is. De radar geeft **5%** toeslag. Methode \`berekenPrijsPerUur()\` geeft de prijs per uur (basisprijs + eventuele radartoeslag). Voorzie ook \`getBasisprijsPerUur()\`.

- **Zeilboot** \`extends Boot\`: kan naast radar ook een **gps** aan boord hebben → extra **3%** toeslag. Override \`berekenPrijsPerUur()\`.
- **Motorboot** \`extends Boot\`: kan naast radar een **fishfinder** hebben → extra **7%** toeslag. Override \`berekenPrijsPerUur()\`.

**Lid**: naam en telefoonnummer; een lid heeft een \`kortingPercentage\` (double, standaard 0, aanpasbaar via \`setKortingPercentage\`). Voorzie \`getKortingPercentage()\`.

**Reservatie** \`(Lid lid, Boot boot, double aantalUren)\`: methode \`teBetalen()\` = prijs-per-uur × aantal uren, verminderd met de korting van het lid.

> Constructors: \`Zeilboot(String naam, double basisprijs, boolean radar, boolean gps)\`, \`Motorboot(String naam, double basisprijs, boolean radar, boolean fishfinder)\`, \`Lid(String naam, String telefoon)\`.`,
    starterFiles: [
      { name: "Boot.java", content: `public class Boot {
    // TODO: velden naam, basisprijsPerUur, radar

    public Boot(String naam, double basisprijsPerUur, boolean radar) {
        // TODO
    }

    public String getNaam() { return ""; /* TODO */ }
    public double getBasisprijsPerUur() { return 0; /* TODO */ }

    public double berekenPrijsPerUur() {
        // TODO: basisprijs + 5% als radar aan boord
        return 0;
    }
}
` },
      { name: "Zeilboot.java", content: `public class Zeilboot extends Boot {
    // TODO: veld gps

    public Zeilboot(String naam, double basisprijsPerUur, boolean radar, boolean gps) {
        super(naam, basisprijsPerUur, radar);
        // TODO
    }

    // TODO: override berekenPrijsPerUur() — +3% voor gps
}
` },
      { name: "Motorboot.java", content: `public class Motorboot extends Boot {
    // TODO: veld fishfinder

    public Motorboot(String naam, double basisprijsPerUur, boolean radar, boolean fishfinder) {
        super(naam, basisprijsPerUur, radar);
        // TODO
    }

    // TODO: override berekenPrijsPerUur() — +7% voor fishfinder
}
` },
      { name: "Lid.java", content: `public class Lid {
    // TODO: velden naam, telefoonnummer, kortingPercentage (standaard 0)

    public Lid(String naam, String telefoonnummer) {
        // TODO
    }

    public String getNaam() { return ""; /* TODO */ }
    public double getKortingPercentage() { return 0; /* TODO */ }
    public void setKortingPercentage(double kortingPercentage) { /* TODO */ }
}
` },
      { name: "Reservatie.java", content: `public class Reservatie {
    public Reservatie(Lid lid, Boot boot, double aantalUren) {
        // TODO
    }

    public double teBetalen() {
        // TODO: prijs per uur * aantal uren, min korting van het lid
        return 0;
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        // TODO: maak boten en leden, plaats reservaties en toon wat ze kosten
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Zeilboot\\s+extends\\s+Boot", message: "Zeilboot moet overerven van Boot (extends Boot)." },
        { pattern: "class\\s+Motorboot\\s+extends\\s+Boot", message: "Motorboot moet overerven van Boot (extends Boot)." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.0001; }
    public static void main(String[] args) {
        Boot z1 = new Zeilboot("Z", 100, false, false);
        check("zeilboot zonder extra = 100", eq(z1.berekenPrijsPerUur(), 100));
        Boot z2 = new Zeilboot("Z", 100, true, true);
        check("zeilboot radar+gps = 108", eq(z2.berekenPrijsPerUur(), 108));
        Boot m1 = new Motorboot("M", 100, true, true);
        check("motorboot radar+fishfinder = 112", eq(m1.berekenPrijsPerUur(), 112));
        Boot m2 = new Motorboot("M", 100, false, true);
        check("motorboot fishfinder = 107", eq(m2.berekenPrijsPerUur(), 107));
        Lid lid = new Lid("Karel", "0477");
        lid.setKortingPercentage(10);
        Reservatie r = new Reservatie(lid, z1, 2);
        check("reservatie met 10% korting = 180", eq(r.teBetalen(), 180));
        Lid gewoon = new Lid("Piet", "0488");
        check("gewoon lid korting 0", eq(gewoon.getKortingPercentage(), 0));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Boot.java", content: `public class Boot {
    private String naam;
    private double basisprijsPerUur;
    private boolean radar;

    public Boot(String naam, double basisprijsPerUur, boolean radar) {
        this.naam = naam;
        this.basisprijsPerUur = basisprijsPerUur;
        this.radar = radar;
    }

    public String getNaam() { return naam; }
    public double getBasisprijsPerUur() { return basisprijsPerUur; }
    public boolean isRadar() { return radar; }

    public double berekenPrijsPerUur() {
        return basisprijsPerUur + (radar ? basisprijsPerUur * 0.05 : 0);
    }

    public String toString() { return naam; }
}
` },
      { name: "Zeilboot.java", content: `public class Zeilboot extends Boot {
    private boolean gps;

    public Zeilboot(String naam, double basisprijsPerUur, boolean radar, boolean gps) {
        super(naam, basisprijsPerUur, radar);
        this.gps = gps;
    }

    public double berekenPrijsPerUur() {
        return super.berekenPrijsPerUur() + (gps ? getBasisprijsPerUur() * 0.03 : 0);
    }
}
` },
      { name: "Motorboot.java", content: `public class Motorboot extends Boot {
    private boolean fishfinder;

    public Motorboot(String naam, double basisprijsPerUur, boolean radar, boolean fishfinder) {
        super(naam, basisprijsPerUur, radar);
        this.fishfinder = fishfinder;
    }

    public double berekenPrijsPerUur() {
        return super.berekenPrijsPerUur() + (fishfinder ? getBasisprijsPerUur() * 0.07 : 0);
    }
}
` },
      { name: "Lid.java", content: `public class Lid {
    private String naam;
    private String telefoonnummer;
    private double kortingPercentage;

    public Lid(String naam, String telefoonnummer) {
        this.naam = naam;
        this.telefoonnummer = telefoonnummer;
        this.kortingPercentage = 0;
    }

    public String getNaam() { return naam; }
    public void setTelefoonnummer(String telefoonnummer) { this.telefoonnummer = telefoonnummer; }
    public double getKortingPercentage() { return kortingPercentage; }
    public void setKortingPercentage(double kortingPercentage) { this.kortingPercentage = kortingPercentage; }
}
` },
      { name: "Reservatie.java", content: `public class Reservatie {
    private Lid lid;
    private Boot boot;
    private double aantalUren;

    public Reservatie(Lid lid, Boot boot, double aantalUren) {
        this.lid = lid;
        this.boot = boot;
        this.aantalUren = aantalUren;
    }

    public double teBetalen() {
        double prijs = boot.berekenPrijsPerUur() * aantalUren;
        return prijs - prijs * (lid.getKortingPercentage() / 100.0);
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        Boot marieLou = new Zeilboot("Marie-Lou", 25, false, true);
        Boot blueMoon = new Motorboot("BlueMoon", 50, true, true);
        Lid karel = new Lid("Karel", "0477/000000");
        karel.setKortingPercentage(10);

        Reservatie r1 = new Reservatie(karel, marieLou, 3);
        Reservatie r2 = new Reservatie(karel, blueMoon, 2);
        System.out.println("Te betalen r1: " + r1.teBetalen());
        System.out.println("Te betalen r2: " + r2.teBetalen());
    }
}
` },
    ],
    relatedConcepts: ["extends", "super", "@Override", "polymorfisme"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "lez",
    chapterId: "OBJ",
    title: "Lage-emissiezone (HashMap)",
    difficulty: "medium",
    tags: ["HashMap", "collections", "encapsulatie"],
    prompt: `Een lage-emissiezone (LEZ) laat enkel voertuigen toe op basis van hun brandstof en euronorm.

**Auto**: \`nummerplaat\`, \`merk\`, \`kleur\`, \`euronorm\` (int 1–6) en \`brandstof\` (String: "Diesel", "Benzine" of "Elektrisch"). Een auto kan **niet** aangepast worden (enkel getters). Voorzie minstens \`getNummerplaat()\`, \`getEuronorm()\`, \`getBrandstof()\`.

**LezChecker**: houdt de auto's bij in een **HashMap** met de nummerplaat als sleutel (snelle opzoeking — er zijn ~6 miljoen auto's). Methodes:
- \`inschrijvenAuto(Auto auto)\` — voegt toe
- \`uitschrijvenAuto(String nummerplaat)\` — verwijdert
- \`String controleerLezGent(String nummerplaat)\` — geeft één van: \`Toegang\`, \`Toegang na betaling\`, \`Toegang met LEZ-dagpas\`, \`Nummerplaat onbekend\`.

**Regels voor Gent** (vereenvoudigd):
- **Elektrisch** → altijd \`Toegang\`
- **Diesel**: euronorm ≥ 6 → \`Toegang\` · = 5 → \`Toegang na betaling\` · ≤ 4 → \`Toegang met LEZ-dagpas\`
- **Benzine**: euronorm ≥ 3 → \`Toegang\` · = 2 → \`Toegang na betaling\` · ≤ 1 → \`Toegang met LEZ-dagpas\`
- Onbekende nummerplaat → \`Nummerplaat onbekend\``,
    starterFiles: [
      { name: "Auto.java", content: `public class Auto {
    // TODO: onveranderlijke velden nummerplaat, merk, kleur, euronorm (int), brandstof

    public Auto(String nummerplaat, String merk, String kleur, int euronorm, String brandstof) {
        // TODO
    }

    public String getNummerplaat() { return ""; /* TODO */ }
    public int getEuronorm() { return 0; /* TODO */ }
    public String getBrandstof() { return ""; /* TODO */ }
}
` },
      { name: "LezChecker.java", content: `import java.util.HashMap;

public class LezChecker {
    // TODO: HashMap<String, Auto> met nummerplaat als sleutel

    public void inschrijvenAuto(Auto auto) {
        // TODO
    }

    public void uitschrijvenAuto(String nummerplaat) {
        // TODO
    }

    public String controleerLezGent(String nummerplaat) {
        // TODO: pas de Gent-regels toe
        return "Nummerplaat onbekend";
    }
}
` },
      { name: "Hoofdklasse.java", content: `public class Hoofdklasse {
    public static void main(String[] args) {
        // TODO: maak een 7-tal auto's, schrijf ze in en controleer ze één voor één
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "HashMap", message: "Gebruik een HashMap voor de snelle opzoeking op nummerplaat." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        LezChecker c = new LezChecker();
        check("onbekende nummerplaat", c.controleerLezGent("X-1").equals("Nummerplaat onbekend"));
        c.inschrijvenAuto(new Auto("D6", "VW", "zwart", 6, "Diesel"));
        c.inschrijvenAuto(new Auto("D5", "VW", "zwart", 5, "Diesel"));
        c.inschrijvenAuto(new Auto("D4", "VW", "zwart", 4, "Diesel"));
        c.inschrijvenAuto(new Auto("B3", "VW", "grijs", 3, "Benzine"));
        c.inschrijvenAuto(new Auto("B2", "VW", "grijs", 2, "Benzine"));
        c.inschrijvenAuto(new Auto("B1", "VW", "grijs", 1, "Benzine"));
        c.inschrijvenAuto(new Auto("E1", "Tesla", "rood", 1, "Elektrisch"));
        check("diesel euro6 -> Toegang", c.controleerLezGent("D6").equals("Toegang"));
        check("diesel euro5 -> na betaling", c.controleerLezGent("D5").equals("Toegang na betaling"));
        check("diesel euro4 -> dagpas", c.controleerLezGent("D4").equals("Toegang met LEZ-dagpas"));
        check("benzine euro3 -> Toegang", c.controleerLezGent("B3").equals("Toegang"));
        check("benzine euro2 -> na betaling", c.controleerLezGent("B2").equals("Toegang na betaling"));
        check("benzine euro1 -> dagpas", c.controleerLezGent("B1").equals("Toegang met LEZ-dagpas"));
        check("elektrisch -> Toegang", c.controleerLezGent("E1").equals("Toegang"));
        c.uitschrijvenAuto("D6");
        check("na uitschrijven onbekend", c.controleerLezGent("D6").equals("Nummerplaat onbekend"));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Auto.java", content: `public class Auto {
    private final String nummerplaat;
    private final String merk;
    private final String kleur;
    private final int euronorm;
    private final String brandstof;

    public Auto(String nummerplaat, String merk, String kleur, int euronorm, String brandstof) {
        this.nummerplaat = nummerplaat;
        this.merk = merk;
        this.kleur = kleur;
        this.euronorm = euronorm;
        this.brandstof = brandstof;
    }

    public String getNummerplaat() { return nummerplaat; }
    public String getMerk() { return merk; }
    public String getKleur() { return kleur; }
    public int getEuronorm() { return euronorm; }
    public String getBrandstof() { return brandstof; }
}
` },
      { name: "LezChecker.java", content: `import java.util.HashMap;

public class LezChecker {
    private HashMap<String, Auto> autos = new HashMap<>();

    public void inschrijvenAuto(Auto auto) {
        autos.put(auto.getNummerplaat(), auto);
    }

    public void uitschrijvenAuto(String nummerplaat) {
        autos.remove(nummerplaat);
    }

    public String controleerLezGent(String nummerplaat) {
        Auto auto = autos.get(nummerplaat);
        if (auto == null) return "Nummerplaat onbekend";
        if (auto.getBrandstof().equals("Elektrisch")) return "Toegang";
        int e = auto.getEuronorm();
        if (auto.getBrandstof().equals("Diesel")) {
            if (e >= 6) return "Toegang";
            if (e == 5) return "Toegang na betaling";
            return "Toegang met LEZ-dagpas";
        }
        if (auto.getBrandstof().equals("Benzine")) {
            if (e >= 3) return "Toegang";
            if (e == 2) return "Toegang na betaling";
            return "Toegang met LEZ-dagpas";
        }
        return "Nummerplaat onbekend";
    }
}
` },
      { name: "Hoofdklasse.java", content: `public class Hoofdklasse {
    public static void main(String[] args) {
        LezChecker checker = new LezChecker();
        Auto[] autos = {
            new Auto("1-ABC-001", "VW", "zwart", 6, "Diesel"),
            new Auto("1-ABC-002", "Opel", "wit", 5, "Diesel"),
            new Auto("1-ABC-003", "Ford", "blauw", 4, "Diesel"),
            new Auto("1-ABC-004", "Audi", "grijs", 3, "Benzine"),
            new Auto("1-ABC-005", "Seat", "rood", 2, "Benzine"),
            new Auto("1-ABC-006", "Fiat", "groen", 1, "Benzine"),
            new Auto("1-ABC-007", "Tesla", "zwart", 1, "Elektrisch"),
        };
        for (Auto a : autos) checker.inschrijvenAuto(a);
        for (Auto a : autos) {
            System.out.println(a.getNummerplaat() + ": " + checker.controleerLezGent(a.getNummerplaat()));
        }
        checker.uitschrijvenAuto("1-ABC-001");
        System.out.println("1-ABC-001 na uitschrijven: " + checker.controleerLezGent("1-ABC-001"));
    }
}
` },
    ],
    relatedConcepts: ["HashMap", "encapsulatie", "final"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "lotto",
    chapterId: "OBJ",
    title: "Lotto (Set & Random)",
    difficulty: "medium",
    tags: ["Set", "collections", "Random"],
    prompt: `Ontwerp een klasse **Lotto** die 6 winnende getallen (1 t/m 45) bepaalt, plus een **reservegetal**. De getallen zijn onderling verschillend en het reservegetal zit niet bij de 6.

- De winnende getallen worden bepaald **tijdens de constructie** van een \`Lotto\`-object.
- \`nieuweTrekking()\` genereert een nieuwe combinatie.
- \`getGetallen()\` geeft een \`Set<Integer>\` met de 6 getallen, \`getReserveGetal()\` geeft het reservegetal.
- Een \`toString()\` toont alle winnende getallen + het reservegetal.

> Gebruik **geen arrays**, maar klassen uit \`java.util\` (bv. een \`Set\` en \`Random\`).`,
    starterFiles: [
      { name: "Lotto.java", content: `import java.util.Set;
import java.util.Random;

public class Lotto {
    // TODO: velden voor de 6 getallen (een Set), het reservegetal en een Random

    public Lotto() {
        // TODO: roep nieuweTrekking() aan
    }

    public void nieuweTrekking() {
        // TODO: bepaal 6 unieke getallen (1..45) en een reservegetal dat niet bij de 6 zit
    }

    public Set<Integer> getGetallen() { return null; /* TODO */ }
    public int getReserveGetal() { return 0; /* TODO */ }

    public String toString() { return ""; /* TODO */ }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        Lotto lotto = new Lotto();
        System.out.println(lotto);
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "Set<|HashSet|TreeSet|Random|java\\.util", message: "Gebruik een collectie uit java.util (bv. een Set) en Random, geen array." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Lotto l = new Lotto();
        java.util.Set<Integer> g = l.getGetallen();
        check("6 winnende getallen", g.size() == 6);
        boolean range = true; for (int x : g) if (x < 1 || x > 45) range = false;
        check("getallen tussen 1 en 45", range);
        int r = l.getReserveGetal();
        check("reserve tussen 1 en 45", r >= 1 && r <= 45);
        check("reserve niet bij de 6", !g.contains(r));
        l.nieuweTrekking();
        check("na nieuwe trekking opnieuw 6", l.getGetallen().size() == 6);
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Lotto.java", content: `import java.util.Set;
import java.util.TreeSet;
import java.util.Random;

public class Lotto {
    private Set<Integer> getallen;
    private int reserveGetal;
    private final Random random = new Random();

    public Lotto() {
        nieuweTrekking();
    }

    public void nieuweTrekking() {
        getallen = new TreeSet<>();
        while (getallen.size() < 6) {
            getallen.add(random.nextInt(45) + 1);
        }
        do {
            reserveGetal = random.nextInt(45) + 1;
        } while (getallen.contains(reserveGetal));
    }

    public Set<Integer> getGetallen() { return getallen; }
    public int getReserveGetal() { return reserveGetal; }

    public String toString() {
        return "Winnende getallen: " + getallen + " | Reserve: " + reserveGetal;
    }
}
` },
    ],
    relatedConcepts: ["Set", "Random", "TreeSet"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "landbouw",
    chapterId: "H11",
    title: "Landbouw (abstracte klasse & polymorfisme)",
    difficulty: "hard",
    tags: ["abstract", "overerving", "polymorfisme", "enum"],
    prompt: `Een landbouwbedrijf heeft nul of meer **percelen** grond: **akkers** of **weilanden**.

**Perceel** (abstract): \`oppervlakte\` (ha) en een onveranderlijk \`referentienummer\`. Abstracte methode \`berekenJaaropbrengst()\`.

- **Akker** \`extends Perceel\`: teelt één **Vrucht** (enum met coëfficiënt). Opbrengst = oppervlakte × coëfficiënt. Coëfficiënten: \`AARDAPPELEN\` 10200, \`RODE_KOOL\` 11900, \`PREI\` 14500, \`BLOEMKOOL\` 13200, \`TARWE\` 18300, \`BIETEN\` 9800. (vb. bieten 1.5 ha → 14700)
- **Weiland** \`extends Perceel\`: \`aantalKoeien\` en \`melkprijs\`. Een koe geeft 10 l/dag × 200 dagen. Opbrengst = liters × melkprijs − 250 € onderhoud per hectare.

**Landbouwbedrijf**: onveranderlijk \`referentienummer\`, naam, adres; \`addPerceel(Perceel)\` en \`getTotaleOpbrengst()\`.

> Vereiste namen: \`Perceel.berekenJaaropbrengst()\`, \`Akker(double, String, Vrucht)\`, \`Weiland(double, String, int aantalKoeien, double melkprijs)\`, \`Vrucht.getCoefficient()\`, \`Landbouwbedrijf(String, String, String)\`.`,
    starterFiles: [
      { name: "Vrucht.java", content: `public enum Vrucht {
    // TODO: AARDAPPELEN(10200), RODE_KOOL(11900), PREI(14500), BLOEMKOOL(13200), TARWE(18300), BIETEN(9800)

    // TODO: veld coefficient, constructor en getCoefficient()
}
` },
      { name: "Perceel.java", content: `public abstract class Perceel {
    private final String referentienummer;
    private double oppervlakte;

    public Perceel(double oppervlakte, String referentienummer) {
        this.oppervlakte = oppervlakte;
        this.referentienummer = referentienummer;
    }

    public double getOppervlakte() { return oppervlakte; }
    public String getReferentienummer() { return referentienummer; }

    public abstract double berekenJaaropbrengst();
}
` },
      { name: "Akker.java", content: `public class Akker extends Perceel {
    public Akker(double oppervlakte, String referentienummer, Vrucht vrucht) {
        super(oppervlakte, referentienummer);
        // TODO: bewaar de vrucht
    }

    public double berekenJaaropbrengst() {
        return 0; // TODO: oppervlakte * coefficient van de vrucht
    }
}
` },
      { name: "Weiland.java", content: `public class Weiland extends Perceel {
    public Weiland(double oppervlakte, String referentienummer, int aantalKoeien, double melkprijs) {
        super(oppervlakte, referentienummer);
        // TODO
    }

    public double berekenJaaropbrengst() {
        return 0; // TODO: (aantalKoeien * 10 * 200) * melkprijs - 250 * oppervlakte
    }
}
` },
      { name: "Landbouwbedrijf.java", content: `import java.util.ArrayList;

public class Landbouwbedrijf {
    public Landbouwbedrijf(String referentienummer, String naam, String adres) {
        // TODO
    }

    public void addPerceel(Perceel p) {
        // TODO
    }

    public double getTotaleOpbrengst() {
        return 0; // TODO: som van de jaaropbrengsten
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        // TODO: maak een landbouwbedrijf met enkele percelen en toon de totale opbrengst
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "enum\\s+Vrucht", message: "Vrucht moet een enum zijn." },
        { pattern: "abstract\\s+class\\s+Perceel", message: "Perceel moet een abstracte klasse zijn." },
        { pattern: "class\\s+Akker\\s+extends\\s+Perceel", message: "Akker moet overerven van Perceel." },
        { pattern: "class\\s+Weiland\\s+extends\\s+Perceel", message: "Weiland moet overerven van Perceel." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        Akker bieten = new Akker(1.5, "A1", Vrucht.BIETEN);
        check("akker bieten 1.5ha = 14700", eq(bieten.berekenJaaropbrengst(), 14700));
        Akker tarwe = new Akker(2.0, "A2", Vrucht.TARWE);
        check("akker tarwe 2ha = 36600", eq(tarwe.berekenJaaropbrengst(), 36600));
        Weiland w = new Weiland(2.0, "W1", 10, 0.5);
        check("weiland 10 koeien 0.5 = 9500", eq(w.berekenJaaropbrengst(), 9500));
        Perceel p = bieten;
        check("polymorfe aanroep", eq(p.berekenJaaropbrengst(), 14700));
        Landbouwbedrijf bedrijf = new Landbouwbedrijf("R1", "Boer", "Straat 1");
        bedrijf.addPerceel(bieten); bedrijf.addPerceel(w);
        check("totale opbrengst = 24200", eq(bedrijf.getTotaleOpbrengst(), 24200));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Vrucht.java", content: `public enum Vrucht {
    AARDAPPELEN(10200), RODE_KOOL(11900), PREI(14500), BLOEMKOOL(13200), TARWE(18300), BIETEN(9800);
    private final double coefficient;
    Vrucht(double coefficient) { this.coefficient = coefficient; }
    public double getCoefficient() { return coefficient; }
}
` },
      { name: "Perceel.java", content: `public abstract class Perceel {
    private final String referentienummer;
    private double oppervlakte;

    public Perceel(double oppervlakte, String referentienummer) {
        this.oppervlakte = oppervlakte;
        this.referentienummer = referentienummer;
    }

    public double getOppervlakte() { return oppervlakte; }
    public String getReferentienummer() { return referentienummer; }

    public abstract double berekenJaaropbrengst();
}
` },
      { name: "Akker.java", content: `public class Akker extends Perceel {
    private Vrucht vrucht;

    public Akker(double oppervlakte, String referentienummer, Vrucht vrucht) {
        super(oppervlakte, referentienummer);
        this.vrucht = vrucht;
    }

    public double berekenJaaropbrengst() {
        return getOppervlakte() * vrucht.getCoefficient();
    }
}
` },
      { name: "Weiland.java", content: `public class Weiland extends Perceel {
    private int aantalKoeien;
    private double melkprijs;

    public Weiland(double oppervlakte, String referentienummer, int aantalKoeien, double melkprijs) {
        super(oppervlakte, referentienummer);
        this.aantalKoeien = aantalKoeien;
        this.melkprijs = melkprijs;
    }

    public void setAantalKoeien(int aantalKoeien) { this.aantalKoeien = aantalKoeien; }
    public void setMelkprijs(double melkprijs) { this.melkprijs = melkprijs; }

    public double berekenJaaropbrengst() {
        double liter = aantalKoeien * 10 * 200;
        return liter * melkprijs - 250.0 * getOppervlakte();
    }
}
` },
      { name: "Landbouwbedrijf.java", content: `import java.util.ArrayList;

public class Landbouwbedrijf {
    private final String referentienummer;
    private String naam;
    private String adres;
    private ArrayList<Perceel> percelen = new ArrayList<>();

    public Landbouwbedrijf(String referentienummer, String naam, String adres) {
        this.referentienummer = referentienummer;
        this.naam = naam;
        this.adres = adres;
    }

    public void addPerceel(Perceel p) { percelen.add(p); }
    public ArrayList<Perceel> getPercelen() { return percelen; }

    public double getTotaleOpbrengst() {
        double totaal = 0;
        for (Perceel p : percelen) totaal += p.berekenJaaropbrengst();
        return totaal;
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        Landbouwbedrijf bedrijf = new Landbouwbedrijf("R1", "De Boer", "Akkerstraat 1");
        bedrijf.addPerceel(new Akker(1.5, "A1", Vrucht.BIETEN));
        bedrijf.addPerceel(new Weiland(2.0, "W1", 10, 0.5));
        System.out.println("Totale opbrengst: " + bedrijf.getTotaleOpbrengst());
    }
}
` },
    ],
    relatedConcepts: ["abstract class", "polymorfisme", "enum"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "watersportclub-leden",
    chapterId: "H11",
    title: "Watersportclub: leden & gouden leden",
    difficulty: "medium",
    tags: ["overerving", "polymorfisme", "@Override"],
    prompt: `Uitbreiding op *Watersportclub: zeil- en motorboten*. Naast een gewoon **Lid** bestaat er nu ook een **GoudenLid**.

- **Lid**: naam en telefoonnummer. Een gewoon lid heeft **0%** korting → \`getKortingPercentage()\` geeft 0.
- **GoudenLid** \`extends Lid\`: heeft een aantal **aandelen** (\`getAantalAandelen()\`) en **override** \`getKortingPercentage()\` zodat het **5%** korting geeft.
- \`Reservatie.teBetalen()\` past de korting van het lid toe — **polymorf**, dus dezelfde code werkt voor beide soorten leden.

De bootklassen (Boot, Zeilboot, Motorboot) en Reservatie zijn al gegeven. Implementeer **GoudenLid**.

> Constructor: \`GoudenLid(String naam, String telefoon, int aantalAandelen)\`.`,
    starterFiles: [
      { name: "GoudenLid.java", content: `public class GoudenLid extends Lid {
    public GoudenLid(String naam, String telefoonnummer, int aantalAandelen) {
        super(naam, telefoonnummer);
        // TODO: bewaar het aantal aandelen
    }

    public int getAantalAandelen() {
        return 0; // TODO
    }

    // TODO: override getKortingPercentage() zodat een gouden lid 5% korting heeft
}
` },
      { name: "Lid.java", content: `public class Lid {
    private String naam;
    private String telefoonnummer;

    public Lid(String naam, String telefoonnummer) {
        this.naam = naam;
        this.telefoonnummer = telefoonnummer;
    }

    public String getNaam() { return naam; }
    public double getKortingPercentage() { return 0; }
}
` },
      { name: "Boot.java", content: `public class Boot {
    private String naam;
    private double basisprijsPerUur;
    private boolean radar;

    public Boot(String naam, double basisprijsPerUur, boolean radar) {
        this.naam = naam; this.basisprijsPerUur = basisprijsPerUur; this.radar = radar;
    }

    public String getNaam() { return naam; }
    public double getBasisprijsPerUur() { return basisprijsPerUur; }

    public double berekenPrijsPerUur() {
        return basisprijsPerUur + (radar ? basisprijsPerUur * 0.05 : 0);
    }
}
` },
      { name: "Zeilboot.java", content: `public class Zeilboot extends Boot {
    private boolean gps;
    public Zeilboot(String naam, double basisprijsPerUur, boolean radar, boolean gps) {
        super(naam, basisprijsPerUur, radar);
        this.gps = gps;
    }
    public double berekenPrijsPerUur() {
        return super.berekenPrijsPerUur() + (gps ? getBasisprijsPerUur() * 0.03 : 0);
    }
}
` },
      { name: "Motorboot.java", content: `public class Motorboot extends Boot {
    private boolean fishfinder;
    public Motorboot(String naam, double basisprijsPerUur, boolean radar, boolean fishfinder) {
        super(naam, basisprijsPerUur, radar);
        this.fishfinder = fishfinder;
    }
    public double berekenPrijsPerUur() {
        return super.berekenPrijsPerUur() + (fishfinder ? getBasisprijsPerUur() * 0.07 : 0);
    }
}
` },
      { name: "Reservatie.java", content: `public class Reservatie {
    private Lid lid;
    private Boot boot;
    private double aantalUren;

    public Reservatie(Lid lid, Boot boot, double aantalUren) {
        this.lid = lid; this.boot = boot; this.aantalUren = aantalUren;
    }

    public double teBetalen() {
        double prijs = boot.berekenPrijsPerUur() * aantalUren;
        return prijs - prijs * (lid.getKortingPercentage() / 100.0);
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        // TODO: maak een gewoon lid en een gouden lid, reserveer en toon wat ze betalen
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+GoudenLid\\s+extends\\s+Lid", message: "GoudenLid moet overerven van Lid." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.0001; }
    public static void main(String[] args) {
        Lid p = new Lid("Piet", "0");
        check("gewoon lid korting 0", eq(p.getKortingPercentage(), 0));
        GoudenLid g = new GoudenLid("Jean", "0", 10);
        check("gouden lid korting 5", eq(g.getKortingPercentage(), 5));
        check("gouden lid aandelen 10", g.getAantalAandelen() == 10);
        check("gouden lid is een Lid", (g instanceof Lid));
        Lid asLid = g;
        check("polymorfe korting", eq(asLid.getKortingPercentage(), 5));
        Boot z = new Zeilboot("Z", 100, false, false);
        Reservatie r = new Reservatie(g, z, 10);
        check("reservatie gouden lid = 950", eq(r.teBetalen(), 950));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "GoudenLid.java", content: `public class GoudenLid extends Lid {
    private int aantalAandelen;

    public GoudenLid(String naam, String telefoonnummer, int aantalAandelen) {
        super(naam, telefoonnummer);
        this.aantalAandelen = aantalAandelen;
    }

    public int getAantalAandelen() { return aantalAandelen; }

    public double getKortingPercentage() { return 5.0; }
}
` },
    ],
    relatedConcepts: ["overerving", "polymorfisme", "@Override"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "watersportclub-exceptions",
    chapterId: "H14",
    title: "Watersportclub waterdicht (exceptions)",
    difficulty: "hard",
    tags: ["exceptions", "RuntimeException", "try/catch"],
    prompt: `Uitbreiding op *Watersportclub: leden & gouden leden*. We voorkomen nu **negatieve prijzen**.

- Schrijf een **eigen ongecontroleerde** exception \`InvalidPriceException\` (\`extends RuntimeException\`).
- Pas de constructor van **Boot** aan zodat er een \`InvalidPriceException\` gegooid wordt bij een **negatieve** basisprijs (het object wordt dan niet aangemaakt). Omdat Zeilboot, Motorboot en Pedalo via \`super(...)\` door Boot gaan, geldt de controle automatisch voor allemaal.
- Voeg een eenvoudige bootsoort **Pedalo** \`extends Boot\` toe: \`Pedalo(String naam, double basisprijs)\` (geen radar).
- Vang in \`Main\` de exceptions netjes op met \`try/catch\`.`,
    starterFiles: [
      { name: "InvalidPriceException.java", content: `public class InvalidPriceException extends RuntimeException {
    public InvalidPriceException(String message) {
        super(message);
    }
}
` },
      { name: "Boot.java", content: `public class Boot {
    private String naam;
    private double basisprijsPerUur;
    private boolean radar;

    public Boot(String naam, double basisprijsPerUur, boolean radar) {
        // TODO: gooi een InvalidPriceException als basisprijsPerUur negatief is
        this.naam = naam; this.basisprijsPerUur = basisprijsPerUur; this.radar = radar;
    }

    public String getNaam() { return naam; }
    public double getBasisprijsPerUur() { return basisprijsPerUur; }

    public double berekenPrijsPerUur() {
        return basisprijsPerUur + (radar ? basisprijsPerUur * 0.05 : 0);
    }
}
` },
      { name: "Pedalo.java", content: `public class Pedalo extends Boot {
    public Pedalo(String naam, double basisprijsPerUur) {
        super(naam, basisprijsPerUur, false);
    }
}
` },
      { name: "Zeilboot.java", content: `public class Zeilboot extends Boot {
    private boolean gps;
    public Zeilboot(String naam, double basisprijsPerUur, boolean radar, boolean gps) {
        super(naam, basisprijsPerUur, radar); this.gps = gps;
    }
    public double berekenPrijsPerUur() {
        return super.berekenPrijsPerUur() + (gps ? getBasisprijsPerUur() * 0.03 : 0);
    }
}
` },
      { name: "Motorboot.java", content: `public class Motorboot extends Boot {
    private boolean fishfinder;
    public Motorboot(String naam, double basisprijsPerUur, boolean radar, boolean fishfinder) {
        super(naam, basisprijsPerUur, radar); this.fishfinder = fishfinder;
    }
    public double berekenPrijsPerUur() {
        return super.berekenPrijsPerUur() + (fishfinder ? getBasisprijsPerUur() * 0.07 : 0);
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        // TODO: probeer een boot met negatieve prijs te maken en vang de exception op met try/catch
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+InvalidPriceException\\s+extends\\s+RuntimeException", message: "InvalidPriceException moet een ongecontroleerde exception zijn (extends RuntimeException)." },
        { pattern: "class\\s+Pedalo\\s+extends\\s+Boot", message: "Pedalo moet overerven van Boot." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.0001; }
    public static void main(String[] args) {
        check("InvalidPriceException is ongecontroleerd", new InvalidPriceException("x") instanceof RuntimeException);
        boolean gegooid = false;
        try { new Motorboot("m", -23, true, true); } catch (InvalidPriceException e) { gegooid = true; }
        check("motorboot negatieve prijs gooit exception", gegooid);
        gegooid = false;
        try { new Pedalo("p", -5); } catch (InvalidPriceException e) { gegooid = true; }
        check("pedalo negatieve prijs gooit exception", gegooid);
        Boot ok = new Zeilboot("ok", 30, false, true);
        check("geldige zeilboot prijs = 30.9", eq(ok.berekenPrijsPerUur(), 30.9));
        Pedalo ped = new Pedalo("pe", 20);
        check("pedalo prijs = 20", eq(ped.berekenPrijsPerUur(), 20));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "InvalidPriceException.java", content: `public class InvalidPriceException extends RuntimeException {
    public InvalidPriceException(String message) {
        super(message);
    }
}
` },
      { name: "Boot.java", content: `public class Boot {
    private String naam;
    private double basisprijsPerUur;
    private boolean radar;

    public Boot(String naam, double basisprijsPerUur, boolean radar) {
        if (basisprijsPerUur < 0) {
            throw new InvalidPriceException("Negatieve prijs: " + basisprijsPerUur);
        }
        this.naam = naam; this.basisprijsPerUur = basisprijsPerUur; this.radar = radar;
    }

    public String getNaam() { return naam; }
    public double getBasisprijsPerUur() { return basisprijsPerUur; }

    public double berekenPrijsPerUur() {
        return basisprijsPerUur + (radar ? basisprijsPerUur * 0.05 : 0);
    }
}
` },
      { name: "Pedalo.java", content: `public class Pedalo extends Boot {
    public Pedalo(String naam, double basisprijsPerUur) {
        super(naam, basisprijsPerUur, false);
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        try {
            Boot kanNiet = new Motorboot("KanNiet", -23, true, true);
            System.out.println(kanNiet.berekenPrijsPerUur());
        } catch (InvalidPriceException e) {
            System.out.println("Fout: " + e.getMessage());
        }
        Boot ok = new Pedalo("Pedalo1", 20);
        System.out.println("Pedalo prijs/uur: " + ok.berekenPrijsPerUur());
    }
}
` },
    ],
    relatedConcepts: ["custom exception", "RuntimeException", "try/catch"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "landbouw-schapen",
    chapterId: "H12",
    title: "Landbouw met schapen (Comparable)",
    difficulty: "hard",
    tags: ["Comparable", "sorteren", "overerving"],
    prompt: `Uitbreiding op *Landbouw*. Voeg een **Schapenweiland** toe en maak de percelen **sorteerbaar** op opbrengst.

- **Schapenweiland** \`extends Perceel\`: \`aantalSchapen\`. Een schaap geeft 4 kg wol per jaar aan €0.30/kg. Onderhoud kost €250 per hectare. Opbrengst = aantalSchapen × 4 × 0.30 − 250 × oppervlakte.
- Laat **Perceel** \`implements Comparable<Perceel>\` zodat percelen **oplopend** volgens hun \`berekenJaaropbrengst()\` gesorteerd kunnen worden (\`Collections.sort\`).

De andere klassen (Vrucht, Akker, Weiland, Landbouwbedrijf) zijn gegeven.

> Vereiste namen: \`Schapenweiland(double, String, int aantalSchapen)\`, \`Perceel implements Comparable<Perceel>\` met \`compareTo\`.`,
    starterFiles: [
      { name: "Perceel.java", content: `public abstract class Perceel {
    // TODO: laat deze klasse Comparable<Perceel> implementeren

    private final String referentienummer;
    private double oppervlakte;

    public Perceel(double oppervlakte, String referentienummer) {
        this.oppervlakte = oppervlakte;
        this.referentienummer = referentienummer;
    }

    public double getOppervlakte() { return oppervlakte; }
    public String getReferentienummer() { return referentienummer; }

    public abstract double berekenJaaropbrengst();

    // TODO: compareTo(Perceel andere) — sorteer oplopend volgens jaaropbrengst
}
` },
      { name: "Schapenweiland.java", content: `public class Schapenweiland extends Perceel {
    public Schapenweiland(double oppervlakte, String referentienummer, int aantalSchapen) {
        super(oppervlakte, referentienummer);
        // TODO
    }

    public double berekenJaaropbrengst() {
        return 0; // TODO: aantalSchapen * 4 * 0.30 - 250 * oppervlakte
    }
}
` },
      { name: "Vrucht.java", content: `public enum Vrucht {
    AARDAPPELEN(10200), RODE_KOOL(11900), PREI(14500), BLOEMKOOL(13200), TARWE(18300), BIETEN(9800);
    private final double coefficient;
    Vrucht(double coefficient) { this.coefficient = coefficient; }
    public double getCoefficient() { return coefficient; }
}
` },
      { name: "Akker.java", content: `public class Akker extends Perceel {
    private Vrucht vrucht;
    public Akker(double oppervlakte, String referentienummer, Vrucht vrucht) {
        super(oppervlakte, referentienummer); this.vrucht = vrucht;
    }
    public double berekenJaaropbrengst() { return getOppervlakte() * vrucht.getCoefficient(); }
}
` },
      { name: "Weiland.java", content: `public class Weiland extends Perceel {
    private int aantalKoeien; private double melkprijs;
    public Weiland(double oppervlakte, String referentienummer, int aantalKoeien, double melkprijs) {
        super(oppervlakte, referentienummer); this.aantalKoeien = aantalKoeien; this.melkprijs = melkprijs;
    }
    public double berekenJaaropbrengst() { return (aantalKoeien * 10 * 200) * melkprijs - 250.0 * getOppervlakte(); }
}
` },
      { name: "Main.java", content: `import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Perceel> percelen = new ArrayList<>();
        percelen.add(new Akker(1.5, "A1", Vrucht.BIETEN));
        percelen.add(new Schapenweiland(1.0, "S1", 1000));
        // Collections.sort(percelen); // werkt zodra Perceel Comparable is
        // TODO: toon de percelen gesorteerd op opbrengst
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Schapenweiland\\s+extends\\s+Perceel", message: "Schapenweiland moet overerven van Perceel." },
        { pattern: "implements\\s+Comparable", message: "Perceel moet Comparable<Perceel> implementeren." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `import java.util.ArrayList;
import java.util.Collections;
public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        Schapenweiland s = new Schapenweiland(1.0, "S1", 1000);
        check("schapenweiland 1000 schapen 1ha = 950", eq(s.berekenJaaropbrengst(), 950));
        Perceel bieten = new Akker(1.5, "A1", Vrucht.BIETEN);
        Perceel weiland = new Weiland(2.0, "W1", 10, 0.5);
        ArrayList<Perceel> percelen = new ArrayList<>();
        percelen.add(bieten); percelen.add(weiland); percelen.add(s);
        Collections.sort(percelen);
        check("gesorteerd oplopend: schaap eerst", percelen.get(0) == s);
        check("gesorteerd oplopend: weiland tweede", percelen.get(1) == weiland);
        check("gesorteerd oplopend: bieten laatst", percelen.get(2) == bieten);
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Perceel.java", content: `public abstract class Perceel implements Comparable<Perceel> {
    private final String referentienummer;
    private double oppervlakte;

    public Perceel(double oppervlakte, String referentienummer) {
        this.oppervlakte = oppervlakte;
        this.referentienummer = referentienummer;
    }

    public double getOppervlakte() { return oppervlakte; }
    public String getReferentienummer() { return referentienummer; }

    public abstract double berekenJaaropbrengst();

    public int compareTo(Perceel andere) {
        return Double.compare(this.berekenJaaropbrengst(), andere.berekenJaaropbrengst());
    }
}
` },
      { name: "Schapenweiland.java", content: `public class Schapenweiland extends Perceel {
    private int aantalSchapen;

    public Schapenweiland(double oppervlakte, String referentienummer, int aantalSchapen) {
        super(oppervlakte, referentienummer);
        this.aantalSchapen = aantalSchapen;
    }

    public double berekenJaaropbrengst() {
        return aantalSchapen * 4 * 0.30 - 250.0 * getOppervlakte();
    }
}
` },
    ],
    relatedConcepts: ["Comparable", "Collections.sort"],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: "tienkamp",
    chapterId: "H12",
    title: "Tienkamp",
    difficulty: "insane",
    tags: ["enum", "HashMap", "Comparable", "polymorfisme"],
    prompt: `In een tienkamp worden 10 disciplines beoefend, verdeeld in **lopen**, **werpen** en **springen**. De punten per discipline:

- Lopen: \`punten = floor(a · (b − T)^c)\` met T = tijd in seconden
- Springen: \`punten = floor(a · (M − b)^c)\` met M = prestatie in **centimeters**
- Werpen: \`punten = floor(a · (D − b)^c)\` met D = afstand in **meters**

De \`a\`, \`b\`, \`c\` per discipline staan in de starter (enum \`Sporttak\`). Implementeer:

- \`Sporttak.berekenPunten(double prestatie)\` met de juiste formule per categorie (\`Math.floor\`, \`Math.pow\`).
- **TienkampSporter** (\`implements Comparable<TienkampSporter>\`): houdt prestaties bij in een \`HashMap<Sporttak, Double>\` via \`add(Sporttak, double)\`, en \`getTotaalScore()\` somt alle punten. Sorteer zo dat de **beste sporter eerst** komt.
- **Competitie**: \`addSporter(...)\` en \`getRangschikking()\` die de sporters gesorteerd teruggeeft.

> Voorbeeld: 100m in 11.09s → 841 punten; verspringen 727cm → 878 punten. Hans Van Alphen haalt in totaal **8293** punten.`,
    starterFiles: [
      { name: "Categorie.java", content: `public enum Categorie { LOPEN, WERPEN, SPRINGEN }
` },
      { name: "Sporttak.java", content: `public enum Sporttak {
    HONDERD_METER("100m", Categorie.LOPEN, 25.4347, 18, 1.81),
    VERSPRINGEN("Verspringen", Categorie.SPRINGEN, 0.14354, 220, 1.4),
    KOGELSTOTEN("Kogelstoten", Categorie.WERPEN, 51.39, 1.5, 1.05),
    HOOGSPRINGEN("Hoogspringen", Categorie.SPRINGEN, 0.8465, 75, 1.42),
    VIERHONDERD_METER("400m", Categorie.LOPEN, 1.53775, 82, 1.81),
    HONDERDTIEN_HORDEN("110m horden", Categorie.LOPEN, 5.74352, 28.5, 1.92),
    DISCUSWERPEN("Discus", Categorie.WERPEN, 12.91, 4, 1.1),
    POLSSTOK("Polsstokhoogspringen", Categorie.SPRINGEN, 0.2797, 100, 1.35),
    SPEERWERPEN("Speerwerpen", Categorie.WERPEN, 10.14, 7, 1.08),
    VIJFTIENHONDERD_METER("1500m", Categorie.LOPEN, 0.03768, 480, 1.85);

    private final String naam;
    private final Categorie categorie;
    private final double a, b, c;

    Sporttak(String naam, Categorie categorie, double a, double b, double c) {
        this.naam = naam; this.categorie = categorie; this.a = a; this.b = b; this.c = c;
    }

    public String getNaam() { return naam; }
    public Categorie getCategorie() { return categorie; }

    public int berekenPunten(double prestatie) {
        // TODO: lopen -> floor(a*(b-prestatie)^c) ; springen/werpen -> floor(a*(prestatie-b)^c)
        return 0;
    }
}
` },
      { name: "TienkampSporter.java", content: `import java.util.HashMap;

public class TienkampSporter implements Comparable<TienkampSporter> {
    public TienkampSporter(String naam) {
        // TODO
    }
    public String getNaam() { return ""; /* TODO */ }
    public void add(Sporttak tak, double prestatie) {
        // TODO: bewaar de prestatie in een HashMap
    }
    public int getTotaalScore() {
        return 0; // TODO: som van de punten van alle disciplines
    }
    public int compareTo(TienkampSporter andere) {
        return 0; // TODO: beste sporter (hoogste score) eerst
    }
}
` },
      { name: "Competitie.java", content: `import java.util.ArrayList;
import java.util.Collections;

public class Competitie {
    private ArrayList<TienkampSporter> sporters = new ArrayList<>();
    public void addSporter(TienkampSporter s) {
        // TODO
    }
    public ArrayList<TienkampSporter> getRangschikking() {
        return new ArrayList<>(); // TODO: gesorteerde kopie, beste eerst
    }
}
` },
      { name: "Main.java", content: `public class Main {
    public static void main(String[] args) {
        // TODO: maak sporters, voeg prestaties toe en druk de rangschikking af
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "implements\\s+Comparable", message: "TienkampSporter moet Comparable<TienkampSporter> implementeren." },
        { pattern: "HashMap", message: "Gebruik een HashMap om de prestaties per sporttak bij te houden." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    static TienkampSporter vanAlphen() {
        TienkampSporter s = new TienkampSporter("vanAlphen");
        s.add(Sporttak.HONDERD_METER, 11.09);
        s.add(Sporttak.VERSPRINGEN, 727);
        s.add(Sporttak.KOGELSTOTEN, 15.29);
        s.add(Sporttak.HOOGSPRINGEN, 201);
        s.add(Sporttak.VIERHONDERD_METER, 49.06);
        s.add(Sporttak.HONDERDTIEN_HORDEN, 14.96);
        s.add(Sporttak.DISCUSWERPEN, 48.92);
        s.add(Sporttak.POLSSTOK, 472);
        s.add(Sporttak.SPEERWERPEN, 65.76);
        s.add(Sporttak.VIJFTIENHONDERD_METER, 270.22);
        return s;
    }
    public static void main(String[] args) {
        check("100m 11.09s = 841", Sporttak.HONDERD_METER.berekenPunten(11.09) == 841);
        check("verspringen 727cm = 878", Sporttak.VERSPRINGEN.berekenPunten(727) == 878);
        check("kogelstoten 15.29m = 808", Sporttak.KOGELSTOTEN.berekenPunten(15.29) == 808);
        check("hoogspringen 201cm = 813", Sporttak.HOOGSPRINGEN.berekenPunten(201) == 813);
        check("400m 49.06s = 858", Sporttak.VIERHONDERD_METER.berekenPunten(49.06) == 858);
        check("110m horden 14.96s = 854", Sporttak.HONDERDTIEN_HORDEN.berekenPunten(14.96) == 854);
        check("discus 48.92m = 848", Sporttak.DISCUSWERPEN.berekenPunten(48.92) == 848);
        check("polsstok 472cm = 825", Sporttak.POLSSTOK.berekenPunten(472) == 825);
        check("speer 65.76m = 825", Sporttak.SPEERWERPEN.berekenPunten(65.76) == 825);
        check("1500m 270.22s = 743", Sporttak.VIJFTIENHONDERD_METER.berekenPunten(270.22) == 743);
        check("totaal vanAlphen = 8293", vanAlphen().getTotaalScore() == 8293);

        Competitie comp = new Competitie();
        TienkampSporter beter = new TienkampSporter("beter");
        beter.add(Sporttak.HONDERD_METER, 10.0); beter.add(Sporttak.VERSPRINGEN, 800);
        beter.add(Sporttak.KOGELSTOTEN, 16.0); beter.add(Sporttak.HOOGSPRINGEN, 202);
        beter.add(Sporttak.VIERHONDERD_METER, 48.0); beter.add(Sporttak.HONDERDTIEN_HORDEN, 14.0);
        beter.add(Sporttak.DISCUSWERPEN, 49.0); beter.add(Sporttak.POLSSTOK, 475);
        beter.add(Sporttak.SPEERWERPEN, 67.0); beter.add(Sporttak.VIJFTIENHONDERD_METER, 260.0);
        TienkampSporter slechter = new TienkampSporter("slechter");
        slechter.add(Sporttak.HONDERD_METER, 12.0); slechter.add(Sporttak.VERSPRINGEN, 700);
        slechter.add(Sporttak.KOGELSTOTEN, 16.0); slechter.add(Sporttak.HOOGSPRINGEN, 200);
        slechter.add(Sporttak.VIERHONDERD_METER, 50.0); slechter.add(Sporttak.HONDERDTIEN_HORDEN, 15.0);
        slechter.add(Sporttak.DISCUSWERPEN, 48.0); slechter.add(Sporttak.POLSSTOK, 470);
        slechter.add(Sporttak.SPEERWERPEN, 65.0); slechter.add(Sporttak.VIJFTIENHONDERD_METER, 280.0);
        comp.addSporter(slechter); comp.addSporter(vanAlphen()); comp.addSporter(beter);
        java.util.ArrayList<TienkampSporter> stand = comp.getRangschikking();
        check("rangschikking: beter eerst", stand.get(0).getNaam().equals("beter"));
        check("rangschikking: vanAlphen tweede", stand.get(1).getNaam().equals("vanAlphen"));
        check("rangschikking: slechter laatst", stand.get(2).getNaam().equals("slechter"));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Categorie.java", content: `public enum Categorie { LOPEN, WERPEN, SPRINGEN }
` },
      { name: "Sporttak.java", content: `public enum Sporttak {
    HONDERD_METER("100m", Categorie.LOPEN, 25.4347, 18, 1.81),
    VERSPRINGEN("Verspringen", Categorie.SPRINGEN, 0.14354, 220, 1.4),
    KOGELSTOTEN("Kogelstoten", Categorie.WERPEN, 51.39, 1.5, 1.05),
    HOOGSPRINGEN("Hoogspringen", Categorie.SPRINGEN, 0.8465, 75, 1.42),
    VIERHONDERD_METER("400m", Categorie.LOPEN, 1.53775, 82, 1.81),
    HONDERDTIEN_HORDEN("110m horden", Categorie.LOPEN, 5.74352, 28.5, 1.92),
    DISCUSWERPEN("Discus", Categorie.WERPEN, 12.91, 4, 1.1),
    POLSSTOK("Polsstokhoogspringen", Categorie.SPRINGEN, 0.2797, 100, 1.35),
    SPEERWERPEN("Speerwerpen", Categorie.WERPEN, 10.14, 7, 1.08),
    VIJFTIENHONDERD_METER("1500m", Categorie.LOPEN, 0.03768, 480, 1.85);

    private final String naam;
    private final Categorie categorie;
    private final double a, b, c;

    Sporttak(String naam, Categorie categorie, double a, double b, double c) {
        this.naam = naam; this.categorie = categorie; this.a = a; this.b = b; this.c = c;
    }

    public String getNaam() { return naam; }
    public Categorie getCategorie() { return categorie; }

    public int berekenPunten(double prestatie) {
        double basis = (categorie == Categorie.LOPEN) ? (b - prestatie) : (prestatie - b);
        return (int) Math.floor(a * Math.pow(basis, c));
    }
}
` },
      { name: "TienkampSporter.java", content: `import java.util.HashMap;

public class TienkampSporter implements Comparable<TienkampSporter> {
    private String naam;
    private HashMap<Sporttak, Double> prestaties = new HashMap<>();

    public TienkampSporter(String naam) { this.naam = naam; }

    public String getNaam() { return naam; }

    public void add(Sporttak tak, double prestatie) { prestaties.put(tak, prestatie); }

    public int getTotaalScore() {
        int totaal = 0;
        for (Sporttak tak : prestaties.keySet()) {
            totaal += tak.berekenPunten(prestaties.get(tak));
        }
        return totaal;
    }

    public int compareTo(TienkampSporter andere) {
        return andere.getTotaalScore() - this.getTotaalScore();
    }
}
` },
      { name: "Competitie.java", content: `import java.util.ArrayList;
import java.util.Collections;

public class Competitie {
    private ArrayList<TienkampSporter> sporters = new ArrayList<>();

    public void addSporter(TienkampSporter s) { sporters.add(s); }

    public ArrayList<TienkampSporter> getRangschikking() {
        ArrayList<TienkampSporter> kopie = new ArrayList<>(sporters);
        Collections.sort(kopie);
        return kopie;
    }
}
` },
    ],
    relatedConcepts: ["enum", "HashMap", "Comparable", "Math.pow"],
  },

  // ── Extra oefeningen (klein/groot, makkelijk → moeilijk) ──────────
  {
    id: "weekdag",
    chapterId: "H6",
    title: "Weekdag (enum)",
    difficulty: "easy",
    tags: ["enum"],
    prompt: `Maak een **enum** \`Weekdag\` met de zeven dagen: \`MAANDAG\`, \`DINSDAG\`, \`WOENSDAG\`, \`DONDERDAG\`, \`VRIJDAG\`, \`ZATERDAG\`, \`ZONDAG\`.

Voeg een methode \`boolean isWeekend()\` toe die \`true\` geeft voor zaterdag en zondag, en \`false\` voor de rest.`,
    starterFiles: [
      { name: "Weekdag.java", content: `public enum Weekdag {
    // TODO: de zeven dagen (MAANDAG t/m ZONDAG)

    // TODO: methode isWeekend() — true voor ZATERDAG en ZONDAG
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "enum\\s+Weekdag", message: "Weekdag moet een enum zijn." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        check("7 dagen", Weekdag.values().length == 7);
        check("zaterdag is weekend", Weekdag.ZATERDAG.isWeekend());
        check("zondag is weekend", Weekdag.ZONDAG.isWeekend());
        check("maandag geen weekend", !Weekdag.MAANDAG.isWeekend());
        check("vrijdag geen weekend", !Weekdag.VRIJDAG.isWeekend());
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Weekdag.java", content: `public enum Weekdag {
    MAANDAG, DINSDAG, WOENSDAG, DONDERDAG, VRIJDAG, ZATERDAG, ZONDAG;

    public boolean isWeekend() {
        return this == ZATERDAG || this == ZONDAG;
    }
}
` },
    ],
    relatedConcepts: ["enum"],
  },

  {
    id: "boodschappenlijst",
    chapterId: "H6",
    title: "Boodschappenlijst (ArrayList)",
    difficulty: "easy",
    tags: ["ArrayList", "collections"],
    prompt: `Maak een klasse \`Boodschappenlijst\` die items bijhoudt in een \`ArrayList<String>\`.

Methodes: \`voegToe(String item)\`, \`verwijder(String item)\`, \`int aantal()\` en \`boolean bevat(String item)\`.`,
    starterFiles: [
      { name: "Boodschappenlijst.java", content: `import java.util.ArrayList;

public class Boodschappenlijst {
    // TODO: een ArrayList<String> als veld

    public void voegToe(String item) { /* TODO */ }
    public void verwijder(String item) { /* TODO */ }
    public int aantal() { return 0; /* TODO */ }
    public boolean bevat(String item) { return false; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "ArrayList", message: "Gebruik een ArrayList." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Boodschappenlijst l = new Boodschappenlijst();
        l.voegToe("melk"); l.voegToe("brood");
        check("aantal 2", l.aantal() == 2);
        check("bevat melk", l.bevat("melk"));
        l.verwijder("melk");
        check("aantal 1 na verwijder", l.aantal() == 1);
        check("bevat melk niet meer", !l.bevat("melk"));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Boodschappenlijst.java", content: `import java.util.ArrayList;

public class Boodschappenlijst {
    private ArrayList<String> items = new ArrayList<>();

    public void voegToe(String item) { items.add(item); }
    public void verwijder(String item) { items.remove(item); }
    public int aantal() { return items.size(); }
    public boolean bevat(String item) { return items.contains(item); }
}
` },
    ],
    relatedConcepts: ["ArrayList"],
  },

  {
    id: "temperatuur",
    chapterId: "H8",
    title: "Temperatuur (klasse & methode)",
    difficulty: "easy",
    tags: ["klasse", "encapsulatie"],
    prompt: `Maak een klasse \`Temperatuur\` met een constructor \`Temperatuur(double celsius)\`, een getter \`getCelsius()\` en een methode \`naarFahrenheit()\` die de temperatuur in Fahrenheit teruggeeft.

Formule: °F = °C × 9 / 5 + 32.`,
    starterFiles: [
      { name: "Temperatuur.java", content: `public class Temperatuur {
    public Temperatuur(double celsius) { /* TODO */ }
    public double getCelsius() { return 0; /* TODO */ }
    public double naarFahrenheit() { return 0; /* TODO: celsius * 9 / 5 + 32 */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Temperatuur", message: "Maak een klasse Temperatuur." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        check("0C = 32F", eq(new Temperatuur(0).naarFahrenheit(), 32));
        check("100C = 212F", eq(new Temperatuur(100).naarFahrenheit(), 212));
        check("37C = 98.6F", eq(new Temperatuur(37).naarFahrenheit(), 98.6));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Temperatuur.java", content: `public class Temperatuur {
    private double celsius;

    public Temperatuur(double celsius) { this.celsius = celsius; }

    public double getCelsius() { return celsius; }

    public double naarFahrenheit() { return celsius * 9.0 / 5.0 + 32; }
}
` },
    ],
    relatedConcepts: ["klasse", "constructor"],
  },

  {
    id: "rechthoek",
    chapterId: "H8",
    title: "Rechthoek (oppervlakte & omtrek)",
    difficulty: "easy",
    tags: ["klasse", "methodes"],
    prompt: `Maak een klasse \`Rechthoek\` met een constructor \`Rechthoek(double breedte, double hoogte)\` en methodes \`getOppervlakte()\` (breedte × hoogte) en \`getOmtrek()\` (2 × (breedte + hoogte)).`,
    starterFiles: [
      { name: "Rechthoek.java", content: `public class Rechthoek {
    public Rechthoek(double breedte, double hoogte) { /* TODO */ }
    public double getOppervlakte() { return 0; /* TODO */ }
    public double getOmtrek() { return 0; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Rechthoek", message: "Maak een klasse Rechthoek." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        Rechthoek r = new Rechthoek(3, 4);
        check("oppervlakte 12", eq(r.getOppervlakte(), 12));
        check("omtrek 14", eq(r.getOmtrek(), 14));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Rechthoek.java", content: `public class Rechthoek {
    private double breedte, hoogte;

    public Rechthoek(double breedte, double hoogte) {
        this.breedte = breedte;
        this.hoogte = hoogte;
    }

    public double getOppervlakte() { return breedte * hoogte; }
    public double getOmtrek() { return 2 * (breedte + hoogte); }
}
` },
    ],
    relatedConcepts: ["klasse", "methodes"],
  },

  {
    id: "bankrekening",
    chapterId: "H8",
    title: "Bankrekening (encapsulatie)",
    difficulty: "medium",
    tags: ["encapsulatie", "validatie"],
    prompt: `Maak een klasse \`Bankrekening\` met een constructor \`Bankrekening(String eigenaar)\` (saldo start op 0).

- \`storten(double bedrag)\`: voegt het bedrag toe (negeer bedragen ≤ 0).
- \`boolean opnemen(double bedrag)\`: trekt af en geeft \`true\` als er genoeg saldo is (en bedrag > 0); anders verandert er niets en geeft het \`false\`.
- \`getSaldo()\`.`,
    starterFiles: [
      { name: "Bankrekening.java", content: `public class Bankrekening {
    public Bankrekening(String eigenaar) { /* TODO */ }
    public double getSaldo() { return 0; /* TODO */ }
    public void storten(double bedrag) { /* TODO: enkel positieve bedragen */ }
    public boolean opnemen(double bedrag) { return false; /* TODO: enkel als er genoeg saldo is */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Bankrekening", message: "Maak een klasse Bankrekening." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        Bankrekening r = new Bankrekening("Jan");
        check("start saldo 0", eq(r.getSaldo(), 0));
        r.storten(100);
        check("saldo 100 na storten", eq(r.getSaldo(), 100));
        check("opnemen 30 lukt", r.opnemen(30));
        check("saldo 70", eq(r.getSaldo(), 70));
        check("opnemen 1000 faalt", !r.opnemen(1000));
        check("saldo blijft 70", eq(r.getSaldo(), 70));
        r.storten(-5);
        check("negatief storten genegeerd", eq(r.getSaldo(), 70));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Bankrekening.java", content: `public class Bankrekening {
    private String eigenaar;
    private double saldo;

    public Bankrekening(String eigenaar) {
        this.eigenaar = eigenaar;
        this.saldo = 0;
    }

    public double getSaldo() { return saldo; }

    public void storten(double bedrag) {
        if (bedrag > 0) saldo += bedrag;
    }

    public boolean opnemen(double bedrag) {
        if (bedrag > 0 && bedrag <= saldo) {
            saldo -= bedrag;
            return true;
        }
        return false;
    }
}
` },
    ],
    relatedConcepts: ["encapsulatie", "validatie"],
  },

  {
    id: "punt",
    chapterId: "OBJ",
    title: "Punt (equals & hashCode)",
    difficulty: "medium",
    tags: ["equals", "hashCode", "HashSet"],
    prompt: `Maak een klasse \`Punt\` met velden \`x\` en \`y\` (int) en getters.

Override **\`equals()\`** en **\`hashCode()\`** zodat twee punten gelijk zijn als hun \`x\` én \`y\` gelijk zijn. Zo werken \`Punt\`-objecten correct in een \`HashSet\` (geen dubbels).`,
    starterFiles: [
      { name: "Punt.java", content: `public class Punt {
    public Punt(int x, int y) { /* TODO */ }
    public int getX() { return 0; /* TODO */ }
    public int getY() { return 0; /* TODO */ }

    // TODO: override equals(Object) en hashCode() op basis van x en y
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "boolean\\s+equals", message: "Override de methode equals(Object)." },
        { pattern: "int\\s+hashCode", message: "Override de methode hashCode()." },
      ],
      testFile: { name: "VerborgenTest.java", content: `import java.util.HashSet;
public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        check("gelijke punten equals", new Punt(1, 2).equals(new Punt(1, 2)));
        check("ongelijke punten niet equals", !new Punt(1, 2).equals(new Punt(3, 4)));
        check("gelijke hashCode", new Punt(1, 2).hashCode() == new Punt(1, 2).hashCode());
        HashSet<Punt> set = new HashSet<>();
        set.add(new Punt(1, 2)); set.add(new Punt(1, 2)); set.add(new Punt(3, 4));
        check("HashSet dedupliceert", set.size() == 2);
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Punt.java", content: `import java.util.Objects;

public class Punt {
    private int x, y;

    public Punt(int x, int y) { this.x = x; this.y = y; }

    public int getX() { return x; }
    public int getY() { return y; }

    public boolean equals(Object o) {
        if (!(o instanceof Punt)) return false;
        Punt p = (Punt) o;
        return x == p.x && y == p.y;
    }

    public int hashCode() { return Objects.hash(x, y); }
}
` },
    ],
    relatedConcepts: ["equals", "hashCode", "HashSet"],
  },

  {
    id: "voertuig",
    chapterId: "H10",
    title: "Voertuig (overerving & override)",
    difficulty: "easy",
    tags: ["overerving", "@Override"],
    prompt: `Een \`Voertuig\` heeft een merk en standaard \`4\` wielen. \`beschrijving()\` geeft "merk met X wielen".

Maak een subklasse \`Motor\` die **overerft** van \`Voertuig\` en \`getAantalWielen()\` **override't** naar \`2\`. Merk dat \`beschrijving()\` dan automatisch "… met 2 wielen" toont (polymorfisme).`,
    starterFiles: [
      { name: "Voertuig.java", content: `public class Voertuig {
    private String merk;
    public Voertuig(String merk) { this.merk = merk; }
    public String getMerk() { return merk; }
    public int getAantalWielen() { return 4; }
    public String beschrijving() { return getMerk() + " met " + getAantalWielen() + " wielen"; }
}
` },
      { name: "Motor.java", content: `public class Motor extends Voertuig {
    public Motor(String merk) { super(merk); }

    // TODO: override getAantalWielen() zodat een motor 2 wielen heeft
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Motor\\s+extends\\s+Voertuig", message: "Motor moet overerven van Voertuig." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Voertuig auto = new Voertuig("VW");
        check("auto heeft 4 wielen", auto.getAantalWielen() == 4);
        Voertuig motor = new Motor("Yamaha");
        check("motor heeft 2 wielen", motor.getAantalWielen() == 2);
        check("polymorfe beschrijving", motor.beschrijving().contains("2 wielen"));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Voertuig.java", content: `public class Voertuig {
    private String merk;
    public Voertuig(String merk) { this.merk = merk; }
    public String getMerk() { return merk; }
    public int getAantalWielen() { return 4; }
    public String beschrijving() { return getMerk() + " met " + getAantalWielen() + " wielen"; }
}
` },
      { name: "Motor.java", content: `public class Motor extends Voertuig {
    public Motor(String merk) { super(merk); }

    public int getAantalWielen() { return 2; }
}
` },
    ],
    relatedConcepts: ["extends", "@Override", "polymorfisme"],
  },

  {
    id: "dieren-abstract",
    chapterId: "H11",
    title: "Dieren (abstracte klasse)",
    difficulty: "easy",
    tags: ["abstract", "polymorfisme"],
    prompt: `Maak een **abstracte** klasse \`Dier\` met een abstracte methode \`String maakGeluid()\`.

Maak twee subklassen: \`Hond\` (geeft "Woef") en \`Kat\` (geeft "Miauw"). Zo kun je ze polymorf in één \`Dier[]\` plaatsen.`,
    starterFiles: [
      { name: "Dier.java", content: `public abstract class Dier {
    public abstract String maakGeluid();
}
` },
      { name: "Hond.java", content: `public class Hond extends Dier {
    public String maakGeluid() { return ""; /* TODO: "Woef" */ }
}
` },
      { name: "Kat.java", content: `public class Kat extends Dier {
    public String maakGeluid() { return ""; /* TODO: "Miauw" */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "abstract\\s+class\\s+Dier", message: "Dier moet een abstracte klasse zijn." },
        { pattern: "class\\s+Hond\\s+extends\\s+Dier", message: "Hond moet overerven van Dier." },
        { pattern: "class\\s+Kat\\s+extends\\s+Dier", message: "Kat moet overerven van Dier." },
      ],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Dier[] dieren = { new Hond(), new Kat() };
        check("hond zegt Woef", dieren[0].maakGeluid().equals("Woef"));
        check("kat zegt Miauw", dieren[1].maakGeluid().equals("Miauw"));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Dier.java", content: `public abstract class Dier {
    public abstract String maakGeluid();
}
` },
      { name: "Hond.java", content: `public class Hond extends Dier {
    public String maakGeluid() { return "Woef"; }
}
` },
      { name: "Kat.java", content: `public class Kat extends Dier {
    public String maakGeluid() { return "Miauw"; }
}
` },
    ],
    relatedConcepts: ["abstract class", "polymorfisme"],
  },

  {
    id: "vorm",
    chapterId: "H12",
    title: "Vorm (interface)",
    difficulty: "medium",
    tags: ["interface", "implements", "polymorfisme"],
    prompt: `Maak een **interface** \`Vorm\` met de methode \`double oppervlakte()\`.

Maak twee klassen die \`Vorm\` **implementeren**: \`Cirkel(double straal)\` (oppervlakte = π·r²) en \`Vierkant(double zijde)\` (oppervlakte = zijde²).`,
    starterFiles: [
      { name: "Vorm.java", content: `public interface Vorm {
    double oppervlakte();
}
` },
      { name: "Cirkel.java", content: `public class Cirkel implements Vorm {
    public Cirkel(double straal) { /* TODO */ }
    public double oppervlakte() { return 0; /* TODO: Math.PI * straal * straal */ }
}
` },
      { name: "Vierkant.java", content: `public class Vierkant implements Vorm {
    public Vierkant(double zijde) { /* TODO */ }
    public double oppervlakte() { return 0; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "interface\\s+Vorm", message: "Vorm moet een interface zijn." },
        { pattern: "class\\s+Cirkel\\s+implements\\s+Vorm", message: "Cirkel moet Vorm implementeren." },
        { pattern: "class\\s+Vierkant\\s+implements\\s+Vorm", message: "Vierkant moet Vorm implementeren." },
      ],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        Vorm c = new Cirkel(2);
        check("cirkel oppervlakte", eq(c.oppervlakte(), Math.PI * 4));
        Vorm v = new Vierkant(3);
        check("vierkant oppervlakte 9", eq(v.oppervlakte(), 9));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Vorm.java", content: `public interface Vorm {
    double oppervlakte();
}
` },
      { name: "Cirkel.java", content: `public class Cirkel implements Vorm {
    private double straal;
    public Cirkel(double straal) { this.straal = straal; }
    public double oppervlakte() { return Math.PI * straal * straal; }
}
` },
      { name: "Vierkant.java", content: `public class Vierkant implements Vorm {
    private double zijde;
    public Vierkant(double zijde) { this.zijde = zijde; }
    public double oppervlakte() { return zijde * zijde; }
}
` },
    ],
    relatedConcepts: ["interface", "implements", "polymorfisme"],
  },

  {
    id: "sorteer-personen",
    chapterId: "H12",
    title: "Personen sorteren (Comparable)",
    difficulty: "medium",
    tags: ["Comparable", "sorteren"],
    prompt: `Maak een klasse \`Persoon(String naam, int leeftijd)\` die \`Comparable<Persoon>\` **implementeert**, zodat een lijst personen via \`Collections.sort\` **oplopend op leeftijd** gesorteerd wordt. Voorzie ook \`getNaam()\` en \`getLeeftijd()\`.`,
    starterFiles: [
      { name: "Persoon.java", content: `public class Persoon implements Comparable<Persoon> {
    public Persoon(String naam, int leeftijd) { /* TODO */ }
    public String getNaam() { return ""; /* TODO */ }
    public int getLeeftijd() { return 0; /* TODO */ }

    public int compareTo(Persoon andere) {
        return 0; // TODO: sorteer oplopend op leeftijd
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "implements\\s+Comparable", message: "Persoon moet Comparable<Persoon> implementeren." }],
      testFile: { name: "VerborgenTest.java", content: `import java.util.ArrayList;
import java.util.Collections;
public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        ArrayList<Persoon> ps = new ArrayList<>();
        ps.add(new Persoon("Anna", 30));
        ps.add(new Persoon("Bob", 20));
        ps.add(new Persoon("Cas", 40));
        Collections.sort(ps);
        check("jongste eerst (Bob)", ps.get(0).getNaam().equals("Bob"));
        check("daarna Anna", ps.get(1).getNaam().equals("Anna"));
        check("oudste laatst (Cas)", ps.get(2).getNaam().equals("Cas"));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Persoon.java", content: `public class Persoon implements Comparable<Persoon> {
    private String naam;
    private int leeftijd;

    public Persoon(String naam, int leeftijd) {
        this.naam = naam;
        this.leeftijd = leeftijd;
    }

    public String getNaam() { return naam; }
    public int getLeeftijd() { return leeftijd; }

    public int compareTo(Persoon andere) {
        return Integer.compare(this.leeftijd, andere.leeftijd);
    }
}
` },
    ],
    relatedConcepts: ["Comparable", "Collections.sort"],
  },

  {
    id: "deling",
    chapterId: "H14",
    title: "Deling (eigen exception)",
    difficulty: "easy",
    tags: ["exceptions", "RuntimeException"],
    prompt: `Maak een **ongecontroleerde** exception \`DeelDoorNulException\` (\`extends RuntimeException\`).

Maak een klasse \`Rekenmachine\` met \`int deel(int a, int b)\` die deze exception **gooit** als \`b == 0\`, en anders \`a / b\` teruggeeft.`,
    starterFiles: [
      { name: "DeelDoorNulException.java", content: `public class DeelDoorNulException extends RuntimeException {
    public DeelDoorNulException(String message) { super(message); }
}
` },
      { name: "Rekenmachine.java", content: `public class Rekenmachine {
    public int deel(int a, int b) {
        // TODO: gooi een DeelDoorNulException als b == 0, anders return a / b
        return 0;
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+DeelDoorNulException\\s+extends\\s+RuntimeException", message: "DeelDoorNulException moet extends RuntimeException zijn." },
      ],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Rekenmachine r = new Rekenmachine();
        check("10 / 2 = 5", r.deel(10, 2) == 5);
        boolean gegooid = false;
        try { r.deel(5, 0); } catch (DeelDoorNulException e) { gegooid = true; }
        check("deel door nul gooit exception", gegooid);
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "DeelDoorNulException.java", content: `public class DeelDoorNulException extends RuntimeException {
    public DeelDoorNulException(String message) { super(message); }
}
` },
      { name: "Rekenmachine.java", content: `public class Rekenmachine {
    public int deel(int a, int b) {
        if (b == 0) throw new DeelDoorNulException("Delen door nul mag niet");
        return a / b;
    }
}
` },
    ],
    relatedConcepts: ["custom exception", "RuntimeException", "try/catch"],
  },

  // ── Grote/moeilijke + kleine/makkelijke aanvullingen per hoofdstuk ──
  {
    id: "kaartspel",
    chapterId: "H6",
    title: "Kaartspel (enums, static & ArrayList)",
    difficulty: "hard",
    tags: ["enum", "static", "ArrayList"],
    prompt: `Bouw een kaartspel met meerdere klassen.

- **enum \`Kleur\`**: \`HARTEN\`, \`RUITEN\`, \`KLAVEREN\`, \`SCHOPPEN\`.
- **enum \`Waarde\`**: \`TWEE\`(2) t/m \`TIEN\`(10), \`BOER\`(11), \`VROUW\`(12), \`KONING\`(13), \`AAS\`(14), met \`getPunten()\`.
- **\`Kaart\`** (\`Kleur\`, \`Waarde\`): getters + \`getPunten()\` (= punten van de waarde).
- **\`Stapel\`**: houdt kaarten bij in een \`ArrayList\`. Methodes: \`voegToe(Kaart)\`, \`aantal()\`, \`neemBovenste()\` (verwijdert en geeft de laatste kaart terug), \`totaalPunten()\`, en een **statische** \`volledigeStapel()\` die een stapel van alle 52 kaarten bouwt.`,
    starterFiles: [
      { name: "Kleur.java", content: `public enum Kleur {
    // TODO: HARTEN, RUITEN, KLAVEREN, SCHOPPEN
}
` },
      { name: "Waarde.java", content: `public enum Waarde {
    // TODO: TWEE(2) ... TIEN(10), BOER(11), VROUW(12), KONING(13), AAS(14)

    // TODO: veld punten + constructor + getPunten()
}
` },
      { name: "Kaart.java", content: `public class Kaart {
    public Kaart(Kleur kleur, Waarde waarde) { /* TODO */ }
    public Kleur getKleur() { return null; /* TODO */ }
    public Waarde getWaarde() { return null; /* TODO */ }
    public int getPunten() { return 0; /* TODO */ }
}
` },
      { name: "Stapel.java", content: `import java.util.ArrayList;

public class Stapel {
    // TODO: ArrayList<Kaart> veld

    public void voegToe(Kaart k) { /* TODO */ }
    public int aantal() { return 0; /* TODO */ }
    public Kaart neemBovenste() { return null; /* TODO */ }
    public int totaalPunten() { return 0; /* TODO */ }

    public static Stapel volledigeStapel() {
        // TODO: bouw een stapel met alle 52 kaarten (elke Kleur x elke Waarde)
        return new Stapel();
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "enum\\s+Kleur", message: "Kleur moet een enum zijn." },
        { pattern: "enum\\s+Waarde", message: "Waarde moet een enum zijn." },
        { pattern: "static\\s+Stapel\\s+volledigeStapel", message: "volledigeStapel() moet een statische methode zijn." },
      ],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        check("4 kleuren", Kleur.values().length == 4);
        check("13 waarden", Waarde.values().length == 13);
        check("AAS = 14 punten", Waarde.AAS.getPunten() == 14);
        check("TWEE = 2 punten", Waarde.TWEE.getPunten() == 2);
        Stapel s = Stapel.volledigeStapel();
        check("volledige stapel 52 kaarten", s.aantal() == 52);
        check("totaal 416 punten", s.totaalPunten() == 416);
        Kaart top = s.neemBovenste();
        check("na neemBovenste 51", s.aantal() == 51);
        check("kaart punten kloppen", top.getPunten() == top.getWaarde().getPunten());
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Kleur.java", content: `public enum Kleur { HARTEN, RUITEN, KLAVEREN, SCHOPPEN }
` },
      { name: "Waarde.java", content: `public enum Waarde {
    TWEE(2), DRIE(3), VIER(4), VIJF(5), ZES(6), ZEVEN(7), ACHT(8), NEGEN(9), TIEN(10),
    BOER(11), VROUW(12), KONING(13), AAS(14);

    private final int punten;
    Waarde(int punten) { this.punten = punten; }
    public int getPunten() { return punten; }
}
` },
      { name: "Kaart.java", content: `public class Kaart {
    private final Kleur kleur;
    private final Waarde waarde;

    public Kaart(Kleur kleur, Waarde waarde) {
        this.kleur = kleur;
        this.waarde = waarde;
    }

    public Kleur getKleur() { return kleur; }
    public Waarde getWaarde() { return waarde; }
    public int getPunten() { return waarde.getPunten(); }

    public String toString() { return waarde + " van " + kleur; }
}
` },
      { name: "Stapel.java", content: `import java.util.ArrayList;

public class Stapel {
    private ArrayList<Kaart> kaarten = new ArrayList<>();

    public void voegToe(Kaart k) { kaarten.add(k); }
    public int aantal() { return kaarten.size(); }
    public Kaart neemBovenste() { return kaarten.remove(kaarten.size() - 1); }

    public int totaalPunten() {
        int t = 0;
        for (Kaart k : kaarten) t += k.getPunten();
        return t;
    }

    public static Stapel volledigeStapel() {
        Stapel s = new Stapel();
        for (Kleur kl : Kleur.values())
            for (Waarde w : Waarde.values())
                s.voegToe(new Kaart(kl, w));
        return s;
    }
}
` },
    ],
    relatedConcepts: ["enum", "static", "ArrayList"],
  },

  {
    id: "bestelling",
    chapterId: "H8",
    title: "Bestelling (klassen samenstellen)",
    difficulty: "hard",
    tags: ["klassen", "encapsulatie", "compositie"],
    prompt: `Modelleer een bestelling met drie klassen.

- **\`Product\`** (\`String naam\`, \`double prijs\`) met getters.
- **\`Bestelregel\`** (\`Product\`, \`int aantal\`) met \`getSubtotaal()\` = prijs × aantal, plus \`getProduct()\` en \`getAantal()\`.
- **\`Bestelling\`**: houdt regels bij. \`voegToe(Product, int aantal)\`, \`getTotaal()\` (som van alle subtotalen), \`getAantalProducten()\` (som van alle aantallen) en \`getDuursteRegel()\` (de \`Bestelregel\` met het hoogste subtotaal).`,
    starterFiles: [
      { name: "Product.java", content: `public class Product {
    public Product(String naam, double prijs) { /* TODO */ }
    public String getNaam() { return ""; /* TODO */ }
    public double getPrijs() { return 0; /* TODO */ }
}
` },
      { name: "Bestelregel.java", content: `public class Bestelregel {
    public Bestelregel(Product product, int aantal) { /* TODO */ }
    public Product getProduct() { return null; /* TODO */ }
    public int getAantal() { return 0; /* TODO */ }
    public double getSubtotaal() { return 0; /* TODO: prijs * aantal */ }
}
` },
      { name: "Bestelling.java", content: `import java.util.ArrayList;

public class Bestelling {
    // TODO: ArrayList<Bestelregel> veld

    public void voegToe(Product product, int aantal) { /* TODO */ }
    public double getTotaal() { return 0; /* TODO */ }
    public int getAantalProducten() { return 0; /* TODO */ }
    public Bestelregel getDuursteRegel() { return null; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Product", message: "Maak een klasse Product." },
        { pattern: "class\\s+Bestelregel", message: "Maak een klasse Bestelregel." },
        { pattern: "class\\s+Bestelling", message: "Maak een klasse Bestelling." },
      ],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        Product appel = new Product("appel", 0.5);
        Product brood = new Product("brood", 2.0);
        Bestelregel r = new Bestelregel(brood, 3);
        check("subtotaal brood x3 = 6.0", eq(r.getSubtotaal(), 6.0));
        Bestelling b = new Bestelling();
        b.voegToe(appel, 4);
        b.voegToe(brood, 2);
        check("totaal = 6.0", eq(b.getTotaal(), 6.0));
        check("aantal producten = 6", b.getAantalProducten() == 6);
        check("duurste regel = brood", b.getDuursteRegel().getProduct().getNaam().equals("brood"));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Product.java", content: `public class Product {
    private String naam;
    private double prijs;

    public Product(String naam, double prijs) {
        this.naam = naam;
        this.prijs = prijs;
    }

    public String getNaam() { return naam; }
    public double getPrijs() { return prijs; }
}
` },
      { name: "Bestelregel.java", content: `public class Bestelregel {
    private Product product;
    private int aantal;

    public Bestelregel(Product product, int aantal) {
        this.product = product;
        this.aantal = aantal;
    }

    public Product getProduct() { return product; }
    public int getAantal() { return aantal; }
    public double getSubtotaal() { return product.getPrijs() * aantal; }
}
` },
      { name: "Bestelling.java", content: `import java.util.ArrayList;

public class Bestelling {
    private ArrayList<Bestelregel> regels = new ArrayList<>();

    public void voegToe(Product product, int aantal) {
        regels.add(new Bestelregel(product, aantal));
    }

    public double getTotaal() {
        double t = 0;
        for (Bestelregel r : regels) t += r.getSubtotaal();
        return t;
    }

    public int getAantalProducten() {
        int n = 0;
        for (Bestelregel r : regels) n += r.getAantal();
        return n;
    }

    public Bestelregel getDuursteRegel() {
        Bestelregel duurste = null;
        for (Bestelregel r : regels)
            if (duurste == null || r.getSubtotaal() > duurste.getSubtotaal()) duurste = r;
        return duurste;
    }
}
` },
    ],
    relatedConcepts: ["compositie", "encapsulatie"],
  },

  {
    id: "voorraad",
    chapterId: "OBJ",
    title: "Voorraad (HashMap basis)",
    difficulty: "easy",
    tags: ["HashMap", "collections"],
    prompt: `Maak een klasse \`Voorraad\` die per product een aantal bijhoudt in een **HashMap**.

- \`voegToe(String product, int aantal)\`: telt het aantal op bij wat er al is.
- \`int getAantal(String product)\`: geeft het aantal terug (0 als het product onbekend is).`,
    starterFiles: [
      { name: "Voorraad.java", content: `import java.util.HashMap;

public class Voorraad {
    // TODO: HashMap<String, Integer> veld

    public void voegToe(String product, int aantal) { /* TODO */ }
    public int getAantal(String product) { return 0; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "HashMap", message: "Gebruik een HashMap." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Voorraad v = new Voorraad();
        v.voegToe("appel", 3);
        v.voegToe("appel", 2);
        check("appel = 5", v.getAantal("appel") == 5);
        check("onbekend product = 0", v.getAantal("peer") == 0);
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Voorraad.java", content: `import java.util.HashMap;

public class Voorraad {
    private HashMap<String, Integer> stock = new HashMap<>();

    public void voegToe(String product, int aantal) {
        stock.put(product, stock.getOrDefault(product, 0) + aantal);
    }

    public int getAantal(String product) {
        return stock.getOrDefault(product, 0);
    }
}
` },
    ],
    relatedConcepts: ["HashMap", "getOrDefault"],
  },

  {
    id: "woordenfrequentie",
    chapterId: "OBJ",
    title: "Woordenfrequentie (HashMap & analyse)",
    difficulty: "hard",
    tags: ["HashMap", "collections", "analyse"],
    prompt: `Maak een klasse \`Woordenteller\` die woorden telt.

- \`verwerk(String tekst)\`: splitst op spaties, zet alles naar kleine letters en telt elk woord (over meerdere oproepen heen).
- \`int frequentie(String woord)\`: hoe vaak komt een woord voor (0 als afwezig).
- \`int aantalUnieke()\`: aantal verschillende woorden.
- \`String meestVoorkomend()\`: het woord dat het vaakst voorkomt.`,
    starterFiles: [
      { name: "Woordenteller.java", content: `import java.util.HashMap;

public class Woordenteller {
    // TODO: HashMap<String, Integer> veld

    public void verwerk(String tekst) {
        // TODO: split op " ", lowercase, tel elk woord
    }
    public int frequentie(String woord) { return 0; /* TODO */ }
    public int aantalUnieke() { return 0; /* TODO */ }
    public String meestVoorkomend() { return null; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "HashMap", message: "Gebruik een HashMap om de tellingen bij te houden." }],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Woordenteller w = new Woordenteller();
        w.verwerk("de kat de hond de vis");
        check("de = 3", w.frequentie("de") == 3);
        check("kat = 1", w.frequentie("kat") == 1);
        check("aantal unieke = 4", w.aantalUnieke() == 4);
        check("meest voorkomend = de", w.meestVoorkomend().equals("de"));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Woordenteller.java", content: `import java.util.HashMap;

public class Woordenteller {
    private HashMap<String, Integer> tellingen = new HashMap<>();

    public void verwerk(String tekst) {
        for (String woord : tekst.toLowerCase().split(" ")) {
            if (woord.isEmpty()) continue;
            tellingen.put(woord, tellingen.getOrDefault(woord, 0) + 1);
        }
    }

    public int frequentie(String woord) {
        return tellingen.getOrDefault(woord.toLowerCase(), 0);
    }

    public int aantalUnieke() { return tellingen.size(); }

    public String meestVoorkomend() {
        String beste = null;
        int max = -1;
        for (String w : tellingen.keySet())
            if (tellingen.get(w) > max) { max = tellingen.get(w); beste = w; }
        return beste;
    }
}
` },
    ],
    relatedConcepts: ["HashMap", "iteratie"],
  },

  {
    id: "personeel",
    chapterId: "H10",
    title: "Personeel (overerving & loonberekening)",
    difficulty: "hard",
    tags: ["overerving", "polymorfisme", "super"],
    prompt: `Bouw een personeelshiërarchie.

- **\`Werknemer\`** (\`naam\`, \`basisloon\`): \`getMaandloon()\` = basisloon. (gegeven)
- **\`Manager\`** \`extends Werknemer\`: extra \`bonus\` → \`getMaandloon()\` = basisloon + bonus.
- **\`Verkoper\`** \`extends Werknemer\`: \`commissiePercentage\` en \`omzet\` → \`getMaandloon()\` = basisloon + omzet × commissie / 100.
- **\`Bedrijf\`**: houdt werknemers bij. \`voegToe(Werknemer)\`, \`getTotaleLoonkost()\` (polymorfe som) en \`getDuurste()\` (werknemer met hoogste maandloon).

> Constructors: \`Manager(naam, basisloon, bonus)\`, \`Verkoper(naam, basisloon, commissiePercentage, omzet)\`.`,
    starterFiles: [
      { name: "Werknemer.java", content: `public class Werknemer {
    private String naam;
    private double basisloon;
    public Werknemer(String naam, double basisloon) { this.naam = naam; this.basisloon = basisloon; }
    public String getNaam() { return naam; }
    public double getBasisloon() { return basisloon; }
    public double getMaandloon() { return basisloon; }
}
` },
      { name: "Manager.java", content: `public class Manager extends Werknemer {
    public Manager(String naam, double basisloon, double bonus) {
        super(naam, basisloon);
        // TODO: bewaar bonus
    }
    // TODO: override getMaandloon() = basisloon + bonus
}
` },
      { name: "Verkoper.java", content: `public class Verkoper extends Werknemer {
    public Verkoper(String naam, double basisloon, double commissiePercentage, double omzet) {
        super(naam, basisloon);
        // TODO
    }
    // TODO: override getMaandloon() = basisloon + omzet * commissie / 100
}
` },
      { name: "Bedrijf.java", content: `import java.util.ArrayList;

public class Bedrijf {
    // TODO: ArrayList<Werknemer> veld

    public void voegToe(Werknemer w) { /* TODO */ }
    public double getTotaleLoonkost() { return 0; /* TODO */ }
    public Werknemer getDuurste() { return null; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Manager\\s+extends\\s+Werknemer", message: "Manager moet overerven van Werknemer." },
        { pattern: "class\\s+Verkoper\\s+extends\\s+Werknemer", message: "Verkoper moet overerven van Werknemer." },
      ],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    static boolean eq(double a, double b) { return Math.abs(a - b) < 0.001; }
    public static void main(String[] args) {
        Werknemer w = new Werknemer("Jan", 2000);
        check("gewone werknemer 2000", eq(w.getMaandloon(), 2000));
        Manager m = new Manager("Ann", 3000, 500);
        check("manager 3500", eq(m.getMaandloon(), 3500));
        Verkoper v = new Verkoper("Bo", 1500, 10, 10000);
        check("verkoper 2500", eq(v.getMaandloon(), 2500));
        Bedrijf bedrijf = new Bedrijf();
        bedrijf.voegToe(w); bedrijf.voegToe(m); bedrijf.voegToe(v);
        check("totale loonkost 8000", eq(bedrijf.getTotaleLoonkost(), 8000));
        check("duurste = Ann", bedrijf.getDuurste().getNaam().equals("Ann"));
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Werknemer.java", content: `public class Werknemer {
    private String naam;
    private double basisloon;

    public Werknemer(String naam, double basisloon) {
        this.naam = naam;
        this.basisloon = basisloon;
    }

    public String getNaam() { return naam; }
    public double getBasisloon() { return basisloon; }
    public double getMaandloon() { return basisloon; }
}
` },
      { name: "Manager.java", content: `public class Manager extends Werknemer {
    private double bonus;

    public Manager(String naam, double basisloon, double bonus) {
        super(naam, basisloon);
        this.bonus = bonus;
    }

    public double getMaandloon() { return getBasisloon() + bonus; }
}
` },
      { name: "Verkoper.java", content: `public class Verkoper extends Werknemer {
    private double commissiePercentage;
    private double omzet;

    public Verkoper(String naam, double basisloon, double commissiePercentage, double omzet) {
        super(naam, basisloon);
        this.commissiePercentage = commissiePercentage;
        this.omzet = omzet;
    }

    public double getMaandloon() {
        return getBasisloon() + omzet * commissiePercentage / 100.0;
    }
}
` },
      { name: "Bedrijf.java", content: `import java.util.ArrayList;

public class Bedrijf {
    private ArrayList<Werknemer> werknemers = new ArrayList<>();

    public void voegToe(Werknemer w) { werknemers.add(w); }

    public double getTotaleLoonkost() {
        double t = 0;
        for (Werknemer w : werknemers) t += w.getMaandloon();
        return t;
    }

    public Werknemer getDuurste() {
        Werknemer d = null;
        for (Werknemer w : werknemers)
            if (d == null || w.getMaandloon() > d.getMaandloon()) d = w;
        return d;
    }
}
` },
    ],
    relatedConcepts: ["extends", "super", "polymorfisme"],
  },

  {
    id: "aanzetbaar",
    chapterId: "H12",
    title: "Aanzetbaar (interface basis)",
    difficulty: "easy",
    tags: ["interface", "implements"],
    prompt: `Maak een **interface** \`Aanzetbaar\` met \`aan()\`, \`uit()\` en \`boolean isAan()\`.

Maak een klasse \`Lamp\` die \`Aanzetbaar\` **implementeert** en de toestand bijhoudt (start uit).`,
    starterFiles: [
      { name: "Aanzetbaar.java", content: `public interface Aanzetbaar {
    void aan();
    void uit();
    boolean isAan();
}
` },
      { name: "Lamp.java", content: `public class Lamp implements Aanzetbaar {
    // TODO: veld voor de toestand (start uit)

    public void aan() { /* TODO */ }
    public void uit() { /* TODO */ }
    public boolean isAan() { return false; /* TODO */ }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "interface\\s+Aanzetbaar", message: "Aanzetbaar moet een interface zijn." },
        { pattern: "class\\s+Lamp\\s+implements\\s+Aanzetbaar", message: "Lamp moet Aanzetbaar implementeren." },
      ],
      testFile: { name: "VerborgenTest.java", content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Aanzetbaar a = new Lamp();
        check("start uit", !a.isAan());
        a.aan();
        check("na aan() aan", a.isAan());
        a.uit();
        check("na uit() uit", !a.isAan());
        klaar();
    }
}
` },
    },
    solutionFiles: [
      { name: "Aanzetbaar.java", content: `public interface Aanzetbaar {
    void aan();
    void uit();
    boolean isAan();
}
` },
      { name: "Lamp.java", content: `public class Lamp implements Aanzetbaar {
    private boolean toestand = false;

    public void aan() { toestand = true; }
    public void uit() { toestand = false; }
    public boolean isAan() { return toestand; }
}
` },
    ],
    relatedConcepts: ["interface", "implements"],
  },

  ...EXTRA_EXERCISES,
];
