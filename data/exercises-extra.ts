import type { Exercise } from "@/lib/exercises";

// Gedeelde test-helper (zelfde als in exercises.ts): check() + klaar() + marker.
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

export const EXTRA_EXERCISES: Exercise[] = [
  // ─── H6 ───────────────────────────────────────────────────────────
  {
    id: "verkeerslicht",
    chapterId: "H6",
    title: "Verkeerslicht",
    difficulty: "easy",
    tags: ["enum", "methods"],
    prompt: `Maak een enum **Licht** met de waarden ROOD, ORANJE en GROEN. Voeg een methode Licht volgende() toe die het volgende licht teruggeeft: GROEN wordt ORANJE, ORANJE wordt ROOD en ROOD wordt GROEN.`,
    example: `GROEN.volgende() geeft ORANJE`,
    starterFiles: [
      { name: "Licht.java", content: `public enum Licht {
    ROOD, ORANJE, GROEN;

    public Licht volgende() {
        // TODO: GROEN -> ORANJE, ORANJE -> ROOD, ROOD -> GROEN
        return this;
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "enum\\s+Licht", message: "Maak een enum Licht." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        checkEq("GROEN -> ORANJE", Licht.ORANJE, Licht.GROEN.volgende());
        checkEq("ORANJE -> ROOD", Licht.ROOD, Licht.ORANJE.volgende());
        checkEq("ROOD -> GROEN", Licht.GROEN, Licht.ROOD.volgende());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Licht.java", content: `public enum Licht {
    ROOD, ORANJE, GROEN;

    public Licht volgende() {
        switch (this) {
            case GROEN: return ORANJE;
            case ORANJE: return ROOD;
            default: return GROEN;
        }
    }
}
` },
    ],
    relatedConcepts: ["enum"],
  },
  {
    id: "cijferreeks",
    chapterId: "H6",
    title: "Cijferreeks",
    difficulty: "easy",
    tags: ["arraylist", "class"],
    prompt: `Maak een klasse **Cijferreeks** die intern een ArrayList van gehele getallen bijhoudt. Voeg de methodes voegToe(int) om een getal toe te voegen, int aantal() voor het aantal getallen, double gemiddelde() voor het gemiddelde en int hoogste() voor het grootste getal toe. Je mag ervan uitgaan dat gemiddelde() en hoogste() pas opgeroepen worden als er minstens één getal is.`,
    example: `met 2, 4 en 6: aantal=3, gemiddelde=4.0, hoogste=6`,
    starterFiles: [
      { name: "Cijferreeks.java", content: `import java.util.ArrayList;

public class Cijferreeks {
    // TODO: een ArrayList<Integer> als veld

    public void voegToe(int getal) {
        // TODO
    }

    public int aantal() {
        // TODO
        return 0;
    }

    public double gemiddelde() {
        // TODO
        return 0;
    }

    public int hoogste() {
        // TODO
        return 0;
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "ArrayList", message: "Gebruik een ArrayList om de getallen bij te houden." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Cijferreeks r = new Cijferreeks();
        r.voegToe(2);
        r.voegToe(4);
        r.voegToe(6);
        checkEq("aantal = 3", 3, r.aantal());
        checkNaby("gemiddelde = 4.0", 4.0, r.gemiddelde());
        checkEq("hoogste = 6", 6, r.hoogste());
        r.voegToe(10);
        checkEq("na extra getal aantal = 4", 4, r.aantal());
        checkEq("hoogste nu = 10", 10, r.hoogste());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Cijferreeks.java", content: `import java.util.ArrayList;

public class Cijferreeks {
    private ArrayList<Integer> getallen = new ArrayList<Integer>();

    public void voegToe(int getal) {
        getallen.add(getal);
    }

    public int aantal() {
        return getallen.size();
    }

    public double gemiddelde() {
        int som = 0;
        for (int g : getallen) {
            som += g;
        }
        return (double) som / getallen.size();
    }

    public int hoogste() {
        int max = getallen.get(0);
        for (int g : getallen) {
            if (g > max) {
                max = g;
            }
        }
        return max;
    }
}
` },
    ],
    relatedConcepts: ["arraylist"],
  },
  {
    id: "windroos",
    chapterId: "H6",
    title: "Windroos",
    difficulty: "medium",
    tags: ["enum", "static"],
    prompt: `Maak een enum **Windrichting** met de waarden N, O, Z en W. Elke waarde heeft een graden-waarde via een veld: N=0, O=90, Z=180 en W=270. Voeg een methode int getGraden() toe die de graden teruggeeft, en een static methode Windrichting vanGraden(int g) die de juiste windrichting bij een graden-waarde teruggeeft.`,
    example: `Windrichting.O.getGraden() geeft 90 en Windrichting.vanGraden(180) geeft Z`,
    starterFiles: [
      { name: "Windrichting.java", content: `public enum Windrichting {
    // TODO: N(0), O(90), Z(180), W(270)

    // TODO: veld voor de graden + constructor

    public int getGraden() {
        // TODO
        return 0;
    }

    public static Windrichting vanGraden(int g) {
        // TODO: geef de windrichting met deze graden terug
        return null;
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "enum\\s+Windrichting", message: "Maak een enum Windrichting." },
        { pattern: "static\\s+Windrichting\\s+vanGraden", message: "Maak een static methode vanGraden." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        checkEq("N = 0 graden", 0, Windrichting.N.getGraden());
        checkEq("O = 90 graden", 90, Windrichting.O.getGraden());
        checkEq("Z = 180 graden", 180, Windrichting.Z.getGraden());
        checkEq("W = 270 graden", 270, Windrichting.W.getGraden());
        checkEq("vanGraden(0) = N", Windrichting.N, Windrichting.vanGraden(0));
        checkEq("vanGraden(90) = O", Windrichting.O, Windrichting.vanGraden(90));
        checkEq("vanGraden(270) = W", Windrichting.W, Windrichting.vanGraden(270));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Windrichting.java", content: `public enum Windrichting {
    N(0), O(90), Z(180), W(270);

    private final int graden;

    Windrichting(int graden) {
        this.graden = graden;
    }

    public int getGraden() {
        return graden;
    }

    public static Windrichting vanGraden(int g) {
        for (Windrichting w : values()) {
            if (w.graden == g) {
                return w;
            }
        }
        return null;
    }
}
` },
    ],
    relatedConcepts: ["enum", "static"],
  },
  {
    id: "bibliotheek",
    chapterId: "H6",
    title: "Bibliotheek",
    difficulty: "hard",
    tags: ["arraylist", "static", "class"],
    prompt: `Maak een klasse **Boek** met een constructor Boek(String titel, String auteur) en de getters getTitel() en getAuteur(). Maak daarnaast een klasse **Bibliotheek** die intern een ArrayList van boeken bijhoudt met de methodes void voegToe(Boek), int aantal() en ArrayList<Boek> zoekOpAuteur(String auteur) die alle boeken van die auteur teruggeeft. Voeg ten slotte een static teller totaalAantalBoeken toe die over ALLE bibliotheken samen telt hoeveel boeken er ooit toegevoegd zijn: verhoog die teller bij elke voegToe.`,
    example: `2 boeken in bib A en 1 in bib B: bibA.aantal()=2, en de static teller stijgt met 3`,
    starterFiles: [
      { name: "Boek.java", content: `public class Boek {
    // TODO: velden titel en auteur

    public Boek(String titel, String auteur) {
        // TODO
    }

    public String getTitel() {
        // TODO
        return null;
    }

    public String getAuteur() {
        // TODO
        return null;
    }
}
` },
      { name: "Bibliotheek.java", content: `import java.util.ArrayList;

public class Bibliotheek {
    public static int totaalAantalBoeken = 0;

    // TODO: een ArrayList<Boek> als veld

    public void voegToe(Boek boek) {
        // TODO: voeg toe en verhoog de static teller
    }

    public int aantal() {
        // TODO
        return 0;
    }

    public ArrayList<Boek> zoekOpAuteur(String auteur) {
        // TODO: geef alle boeken van deze auteur terug
        return null;
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "static\\s+int\\s+totaalAantalBoeken", message: "Maak een static int totaalAantalBoeken." },
        { pattern: "ArrayList", message: "Gebruik een ArrayList om de boeken bij te houden." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        int start = Bibliotheek.totaalAantalBoeken;
        Bibliotheek a = new Bibliotheek();
        Bibliotheek b = new Bibliotheek();
        a.voegToe(new Boek("Java", "Jan"));
        a.voegToe(new Boek("Meer Java", "Jan"));
        b.voegToe(new Boek("Tuinieren", "Mie"));
        checkEq("bib a heeft 2 boeken", 2, a.aantal());
        checkEq("bib b heeft 1 boek", 1, b.aantal());
        Boek eerste = a.zoekOpAuteur("Jan").get(0);
        checkEq("getter titel werkt", "Java", eerste.getTitel());
        checkEq("getter auteur werkt", "Jan", eerste.getAuteur());
        checkEq("zoekOpAuteur Jan geeft 2 boeken", 2, a.zoekOpAuteur("Jan").size());
        checkEq("zoekOpAuteur Mie in a geeft 0", 0, a.zoekOpAuteur("Mie").size());
        checkEq("static teller steeg met 3", 3, Bibliotheek.totaalAantalBoeken - start);
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Boek.java", content: `public class Boek {
    private String titel;
    private String auteur;

    public Boek(String titel, String auteur) {
        this.titel = titel;
        this.auteur = auteur;
    }

    public String getTitel() {
        return titel;
    }

    public String getAuteur() {
        return auteur;
    }
}
` },
      { name: "Bibliotheek.java", content: `import java.util.ArrayList;

public class Bibliotheek {
    public static int totaalAantalBoeken = 0;

    private ArrayList<Boek> boeken = new ArrayList<Boek>();

    public void voegToe(Boek boek) {
        boeken.add(boek);
        totaalAantalBoeken++;
    }

    public int aantal() {
        return boeken.size();
    }

    public ArrayList<Boek> zoekOpAuteur(String auteur) {
        ArrayList<Boek> resultaat = new ArrayList<Boek>();
        for (Boek boek : boeken) {
            if (boek.getAuteur().equals(auteur)) {
                resultaat.add(boek);
            }
        }
        return resultaat;
    }
}
` },
    ],
    relatedConcepts: ["arraylist", "static", "class"],
  },

  // ─── H8 ───────────────────────────────────────────────────────────
  {
    id: "cirkel",
    chapterId: "H8",
    title: "Cirkel",
    difficulty: "easy",
    tags: ["class", "methods"],
    prompt: `Maak een klasse **Cirkel** met een constructor Cirkel(double straal). Voorzie twee methodes: omtrek() geeft de omtrek terug (2 keer Math.PI keer de straal) en oppervlakte() geeft de oppervlakte terug (Math.PI keer de straal in het kwadraat).

Gebruik dus Math.PI voor je berekeningen.`,
    example: `straal 2: omtrek ongeveer 12.566, oppervlakte ongeveer 12.566`,
    starterFiles: [
      { name: "Cirkel.java", content: `public class Cirkel {
    public Cirkel(double straal) {
        // TODO: bewaar de straal
    }
    public double omtrek() {
        return 0; // TODO: 2 * Math.PI * straal
    }
    public double oppervlakte() {
        return 0; // TODO: Math.PI * straal * straal
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Cirkel", message: "Maak een klasse Cirkel." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Cirkel c = new Cirkel(2.0);
        checkNaby("omtrek van straal 2", 2 * Math.PI * 2, c.omtrek());
        checkNaby("oppervlakte van straal 2", Math.PI * 4, c.oppervlakte());
        Cirkel klein = new Cirkel(1.0);
        checkNaby("oppervlakte van straal 1", Math.PI, klein.oppervlakte());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Cirkel.java", content: `public class Cirkel {
    private double straal;

    public Cirkel(double straal) {
        this.straal = straal;
    }

    public double omtrek() {
        return 2 * Math.PI * straal;
    }

    public double oppervlakte() {
        return Math.PI * straal * straal;
    }
}
` },
    ],
    relatedConcepts: ["class", "constructor"],
  },
  {
    id: "persoon",
    chapterId: "H8",
    title: "Persoon",
    difficulty: "easy",
    tags: ["class", "toString"],
    prompt: `Maak een klasse **Persoon** met een constructor Persoon(String naam, int leeftijd). Voorzie getters getNaam() en getLeeftijd().

Voeg ook een methode isMeerderjarig() toe die true teruggeeft als de leeftijd 18 of meer is. Schrijf ten slotte een toString() die de naam en de leeftijd toont.`,
    example: `Persoon("Lisa", 20): isMeerderjarig() geeft true`,
    starterFiles: [
      { name: "Persoon.java", content: `public class Persoon {
    public Persoon(String naam, int leeftijd) {
        // TODO: bewaar naam en leeftijd
    }
    public String getNaam() {
        return ""; // TODO
    }
    public int getLeeftijd() {
        return 0; // TODO
    }
    public boolean isMeerderjarig() {
        return false; // TODO: leeftijd >= 18
    }
    public String toString() {
        return ""; // TODO: toon naam en leeftijd
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Persoon", message: "Maak een klasse Persoon." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Persoon volwassen = new Persoon("Lisa", 20);
        checkEq("getNaam", "Lisa", volwassen.getNaam());
        checkEq("getLeeftijd", 20, volwassen.getLeeftijd());
        check("20 is meerderjarig", volwassen.isMeerderjarig());
        Persoon kind = new Persoon("Sam", 12);
        check("12 is niet meerderjarig", !kind.isMeerderjarig());
        check("toString bevat de naam", volwassen.toString().contains("Lisa"));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Persoon.java", content: `public class Persoon {
    private String naam;
    private int leeftijd;

    public Persoon(String naam, int leeftijd) {
        this.naam = naam;
        this.leeftijd = leeftijd;
    }

    public String getNaam() { return naam; }
    public int getLeeftijd() { return leeftijd; }

    public boolean isMeerderjarig() { return leeftijd >= 18; }

    public String toString() {
        return naam + " (" + leeftijd + " jaar)";
    }
}
` },
    ],
    relatedConcepts: ["class", "toString"],
  },
  {
    id: "tijdsduur",
    chapterId: "H8",
    title: "Tijdsduur",
    difficulty: "medium",
    tags: ["class", "this", "toString"],
    prompt: `Maak een klasse **Tijdsduur** met een constructor Tijdsduur(int uren, int minuten). De constructor moet normaliseren: 60 minuten worden samen 1 uur. Zo wordt Tijdsduur(1, 90) dus 2 uur en 30 minuten.

Voorzie getUren() en getMinuten() (altijd 0 tot en met 59), totaalMinuten() die de volledige duur in minuten teruggeeft, en plus(Tijdsduur andere) die een nieuwe Tijdsduur teruggeeft met de som van beide duren. Schrijf ook een toString() in de vorm Xu Ymin.`,
    example: `Tijdsduur(1, 90) wordt 2u 30min`,
    starterFiles: [
      { name: "Tijdsduur.java", content: `public class Tijdsduur {
    public Tijdsduur(int uren, int minuten) {
        // TODO: normaliseer (60 minuten = 1 uur) en bewaar
    }
    public int getUren() {
        return 0; // TODO
    }
    public int getMinuten() {
        return 0; // TODO
    }
    public int totaalMinuten() {
        return 0; // TODO: uren * 60 + minuten
    }
    public Tijdsduur plus(Tijdsduur andere) {
        return null; // TODO: nieuwe Tijdsduur met de som
    }
    public String toString() {
        return ""; // TODO: vorm Xu Ymin
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Tijdsduur", message: "Maak een klasse Tijdsduur." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Tijdsduur t = new Tijdsduur(1, 90);
        checkEq("1u90 normaliseert naar 2 uur", 2, t.getUren());
        checkEq("1u90 normaliseert naar 30 minuten", 30, t.getMinuten());
        checkEq("totaalMinuten van 1u90 is 150", 150, t.totaalMinuten());
        Tijdsduur som = new Tijdsduur(1, 40).plus(new Tijdsduur(1, 30));
        checkEq("som uren is 3", 3, som.getUren());
        checkEq("som minuten is 10", 10, som.getMinuten());
        check("toString bevat de uren", t.toString().contains("2u"));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Tijdsduur.java", content: `public class Tijdsduur {
    private int uren;
    private int minuten;

    public Tijdsduur(int uren, int minuten) {
        this.uren = uren + minuten / 60;
        this.minuten = minuten % 60;
    }

    public int getUren() { return uren; }
    public int getMinuten() { return minuten; }

    public int totaalMinuten() { return uren * 60 + minuten; }

    public Tijdsduur plus(Tijdsduur andere) {
        return new Tijdsduur(0, totaalMinuten() + andere.totaalMinuten());
    }

    public String toString() {
        return uren + "u " + minuten + "min";
    }
}
` },
    ],
    relatedConcepts: ["class", "this", "toString"],
  },
  {
    id: "magazijn",
    chapterId: "H8",
    title: "Magazijn",
    difficulty: "hard",
    tags: ["class", "ArrayList", "encapsulatie"],
    prompt: `Modelleer een magazijn met twee klassen.

- **Product** met een constructor Product(String naam, double prijs) en getters getNaam() en getPrijs().
- **Magazijn** dat de producten bijhoudt in een ArrayList van Product. Voorzie voegToe(Product) om een product toe te voegen, aantal() dat het aantal producten teruggeeft, totaleWaarde() dat de som van alle prijzen teruggeeft, en duurste() dat het Product met de hoogste prijs teruggeeft.`,
    example: `producten van 1.5 + 2.5 + 0.99: totaleWaarde 4.99, duurste is het product van 2.5`,
    starterFiles: [
      { name: "Product.java", content: `public class Product {
    public Product(String naam, double prijs) {
        // TODO: bewaar naam en prijs
    }
    public String getNaam() {
        return ""; // TODO
    }
    public double getPrijs() {
        return 0; // TODO
    }
}
` },
      { name: "Magazijn.java", content: `import java.util.ArrayList;

public class Magazijn {
    // TODO: ArrayList<Product> veld

    public void voegToe(Product product) {
        // TODO
    }
    public int aantal() {
        return 0; // TODO
    }
    public double totaleWaarde() {
        return 0; // TODO: som van alle prijzen
    }
    public Product duurste() {
        return null; // TODO: product met de hoogste prijs
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Product", message: "Maak een klasse Product." },
        { pattern: "class\\s+Magazijn", message: "Maak een klasse Magazijn." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Product appel = new Product("appel", 1.5);
        Product kaas = new Product("kaas", 2.5);
        Product brood = new Product("brood", 0.99);
        checkEq("getNaam van product", "kaas", kaas.getNaam());
        checkNaby("getPrijs van product", 2.5, kaas.getPrijs());
        Magazijn m = new Magazijn();
        m.voegToe(appel);
        m.voegToe(kaas);
        m.voegToe(brood);
        checkEq("aantal is 3", 3, m.aantal());
        checkNaby("totaleWaarde is 4.99", 4.99, m.totaleWaarde());
        checkEq("duurste is kaas", "kaas", m.duurste().getNaam());
        klaar();
    }
}
`,
      },
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
      { name: "Magazijn.java", content: `import java.util.ArrayList;

public class Magazijn {
    private ArrayList<Product> producten = new ArrayList<>();

    public void voegToe(Product product) {
        producten.add(product);
    }

    public int aantal() {
        return producten.size();
    }

    public double totaleWaarde() {
        double som = 0;
        for (Product p : producten) som += p.getPrijs();
        return som;
    }

    public Product duurste() {
        Product duurste = null;
        for (Product p : producten)
            if (duurste == null || p.getPrijs() > duurste.getPrijs()) duurste = p;
        return duurste;
    }
}
` },
    ],
    relatedConcepts: ["class", "ArrayList"],
  },

  // ─── OBJ ──────────────────────────────────────────────────────────
  {
    id: "rgbkleur",
    chapterId: "OBJ",
    title: "RGB Kleur",
    difficulty: "easy",
    tags: ["equals", "hashCode", "HashSet"],
    prompt: `Maak een klasse **Kleur** met een constructor Kleur(int r, int g, int b) en velden r, g, b.

Overschrijf **equals(Object)** zodat twee Kleuren gelijk zijn als hun r, g en b gelijk zijn. Overschrijf ook **hashCode()** zodat gelijke kleuren dezelfde hashCode hebben.

Zo kan je Kleur-objecten correct in een HashSet steken.`,
    example: `new Kleur(255, 0, 0) is gelijk aan new Kleur(255, 0, 0)`,
    starterFiles: [
      { name: "Kleur.java", content: `public class Kleur {
    private int r;
    private int g;
    private int b;

    public Kleur(int r, int g, int b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // TODO: overschrijf equals(Object) en hashCode()
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "public\\s+boolean\\s+equals", message: "Overschrijf de methode equals(Object)." },
        { pattern: "public\\s+int\\s+hashCode", message: "Overschrijf de methode hashCode()." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Kleur rood1 = new Kleur(255, 0, 0);
        Kleur rood2 = new Kleur(255, 0, 0);
        Kleur blauw = new Kleur(0, 0, 255);

        check("gelijke kleuren zijn equal", rood1.equals(rood2));
        check("gelijke kleuren hebben gelijke hashCode", rood1.hashCode() == rood2.hashCode());
        check("verschillende kleuren zijn niet equal", !rood1.equals(blauw));

        java.util.HashSet<Kleur> set = new java.util.HashSet<Kleur>();
        set.add(rood1);
        set.add(rood2);
        set.add(blauw);
        checkEq("HashSet bevat 2 unieke kleuren", 2, set.size());

        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Kleur.java", content: `public class Kleur {
    private int r;
    private int g;
    private int b;

    public Kleur(int r, int g, int b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (getClass() != o.getClass()) return false;
        Kleur andere = (Kleur) o;
        return r == andere.r && g == andere.g && b == andere.b;
    }

    public int hashCode() {
        int resultaat = 17;
        resultaat = 31 * resultaat + r;
        resultaat = 31 * resultaat + g;
        resultaat = 31 * resultaat + b;
        return resultaat;
    }
}
` },
    ],
    relatedConcepts: ["equals", "hashCode", "HashSet"],
  },
  {
    id: "stemmen",
    chapterId: "OBJ",
    title: "Stemteller",
    difficulty: "medium",
    tags: ["HashMap", "methods"],
    prompt: `Maak een klasse **StemTeller** die stemmen bijhoudt met een HashMap binnenin (kandidaat naar aantal stemmen).

Voorzie deze methodes:
- **void stem(String kandidaat)**: verhoogt het aantal stemmen voor die kandidaat met 1.
- **int aantalVoor(String kandidaat)**: geeft het aantal stemmen voor die kandidaat (0 als nog niemand op die kandidaat stemde).
- **String winnaar()**: geeft de kandidaat met de meeste stemmen.

Je mag ervan uitgaan dat er bij winnaar() minstens één stem is en er geen gelijkspel is.`,
    example: `na stem("Ann"), stem("Ann"), stem("Bo") is winnaar() gelijk aan Ann`,
    starterFiles: [
      { name: "StemTeller.java", content: `import java.util.HashMap;

public class StemTeller {
    private HashMap<String, Integer> stemmen = new HashMap<String, Integer>();

    // TODO: stem(String), aantalVoor(String), winnaar()
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "HashMap", message: "Gebruik een HashMap om de stemmen bij te houden." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        StemTeller t = new StemTeller();

        checkEq("nog geen stemmen voor Ann", 0, t.aantalVoor("Ann"));

        t.stem("Ann");
        t.stem("Ann");
        t.stem("Bo");

        checkEq("Ann heeft 2 stemmen", 2, t.aantalVoor("Ann"));
        checkEq("Bo heeft 1 stem", 1, t.aantalVoor("Bo"));
        checkEq("onbekende kandidaat heeft 0 stemmen", 0, t.aantalVoor("Cas"));
        checkEq("winnaar is Ann", "Ann", t.winnaar());

        t.stem("Bo");
        t.stem("Bo");

        checkEq("Bo heeft nu 3 stemmen", 3, t.aantalVoor("Bo"));
        checkEq("winnaar is nu Bo", "Bo", t.winnaar());

        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "StemTeller.java", content: `import java.util.HashMap;
import java.util.Map;

public class StemTeller {
    private HashMap<String, Integer> stemmen = new HashMap<String, Integer>();

    public void stem(String kandidaat) {
        if (stemmen.containsKey(kandidaat)) {
            stemmen.put(kandidaat, stemmen.get(kandidaat) + 1);
        } else {
            stemmen.put(kandidaat, 1);
        }
    }

    public int aantalVoor(String kandidaat) {
        if (stemmen.containsKey(kandidaat)) {
            return stemmen.get(kandidaat);
        }
        return 0;
    }

    public String winnaar() {
        String beste = null;
        int meeste = -1;
        for (Map.Entry<String, Integer> e : stemmen.entrySet()) {
            if (e.getValue() > meeste) {
                meeste = e.getValue();
                beste = e.getKey();
            }
        }
        return beste;
    }
}
` },
    ],
    relatedConcepts: ["HashMap"],
  },
  {
    id: "breuk",
    chapterId: "OBJ",
    title: "Breuk",
    difficulty: "medium",
    tags: ["equals", "hashCode"],
    prompt: `Maak een klasse **Breuk** met een constructor Breuk(int teller, int noemer).

Overschrijf **equals(Object)** zodat wiskundig gelijke breuken gelijk zijn: 1/2 is gelijk aan 2/4. Tip: gebruik het kruisproduct (a/b is gelijk aan c/d als a*d gelijk is aan c*b).

Overschrijf ook **hashCode()** zodat hij consistent is met equals: gelijke breuken moeten dezelfde hashCode hebben. Tip: vereenvoudig de breuk (deel teller en noemer door hun grootste gemene deler) voor je de hashCode berekent.

Je mag ervan uitgaan dat de noemer altijd positief is.`,
    example: `new Breuk(1, 2) is gelijk aan new Breuk(2, 4)`,
    starterFiles: [
      { name: "Breuk.java", content: `public class Breuk {
    private int teller;
    private int noemer;

    public Breuk(int teller, int noemer) {
        this.teller = teller;
        this.noemer = noemer;
    }

    // TODO: overschrijf equals(Object) en hashCode() (consistent met equals)
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "public\\s+boolean\\s+equals", message: "Overschrijf de methode equals(Object)." },
        { pattern: "public\\s+int\\s+hashCode", message: "Overschrijf de methode hashCode()." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Breuk half = new Breuk(1, 2);
        Breuk ookHalf = new Breuk(2, 4);
        Breuk derde = new Breuk(1, 3);

        check("1/2 is gelijk aan 2/4", half.equals(ookHalf));
        check("1/2 is niet gelijk aan 1/3", !half.equals(derde));
        check("gelijke breuken hebben gelijke hashCode", half.hashCode() == ookHalf.hashCode());
        check("3/6 is gelijk aan 1/2", new Breuk(3, 6).equals(half));
        check("2/3 is niet gelijk aan 1/2", !new Breuk(2, 3).equals(half));

        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Breuk.java", content: `public class Breuk {
    private int teller;
    private int noemer;

    public Breuk(int teller, int noemer) {
        this.teller = teller;
        this.noemer = noemer;
    }

    private int ggd(int a, int b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            int rest = a % b;
            a = b;
            b = rest;
        }
        if (a == 0) return 1;
        return a;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (getClass() != o.getClass()) return false;
        Breuk andere = (Breuk) o;
        return teller * andere.noemer == andere.teller * noemer;
    }

    public int hashCode() {
        int deler = ggd(teller, noemer);
        int t = teller / deler;
        int n = noemer / deler;
        int resultaat = 17;
        resultaat = 31 * resultaat + t;
        resultaat = 31 * resultaat + n;
        return resultaat;
    }
}
` },
    ],
    relatedConcepts: ["equals", "hashCode"],
  },
  {
    id: "telefoonboek",
    chapterId: "OBJ",
    title: "Telefoonboek",
    difficulty: "hard",
    tags: ["HashMap", "methods"],
    prompt: `Maak een klasse **Telefoonboek** die namen koppelt aan telefoonnummers met een HashMap binnenin (naam naar nummer).

Voorzie deze methodes:
- **void voegToe(String naam, String nummer)**: voegt een naam met zijn nummer toe (of vervangt het nummer als de naam al bestaat).
- **String zoek(String naam)**: geeft het nummer bij die naam, of null als de naam onbekend is.
- **boolean bevat(String naam)**: geeft true als de naam in het boek staat.
- **int aantal()**: geeft het aantal namen in het boek.
- **void verwijder(String naam)**: verwijdert die naam uit het boek.`,
    example: `na voegToe("Ann", "0470") geeft zoek("Ann") het nummer 0470`,
    starterFiles: [
      { name: "Telefoonboek.java", content: `import java.util.HashMap;

public class Telefoonboek {
    private HashMap<String, String> boek = new HashMap<String, String>();

    // TODO: voegToe, zoek, bevat, aantal, verwijder
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "HashMap", message: "Gebruik een HashMap om de namen en nummers bij te houden." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Telefoonboek tb = new Telefoonboek();

        checkEq("leeg boek heeft aantal 0", 0, tb.aantal());
        check("zoek onbekende naam geeft null", tb.zoek("Ann") == null);
        check("bevat onbekende naam is false", !tb.bevat("Ann"));

        tb.voegToe("Ann", "0470");
        tb.voegToe("Bo", "0480");

        checkEq("aantal is 2", 2, tb.aantal());
        checkEq("zoek Ann geeft 0470", "0470", tb.zoek("Ann"));
        check("bevat Ann is true", tb.bevat("Ann"));
        check("bevat Cas is false", !tb.bevat("Cas"));

        tb.voegToe("Ann", "0471");
        checkEq("nummer Ann vervangen naar 0471", "0471", tb.zoek("Ann"));
        checkEq("aantal blijft 2 na vervangen", 2, tb.aantal());

        tb.verwijder("Ann");
        checkEq("aantal is 1 na verwijderen", 1, tb.aantal());
        check("bevat Ann is false na verwijderen", !tb.bevat("Ann"));
        check("zoek Ann geeft null na verwijderen", tb.zoek("Ann") == null);

        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Telefoonboek.java", content: `import java.util.HashMap;

public class Telefoonboek {
    private HashMap<String, String> boek = new HashMap<String, String>();

    public void voegToe(String naam, String nummer) {
        boek.put(naam, nummer);
    }

    public String zoek(String naam) {
        return boek.get(naam);
    }

    public boolean bevat(String naam) {
        return boek.containsKey(naam);
    }

    public int aantal() {
        return boek.size();
    }

    public void verwijder(String naam) {
        boek.remove(naam);
    }
}
` },
    ],
    relatedConcepts: ["HashMap"],
  },

  // ─── H10 ──────────────────────────────────────────────────────────
  {
    id: "huisdier",
    chapterId: "H10",
    title: "Huisdier (overerving)",
    difficulty: "easy",
    tags: ["overerving", "extends"],
    prompt: `Maak een basisklasse **Dier** met een methode **String geluid()** die "..." teruggeeft.

Maak twee subklassen die **overerven** van Dier:
- **Hond** waarvan geluid() "Woef" teruggeeft.
- **Kat** waarvan geluid() "Miauw" teruggeeft.

Je override't dus geluid() in elke subklasse.`,
    example: `new Hond().geluid() geeft Woef`,
    starterFiles: [
      { name: "Dier.java", content: `public class Dier {
    public String geluid() { return "..."; }
}
` },
      { name: "Hond.java", content: `public class Hond extends Dier {
    // TODO: override geluid() zodat een hond "Woef" zegt
}
` },
      { name: "Kat.java", content: `public class Kat extends Dier {
    // TODO: override geluid() zodat een kat "Miauw" zegt
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Hond\\s+extends\\s+Dier", message: "Hond moet overerven van Dier." },
        { pattern: "class\\s+Kat\\s+extends\\s+Dier", message: "Kat moet overerven van Dier." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        checkEq("hond zegt Woef", "Woef", new Hond().geluid());
        checkEq("kat zegt Miauw", "Miauw", new Kat().geluid());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Dier.java", content: `public class Dier {
    public String geluid() { return "..."; }
}
` },
      { name: "Hond.java", content: `public class Hond extends Dier {
    public String geluid() { return "Woef"; }
}
` },
      { name: "Kat.java", content: `public class Kat extends Dier {
    public String geluid() { return "Miauw"; }
}
` },
    ],
    relatedConcepts: ["extends", "@Override"],
  },
  {
    id: "spaarrekening",
    chapterId: "H10",
    title: "Spaarrekening (overerving)",
    difficulty: "easy",
    tags: ["overerving", "extends", "super"],
    prompt: `Maak een basisklasse **Rekening** met een constructor **Rekening(double saldo)**, een methode **void stort(double bedrag)** die het bedrag bij het saldo optelt, en **double getSaldo()**.

Maak daarna **Spaarrekening** die **overerft** van Rekening. Roep in de constructor super(saldo) aan. Voeg een methode **void voegRenteToe(double percent)** toe die het saldo met percent% verhoogt (saldo wordt saldo + saldo * percent / 100).`,
    example: `saldo 100, voegRenteToe(10) geeft 110.0`,
    starterFiles: [
      { name: "Rekening.java", content: `public class Rekening {
    private double saldo;
    public Rekening(double saldo) { this.saldo = saldo; }
    public void stort(double bedrag) { saldo += bedrag; }
    public double getSaldo() { return saldo; }
}
` },
      { name: "Spaarrekening.java", content: `public class Spaarrekening extends Rekening {
    public Spaarrekening(double saldo) { super(saldo); }

    // TODO: voegRenteToe(double percent) -- verhoog saldo met percent%
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Spaarrekening\\s+extends\\s+Rekening", message: "Spaarrekening moet overerven van Rekening." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Spaarrekening r = new Spaarrekening(100.0);
        r.stort(50.0);
        checkNaby("na storten = 150", 150.0, r.getSaldo());
        r.voegRenteToe(10.0);
        checkNaby("na 10 procent rente = 165", 165.0, r.getSaldo());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Rekening.java", content: `public class Rekening {
    private double saldo;
    public Rekening(double saldo) { this.saldo = saldo; }
    public void stort(double bedrag) { saldo += bedrag; }
    public double getSaldo() { return saldo; }
}
` },
      { name: "Spaarrekening.java", content: `public class Spaarrekening extends Rekening {
    public Spaarrekening(double saldo) { super(saldo); }

    public void voegRenteToe(double percent) {
        stort(getSaldo() * percent / 100.0);
    }
}
` },
    ],
    relatedConcepts: ["extends", "super"],
  },
  {
    id: "medewerker",
    chapterId: "H10",
    title: "Medewerker (overerving & super)",
    difficulty: "medium",
    tags: ["overerving", "extends", "super", "toString"],
    prompt: `Maak een basisklasse **Persoon** met een constructor **Persoon(String naam)**, een methode **getNaam()** en een **toString()** die de naam teruggeeft.

Maak daarna **Werknemer** die **overerft** van Persoon. De constructor is **Werknemer(String naam, double maandloon)** en roept super(naam) aan. Voeg **getMaandloon()** toe en een **toString()** die zowel de naam (via super.getNaam() of getNaam()) als het maandloon toont.`,
    example: `Werknemer("Ann", 2500) -> toString bevat "Ann"`,
    starterFiles: [
      { name: "Persoon.java", content: `public class Persoon {
    private String naam;
    public Persoon(String naam) { this.naam = naam; }
    public String getNaam() { return naam; }
    public String toString() { return naam; }
}
` },
      { name: "Werknemer.java", content: `public class Werknemer extends Persoon {
    private double maandloon;

    public Werknemer(String naam, double maandloon) {
        super(naam);
        this.maandloon = maandloon;
    }

    // TODO: getMaandloon()
    // TODO: toString() die naam en maandloon toont
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "class\\s+Werknemer\\s+extends\\s+Persoon", message: "Werknemer moet overerven van Persoon." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Werknemer w = new Werknemer("Ann", 2500.0);
        checkEq("naam via subklasse", "Ann", w.getNaam());
        checkNaby("maandloon klopt", 2500.0, w.getMaandloon());
        check("toString bevat naam", w.toString().contains("Ann"));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Persoon.java", content: `public class Persoon {
    private String naam;
    public Persoon(String naam) { this.naam = naam; }
    public String getNaam() { return naam; }
    public String toString() { return naam; }
}
` },
      { name: "Werknemer.java", content: `public class Werknemer extends Persoon {
    private double maandloon;

    public Werknemer(String naam, double maandloon) {
        super(naam);
        this.maandloon = maandloon;
    }

    public double getMaandloon() { return maandloon; }

    public String toString() {
        return super.getNaam() + " verdient " + maandloon + " euro";
    }
}
` },
    ],
    relatedConcepts: ["extends", "super", "toString"],
  },
  {
    id: "wagenpark",
    chapterId: "H10",
    title: "Wagenpark (overerving & ArrayList)",
    difficulty: "hard",
    tags: ["overerving", "extends", "super", "ArrayList"],
    prompt: `Maak een basisklasse **Wagen** met een constructor **Wagen(String merk, int aantalWielen)** en getters **getMerk()** en **getAantalWielen()**.

Maak twee subklassen die **overerven** van Wagen:
- **Auto** waarbij je super(merk, 4) aanroept (een auto heeft 4 wielen).
- **Motor** waarbij je super(merk, 2) aanroept (een motor heeft 2 wielen).

Maak ten slotte een klasse **Wagenpark** die intern een ArrayList<Wagen> bijhoudt, met:
- **void voegToe(Wagen w)**
- **int aantal()** -- hoeveel wagens er in het park zitten
- **int totaalWielen()** -- de som van de wielen van alle wagens.`,
    example: `Auto + Motor -> aantal 2, totaalWielen 6`,
    starterFiles: [
      { name: "Wagen.java", content: `public class Wagen {
    private String merk;
    private int aantalWielen;
    public Wagen(String merk, int aantalWielen) {
        this.merk = merk;
        this.aantalWielen = aantalWielen;
    }
    public String getMerk() { return merk; }
    public int getAantalWielen() { return aantalWielen; }
}
` },
      { name: "Auto.java", content: `public class Auto extends Wagen {
    // TODO: constructor Auto(String merk) die super(merk, 4) aanroept
}
` },
      { name: "Motor.java", content: `public class Motor extends Wagen {
    // TODO: constructor Motor(String merk) die super(merk, 2) aanroept
}
` },
      { name: "Wagenpark.java", content: `import java.util.ArrayList;

public class Wagenpark {
    private ArrayList<Wagen> wagens = new ArrayList<Wagen>();

    // TODO: voegToe(Wagen w)
    // TODO: aantal()
    // TODO: totaalWielen() -- som van getAantalWielen() over alle wagens
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Auto\\s+extends\\s+Wagen", message: "Auto moet overerven van Wagen." },
        { pattern: "class\\s+Motor\\s+extends\\s+Wagen", message: "Motor moet overerven van Wagen." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Wagenpark park = new Wagenpark();
        Auto auto = new Auto("VW");
        Motor motor = new Motor("Yamaha");
        park.voegToe(auto);
        park.voegToe(motor);
        checkEq("aantal = 2", 2, park.aantal());
        checkEq("totaal wielen = 6", 6, park.totaalWielen());
        checkEq("merk auto klopt", "VW", auto.getMerk());
        checkEq("merk motor klopt", "Yamaha", motor.getMerk());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Wagen.java", content: `public class Wagen {
    private String merk;
    private int aantalWielen;
    public Wagen(String merk, int aantalWielen) {
        this.merk = merk;
        this.aantalWielen = aantalWielen;
    }
    public String getMerk() { return merk; }
    public int getAantalWielen() { return aantalWielen; }
}
` },
      { name: "Auto.java", content: `public class Auto extends Wagen {
    public Auto(String merk) { super(merk, 4); }
}
` },
      { name: "Motor.java", content: `public class Motor extends Wagen {
    public Motor(String merk) { super(merk, 2); }
}
` },
      { name: "Wagenpark.java", content: `import java.util.ArrayList;

public class Wagenpark {
    private ArrayList<Wagen> wagens = new ArrayList<Wagen>();

    public void voegToe(Wagen w) { wagens.add(w); }

    public int aantal() { return wagens.size(); }

    public int totaalWielen() {
        int som = 0;
        for (Wagen w : wagens) {
            som += w.getAantalWielen();
        }
        return som;
    }
}
` },
    ],
    relatedConcepts: ["extends", "super", "ArrayList"],
  },

  // ─── H11 ──────────────────────────────────────────────────────────
  {
    id: "instrument",
    chapterId: "H11",
    title: "Instrument (abstract & polymorfisme)",
    difficulty: "easy",
    tags: ["abstract", "polymorfisme", "Override"],
    prompt: `Maak een **abstracte** klasse **Instrument** met een abstracte methode **String bespeel()**.

Maak twee subklassen:
- **Gitaar**: bespeel() geeft "Tokkel" terug.
- **Piano**: bespeel() geeft "Pling" terug.

Omdat Instrument abstract is, kun je geen Instrument rechtstreeks maken, maar wel een Instrument-variabele laten wijzen naar een Gitaar of een Piano. Dat is polymorfisme.`,
    example: `new Gitaar().bespeel() geeft Tokkel`,
    starterFiles: [
      { name: "Instrument.java", content: `public abstract class Instrument {
    // TODO: abstracte methode String bespeel()
}
` },
      { name: "Gitaar.java", content: `public class Gitaar extends Instrument {
    // TODO: overschrijf bespeel() zodat het "Tokkel" teruggeeft
}
` },
      { name: "Piano.java", content: `public class Piano extends Instrument {
    // TODO: overschrijf bespeel() zodat het "Pling" teruggeeft
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "abstract\\s+class\\s+Instrument", message: "Instrument moet een abstracte klasse zijn." },
        { pattern: "class\\s+Gitaar\\s+extends\\s+Instrument", message: "Gitaar moet overerven van Instrument." },
        { pattern: "class\\s+Piano\\s+extends\\s+Instrument", message: "Piano moet overerven van Instrument." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        checkEq("gitaar zegt Tokkel", "Tokkel", new Gitaar().bespeel());
        checkEq("piano zegt Pling", "Pling", new Piano().bespeel());
        Instrument i = new Gitaar();
        checkEq("polymorfisme: Instrument-variabele naar Gitaar", "Tokkel", i.bespeel());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Instrument.java", content: `public abstract class Instrument {
    public abstract String bespeel();
}
` },
      { name: "Gitaar.java", content: `public class Gitaar extends Instrument {
    @Override
    public String bespeel() { return "Tokkel"; }
}
` },
      { name: "Piano.java", content: `public class Piano extends Instrument {
    @Override
    public String bespeel() { return "Pling"; }
}
` },
    ],
    relatedConcepts: ["abstract class", "polymorfisme", "Override"],
  },
  {
    id: "betaalwijze",
    chapterId: "H11",
    title: "Betaalwijze (abstracte kosten)",
    difficulty: "medium",
    tags: ["abstract", "polymorfisme", "Override"],
    prompt: `Maak een **abstracte** klasse **Betaling** met een abstracte methode **double kosten(double bedrag)**. Die geeft terug hoeveel je in totaal betaalt voor een bepaald bedrag.

Maak twee subklassen:
- **Contant**: geen toeslag, dus kosten(bedrag) is gewoon het bedrag zelf.
- **Kaart**: 1% toeslag, dus kosten(bedrag) is bedrag * 1.01.

Zo kun je een Betaling-variabele laten wijzen naar een Contant of een Kaart en toch dezelfde methode aanroepen.`,
    example: `Contant: kosten(100) geeft 100.0 en Kaart: kosten(100) geeft 101.0`,
    starterFiles: [
      { name: "Betaling.java", content: `public abstract class Betaling {
    // TODO: abstracte methode double kosten(double bedrag)
}
` },
      { name: "Contant.java", content: `public class Contant extends Betaling {
    // TODO: overschrijf kosten() zonder toeslag
}
` },
      { name: "Kaart.java", content: `public class Kaart extends Betaling {
    // TODO: overschrijf kosten() met 1% toeslag (bedrag * 1.01)
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "abstract\\s+class\\s+Betaling", message: "Betaling moet een abstracte klasse zijn." },
        { pattern: "class\\s+Contant\\s+extends\\s+Betaling", message: "Contant moet overerven van Betaling." },
        { pattern: "class\\s+Kaart\\s+extends\\s+Betaling", message: "Kaart moet overerven van Betaling." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Contant c = new Contant();
        checkNaby("contant zonder toeslag", 100.0, c.kosten(100.0));
        Kaart k = new Kaart();
        checkNaby("kaart met 1 procent toeslag", 101.0, k.kosten(100.0));
        Betaling b = new Kaart();
        checkNaby("polymorfisme: Betaling-referentie naar Kaart", 202.0, b.kosten(200.0));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Betaling.java", content: `public abstract class Betaling {
    public abstract double kosten(double bedrag);
}
` },
      { name: "Contant.java", content: `public class Contant extends Betaling {
    @Override
    public double kosten(double bedrag) { return bedrag; }
}
` },
      { name: "Kaart.java", content: `public class Kaart extends Betaling {
    @Override
    public double kosten(double bedrag) { return bedrag * 1.01; }
}
` },
    ],
    relatedConcepts: ["abstract class", "polymorfisme", "Override"],
  },
  {
    id: "figuur-oppervlakte",
    chapterId: "H11",
    title: "Figuur (oppervlakte & ArrayList)",
    difficulty: "medium",
    tags: ["abstract", "polymorfisme", "ArrayList"],
    prompt: `Maak een **abstracte** klasse **Figuur** met een abstracte methode **double oppervlakte()**.

Maak twee subklassen:
- **Cirkel(double straal)**: oppervlakte is Math.PI * straal * straal.
- **Vierkant(double zijde)**: oppervlakte is zijde * zijde.

Dankzij polymorfisme kun je beide types samen in een **ArrayList<Figuur>** stoppen en de oppervlaktes optellen. Voorzie daarom ook een static methode **double totaleOppervlakte(ArrayList<Figuur> figuren)** die de som van alle oppervlaktes teruggeeft. Zet die methode in Figuur.`,
    example: `Cirkel(2) heeft oppervlakte 12.566... en Vierkant(3) heeft oppervlakte 9.0`,
    starterFiles: [
      { name: "Figuur.java", content: `import java.util.ArrayList;

public abstract class Figuur {
    // TODO: abstracte methode double oppervlakte()

    public static double totaleOppervlakte(ArrayList<Figuur> figuren) {
        // TODO: tel de oppervlakte van elke figuur op en geef de som terug
        return 0;
    }
}
` },
      { name: "Cirkel.java", content: `public class Cirkel extends Figuur {
    public Cirkel(double straal) { /* TODO: bewaar straal */ }
    // TODO: overschrijf oppervlakte() (Math.PI * straal * straal)
}
` },
      { name: "Vierkant.java", content: `public class Vierkant extends Figuur {
    public Vierkant(double zijde) { /* TODO: bewaar zijde */ }
    // TODO: overschrijf oppervlakte() (zijde * zijde)
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "abstract\\s+class\\s+Figuur", message: "Figuur moet een abstracte klasse zijn." },
        { pattern: "class\\s+Cirkel\\s+extends\\s+Figuur", message: "Cirkel moet overerven van Figuur." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `import java.util.ArrayList;

public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Cirkel c = new Cirkel(2.0);
        checkNaby("cirkel oppervlakte", Math.PI * 4.0, c.oppervlakte());
        Vierkant v = new Vierkant(3.0);
        checkNaby("vierkant oppervlakte 9", 9.0, v.oppervlakte());
        ArrayList<Figuur> figuren = new ArrayList<Figuur>();
        figuren.add(c);
        figuren.add(v);
        checkNaby("som over lijst met beide types", Math.PI * 4.0 + 9.0, Figuur.totaleOppervlakte(figuren));
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Figuur.java", content: `import java.util.ArrayList;

public abstract class Figuur {
    public abstract double oppervlakte();

    public static double totaleOppervlakte(ArrayList<Figuur> figuren) {
        double som = 0;
        for (Figuur f : figuren) {
            som = som + f.oppervlakte();
        }
        return som;
    }
}
` },
      { name: "Cirkel.java", content: `public class Cirkel extends Figuur {
    private double straal;
    public Cirkel(double straal) { this.straal = straal; }
    @Override
    public double oppervlakte() { return Math.PI * straal * straal; }
}
` },
      { name: "Vierkant.java", content: `public class Vierkant extends Figuur {
    private double zijde;
    public Vierkant(double zijde) { this.zijde = zijde; }
    @Override
    public double oppervlakte() { return zijde * zijde; }
}
` },
    ],
    relatedConcepts: ["abstract class", "polymorfisme", "ArrayList"],
  },
  {
    id: "energiefactuur",
    chapterId: "H11",
    title: "Energiefactuur (toestellen in een woning)",
    difficulty: "hard",
    tags: ["abstract", "polymorfisme", "ArrayList"],
    prompt: `Je modelleert het stroomverbruik van een woning.

Maak een **abstracte** klasse **Toestel** met een constructor **Toestel(String naam)**, een getter **getNaam()** en een abstracte methode **double verbruikPerDag()** (in kWh).

Maak twee subklassen:
- **Lamp**: verbruikt 0.1 kWh per dag.
- **Boiler**: verbruikt 5.0 kWh per dag.

Maak ook een klasse **Woning** met een **ArrayList<Toestel>** en deze methodes:
- **void voegToe(Toestel t)**: voegt een toestel toe.
- **double totaalVerbruik()**: de som van het verbruik per dag van alle toestellen.
- **Toestel grootsteVerbruiker()**: het toestel met het hoogste verbruik per dag (of null als er geen toestellen zijn).`,
    example: `1 lamp (0.1) + 1 boiler (5.0): totaal 5.1, grootste verbruiker = Boiler`,
    starterFiles: [
      { name: "Toestel.java", content: `public abstract class Toestel {
    private String naam;
    public Toestel(String naam) { this.naam = naam; }
    public String getNaam() { return naam; }
    // TODO: abstracte methode double verbruikPerDag()
}
` },
      { name: "Lamp.java", content: `public class Lamp extends Toestel {
    public Lamp(String naam) { super(naam); }
    // TODO: overschrijf verbruikPerDag() -> 0.1
}
` },
      { name: "Boiler.java", content: `public class Boiler extends Toestel {
    public Boiler(String naam) { super(naam); }
    // TODO: overschrijf verbruikPerDag() -> 5.0
}
` },
      { name: "Woning.java", content: `import java.util.ArrayList;

public class Woning {
    private ArrayList<Toestel> toestellen = new ArrayList<Toestel>();

    public void voegToe(Toestel t) {
        // TODO: voeg t toe aan de lijst
    }

    public double totaalVerbruik() {
        // TODO: tel het verbruik per dag van alle toestellen op
        return 0;
    }

    public Toestel grootsteVerbruiker() {
        // TODO: geef het toestel met het hoogste verbruik per dag terug (null als leeg)
        return null;
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "abstract\\s+class\\s+Toestel", message: "Toestel moet een abstracte klasse zijn." },
        { pattern: "class\\s+Boiler\\s+extends\\s+Toestel", message: "Boiler moet overerven van Toestel." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Lamp lamp = new Lamp("keukenlamp");
        Boiler boiler = new Boiler("badkamerboiler");
        checkNaby("lamp verbruikt 0.1", 0.1, lamp.verbruikPerDag());
        checkNaby("boiler verbruikt 5.0", 5.0, boiler.verbruikPerDag());

        Woning woning = new Woning();
        woning.voegToe(lamp);
        woning.voegToe(boiler);
        woning.voegToe(new Lamp("gangverlichting"));

        checkNaby("totaal verbruik 5.2", 5.2, woning.totaalVerbruik());
        check("grootste verbruiker is de boiler", woning.grootsteVerbruiker() == boiler);
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Toestel.java", content: `public abstract class Toestel {
    private String naam;
    public Toestel(String naam) { this.naam = naam; }
    public String getNaam() { return naam; }
    public abstract double verbruikPerDag();
}
` },
      { name: "Lamp.java", content: `public class Lamp extends Toestel {
    public Lamp(String naam) { super(naam); }
    @Override
    public double verbruikPerDag() { return 0.1; }
}
` },
      { name: "Boiler.java", content: `public class Boiler extends Toestel {
    public Boiler(String naam) { super(naam); }
    @Override
    public double verbruikPerDag() { return 5.0; }
}
` },
      { name: "Woning.java", content: `import java.util.ArrayList;

public class Woning {
    private ArrayList<Toestel> toestellen = new ArrayList<Toestel>();

    public void voegToe(Toestel t) {
        toestellen.add(t);
    }

    public double totaalVerbruik() {
        double som = 0;
        for (Toestel t : toestellen) {
            som = som + t.verbruikPerDag();
        }
        return som;
    }

    public Toestel grootsteVerbruiker() {
        Toestel grootste = null;
        for (Toestel t : toestellen) {
            if (grootste == null || t.verbruikPerDag() > grootste.verbruikPerDag()) {
                grootste = t;
            }
        }
        return grootste;
    }
}
` },
    ],
    relatedConcepts: ["abstract class", "polymorfisme", "ArrayList"],
  },

  // ─── H12 ──────────────────────────────────────────────────────────
  {
    id: "weegbaar",
    chapterId: "H12",
    title: "Weegbaar pakket",
    difficulty: "easy",
    tags: ["interface"],
    prompt: `Maak een interface **Weegbaar** met de methode double getGewicht(). Maak daarna een klasse **Pakket** met een constructor Pakket(double gewicht) die Weegbaar implementeert en het gewicht teruggeeft via getGewicht().`,
    example: `new Pakket(2.5) bekeken als Weegbaar geeft getGewicht() == 2.5`,
    starterFiles: [
      { name: "Weegbaar.java", content: `public interface Weegbaar {
    // TODO: methode double getGewicht()
}
` },
      { name: "Pakket.java", content: `public class Pakket implements Weegbaar {
    // TODO: veld gewicht, constructor Pakket(double gewicht), getGewicht()
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "interface\\s+Weegbaar", message: "Maak een interface Weegbaar." },
        { pattern: "class\\s+Pakket\\s+implements\\s+Weegbaar", message: "Laat Pakket de interface Weegbaar implementeren." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Weegbaar w = new Pakket(2.5);
        checkNaby("getGewicht is 2.5", 2.5, w.getGewicht());
        Weegbaar zwaar = new Pakket(10.75);
        checkNaby("getGewicht is 10.75", 10.75, zwaar.getGewicht());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Weegbaar.java", content: `public interface Weegbaar {
    double getGewicht();
}
` },
      { name: "Pakket.java", content: `public class Pakket implements Weegbaar {
    private double gewicht;
    public Pakket(double gewicht) {
        this.gewicht = gewicht;
    }
    public double getGewicht() {
        return gewicht;
    }
}
` },
    ],
    relatedConcepts: ["interface"],
  },
  {
    id: "oplaadbaar",
    chapterId: "H12",
    title: "Oplaadbare batterij",
    difficulty: "easy",
    tags: ["interface"],
    prompt: `Maak een interface **Oplaadbaar** met void laadOp(int procent) en int getNiveau(). Maak daarna een klasse **Batterij** die Oplaadbaar implementeert. Een nieuwe batterij start op niveau 0. Met laadOp(procent) verhoog je het niveau, maar het niveau mag nooit boven 100 komen.`,
    example: `start 0, na laadOp(30) is niveau 30, daarna laadOp(90) plafonneert op 100`,
    starterFiles: [
      { name: "Oplaadbaar.java", content: `public interface Oplaadbaar {
    // TODO: void laadOp(int procent) en int getNiveau()
}
` },
      { name: "Batterij.java", content: `public class Batterij implements Oplaadbaar {
    // TODO: veld niveau (start 0), laadOp() met plafond 100, getNiveau()
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "interface\\s+Oplaadbaar", message: "Maak een interface Oplaadbaar." },
        { pattern: "class\\s+Batterij\\s+implements\\s+Oplaadbaar", message: "Laat Batterij de interface Oplaadbaar implementeren." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Oplaadbaar b = new Batterij();
        checkEq("start is 0", 0, b.getNiveau());
        b.laadOp(30);
        checkEq("na laadOp 30 is 30", 30, b.getNiveau());
        b.laadOp(90);
        checkEq("plafonneert op 100", 100, b.getNiveau());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Oplaadbaar.java", content: `public interface Oplaadbaar {
    void laadOp(int procent);
    int getNiveau();
}
` },
      { name: "Batterij.java", content: `public class Batterij implements Oplaadbaar {
    private int niveau = 0;
    public void laadOp(int procent) {
        niveau = niveau + procent;
        if (niveau > 100) {
            niveau = 100;
        }
    }
    public int getNiveau() {
        return niveau;
    }
}
` },
    ],
    relatedConcepts: ["interface"],
  },
  {
    id: "artikel-sorteer",
    chapterId: "H12",
    title: "Artikels sorteren op prijs",
    difficulty: "medium",
    tags: ["interface", "comparable"],
    prompt: `Maak een klasse **Artikel** met een constructor Artikel(String naam, double prijs), getters getNaam() en getPrijs(), die Comparable<Artikel> implementeert. De natuurlijke volgorde sorteert van goedkoopste naar duurste. Als je een ArrayList<Artikel> met Collections.sort sorteert, staat het goedkoopste artikel dus vooraan.`,
    example: `na sorteren staat het goedkoopste artikel op index 0 en het duurste achteraan`,
    starterFiles: [
      { name: "Artikel.java", content: `public class Artikel implements Comparable<Artikel> {
    // TODO: velden naam en prijs, constructor, getNaam(), getPrijs()
    // TODO: compareTo op prijs (goedkoopste eerst)
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Artikel\\s+implements\\s+Comparable", message: "Laat Artikel Comparable implementeren." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        java.util.ArrayList<Artikel> lijst = new java.util.ArrayList<Artikel>();
        lijst.add(new Artikel("Boek", 19.99));
        lijst.add(new Artikel("Pen", 1.50));
        lijst.add(new Artikel("Laptop", 899.0));
        lijst.add(new Artikel("Tas", 45.0));
        java.util.Collections.sort(lijst);
        checkEq("goedkoopste vooraan is Pen", "Pen", lijst.get(0).getNaam());
        checkNaby("goedkoopste prijs is 1.50", 1.50, lijst.get(0).getPrijs());
        checkEq("duurste achteraan is Laptop", "Laptop", lijst.get(lijst.size() - 1).getNaam());
        checkNaby("duurste prijs is 899.0", 899.0, lijst.get(lijst.size() - 1).getPrijs());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Artikel.java", content: `import java.util.ArrayList;
import java.util.Collections;

public class Artikel implements Comparable<Artikel> {
    private String naam;
    private double prijs;
    public Artikel(String naam, double prijs) {
        this.naam = naam;
        this.prijs = prijs;
    }
    public String getNaam() {
        return naam;
    }
    public double getPrijs() {
        return prijs;
    }
    public int compareTo(Artikel other) {
        return Double.compare(this.prijs, other.prijs);
    }
}
` },
    ],
    relatedConcepts: ["interface", "comparable"],
  },
  {
    id: "topscores",
    chapterId: "H12",
    title: "Scorebord met topscores",
    difficulty: "hard",
    tags: ["interface", "comparable"],
    prompt: `Maak een klasse **Score** met een constructor Score(String speler, int punten), getters getSpeler() en getPunten(), die Comparable<Score> implementeert en sorteert van hoog naar laag (meeste punten eerst). Maak daarna een klasse **Scorebord** met een ArrayList<Score> en de methodes void voegToe(Score s), void sorteer(), Score get(int index), int aantal() en ArrayList<Score> top(int n) die de n hoogste scores teruggeeft.`,
    example: `na sorteer() staat de hoogste score vooraan, en top(2) geeft de 2 hoogste scores`,
    starterFiles: [
      { name: "Score.java", content: `public class Score implements Comparable<Score> {
    // TODO: velden speler en punten, constructor, getSpeler(), getPunten()
    // TODO: compareTo op punten (hoog naar laag)
}
` },
      { name: "Scorebord.java", content: `import java.util.ArrayList;
import java.util.Collections;

public class Scorebord {
    // TODO: ArrayList<Score> veld
    // TODO: voegToe(Score s), sorteer(), get(int index), aantal(), top(int n)
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "class\\s+Score\\s+implements\\s+Comparable", message: "Laat Score Comparable implementeren." },
        { pattern: "class\\s+Scorebord", message: "Maak een klasse Scorebord." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Scorebord bord = new Scorebord();
        bord.voegToe(new Score("Anna", 50));
        bord.voegToe(new Score("Bram", 90));
        bord.voegToe(new Score("Cas", 30));
        bord.voegToe(new Score("Dina", 70));
        checkEq("aantal is 4", 4, bord.aantal());
        bord.sorteer();
        checkEq("hoogste vooraan is Bram", "Bram", bord.get(0).getSpeler());
        checkEq("hoogste punten is 90", 90, bord.get(0).getPunten());
        checkEq("laagste achteraan is Cas", "Cas", bord.get(bord.aantal() - 1).getSpeler());
        java.util.ArrayList<Score> top2 = bord.top(2);
        checkEq("top2 heeft 2 elementen", 2, top2.size());
        checkEq("top2 eerste is Bram", "Bram", top2.get(0).getSpeler());
        checkEq("top2 tweede is Dina", "Dina", top2.get(1).getSpeler());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Score.java", content: `public class Score implements Comparable<Score> {
    private String speler;
    private int punten;
    public Score(String speler, int punten) {
        this.speler = speler;
        this.punten = punten;
    }
    public String getSpeler() {
        return speler;
    }
    public int getPunten() {
        return punten;
    }
    public int compareTo(Score other) {
        return Integer.compare(other.punten, this.punten);
    }
}
` },
      { name: "Scorebord.java", content: `import java.util.ArrayList;
import java.util.Collections;

public class Scorebord {
    private ArrayList<Score> scores = new ArrayList<Score>();
    public void voegToe(Score s) {
        scores.add(s);
    }
    public void sorteer() {
        Collections.sort(scores);
    }
    public Score get(int index) {
        return scores.get(index);
    }
    public int aantal() {
        return scores.size();
    }
    public ArrayList<Score> top(int n) {
        sorteer();
        ArrayList<Score> resultaat = new ArrayList<Score>();
        for (int i = 0; i < n && i < scores.size(); i++) {
            resultaat.add(scores.get(i));
        }
        return resultaat;
    }
}
` },
    ],
    relatedConcepts: ["interface", "comparable"],
  },

  // ─── H14 ──────────────────────────────────────────────────────────
  {
    id: "leeftijd-check",
    chapterId: "H14",
    title: "Leeftijd controleren",
    difficulty: "easy",
    tags: ["exceptions"],
    prompt: `Maak een klasse **Validator** met een static methode controleerLeeftijd(int leeftijd) die niks teruggeeft. De methode gooit een IllegalArgumentException als de leeftijd kleiner is dan 0 of groter dan 150. Voor een geldige leeftijd doet de methode gewoon niks.`,
    example: `controleerLeeftijd(25) doet niks, controleerLeeftijd(-5) gooit een exception`,
    starterFiles: [
      { name: "Validator.java", content: `public class Validator {
    // TODO: static void controleerLeeftijd(int leeftijd) — gooi IllegalArgumentException als leeftijd < 0 of > 150
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "throw\\s+new", message: "Gebruik throw new ... om een exception te gooien." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        boolean geldigGooit = false;
        try { Validator.controleerLeeftijd(25); } catch (IllegalArgumentException e) { geldigGooit = true; }
        check("controleerLeeftijd(25) gooit niet", !geldigGooit);

        boolean negatiefGooit = false;
        try { Validator.controleerLeeftijd(-5); } catch (IllegalArgumentException e) { negatiefGooit = true; }
        check("controleerLeeftijd(-5) gooit exception", negatiefGooit);

        boolean teGrootGooit = false;
        try { Validator.controleerLeeftijd(200); } catch (IllegalArgumentException e) { teGrootGooit = true; }
        check("controleerLeeftijd(200) gooit exception", teGrootGooit);
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Validator.java", content: `public class Validator {
    public static void controleerLeeftijd(int leeftijd) {
        if (leeftijd < 0 || leeftijd > 150) throw new IllegalArgumentException("Ongeldige leeftijd: " + leeftijd);
    }
}
` },
    ],
    relatedConcepts: ["exceptions"],
  },
  {
    id: "stapel-leeg",
    chapterId: "H14",
    title: "Lege stapel",
    difficulty: "easy",
    tags: ["exceptions"],
    prompt: `Maak een klasse **Stapel** die getallen bijhoudt. Voeg een methode void push(int waarde) toe die een getal bovenop legt, een methode int pop() die het bovenste getal teruggeeft en verwijdert, en een methode boolean isLeeg() die teruggeeft of de stapel leeg is. Als je pop() oproept op een lege stapel, gooi dan een IllegalStateException.`,
    example: `pop() op een lege stapel gooit een exception`,
    starterFiles: [
      { name: "Stapel.java", content: `import java.util.ArrayList;

public class Stapel {
    private ArrayList<Integer> elementen = new ArrayList<>();

    // TODO: void push(int waarde)

    // TODO: int pop() — gooi IllegalStateException als de stapel leeg is

    // TODO: boolean isLeeg()
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "throw\\s+new", message: "Gebruik throw new ... om een exception te gooien." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Stapel leeg = new Stapel();
        check("nieuwe stapel is leeg", leeg.isLeeg());

        boolean popLeegGooit = false;
        try { leeg.pop(); } catch (IllegalStateException e) { popLeegGooit = true; }
        check("pop() op lege stapel gooit exception", popLeegGooit);

        Stapel s = new Stapel();
        s.push(5);
        check("na push(5) is stapel niet leeg", !s.isLeeg());

        boolean popVolGooit = false;
        int waarde = 0;
        try { waarde = s.pop(); } catch (IllegalStateException e) { popVolGooit = true; }
        check("pop() na push(5) gooit niet", !popVolGooit);
        checkEq("pop() na push(5) geeft 5 terug", 5, waarde);
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Stapel.java", content: `import java.util.ArrayList;

public class Stapel {
    private ArrayList<Integer> elementen = new ArrayList<>();

    public void push(int waarde) {
        elementen.add(waarde);
    }

    public int pop() {
        if (isLeeg()) throw new IllegalStateException("De stapel is leeg");
        return elementen.remove(elementen.size() - 1);
    }

    public boolean isLeeg() {
        return elementen.isEmpty();
    }
}
` },
    ],
    relatedConcepts: ["exceptions"],
  },
  {
    id: "kluis",
    chapterId: "H14",
    title: "Kluis met saldo",
    difficulty: "medium",
    tags: ["exceptions"],
    prompt: `Maak eerst een eigen exception **OnvoldoendeSaldoException** die overerft van Exception. Maak daarna een klasse **Kluis** met een constructor Kluis(double saldo) die het beginsaldo instelt. Voeg een methode void neem(double bedrag) toe die het bedrag van het saldo aftrekt, maar een OnvoldoendeSaldoException gooit als het bedrag groter is dan het huidige saldo. Voeg ook een methode double getSaldo() toe die het huidige saldo teruggeeft.`,
    example: `neem(50) op een kluis met saldo 200 lukt, neem(500) gooit een exception`,
    starterFiles: [
      { name: "OnvoldoendeSaldoException.java", content: `public class OnvoldoendeSaldoException extends Exception {
    // TODO: constructor met een boodschap
}
` },
      { name: "Kluis.java", content: `public class Kluis {
    private double saldo;

    // TODO: constructor Kluis(double saldo)

    // TODO: void neem(double bedrag) throws OnvoldoendeSaldoException — gooi als bedrag > saldo

    // TODO: double getSaldo()
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "extends\\s+Exception", message: "OnvoldoendeSaldoException moet overerven van Exception." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Kluis k = new Kluis(200.0);
        boolean geldigGooit = false;
        try { k.neem(50.0); } catch (OnvoldoendeSaldoException e) { geldigGooit = true; }
        check("neem(50) gooit niet", !geldigGooit);
        checkNaby("saldo is 150 na neem(50)", 150.0, k.getSaldo());

        boolean teGrootGooit = false;
        try { k.neem(500.0); } catch (OnvoldoendeSaldoException e) { teGrootGooit = true; }
        check("neem(500) gooit OnvoldoendeSaldoException", teGrootGooit);
        checkNaby("saldo blijft 150 na mislukte opname", 150.0, k.getSaldo());
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "OnvoldoendeSaldoException.java", content: `public class OnvoldoendeSaldoException extends Exception {
    public OnvoldoendeSaldoException(String boodschap) {
        super(boodschap);
    }
}
` },
      { name: "Kluis.java", content: `public class Kluis {
    private double saldo;

    public Kluis(double saldo) {
        this.saldo = saldo;
    }

    public void neem(double bedrag) throws OnvoldoendeSaldoException {
        if (bedrag > saldo) throw new OnvoldoendeSaldoException("Onvoldoende saldo voor opname van " + bedrag);
        saldo = saldo - bedrag;
    }

    public double getSaldo() {
        return saldo;
    }
}
` },
    ],
    relatedConcepts: ["exceptions"],
  },
  {
    id: "rekenmachine-veilig",
    chapterId: "H14",
    title: "Veilige rekenmachine",
    difficulty: "hard",
    tags: ["exceptions"],
    prompt: `Maak twee eigen exceptions: **DeelDoorNulException** en **NegatieveWortelException**, die allebei overerven van Exception. Maak daarna een klasse **Rekenmachine** met een methode double deel(double a, double b) die a deelt door b, maar een DeelDoorNulException gooit als b gelijk is aan 0. Voeg ook een methode double wortel(double x) toe die de Math.sqrt teruggeeft, maar een NegatieveWortelException gooit als x kleiner is dan 0.`,
    example: `deel(10, 2) geeft 5, deel(10, 0) gooit een exception, wortel(-1) gooit een exception`,
    starterFiles: [
      { name: "DeelDoorNulException.java", content: `public class DeelDoorNulException extends Exception {
    // TODO: constructor met een boodschap
}
` },
      { name: "NegatieveWortelException.java", content: `public class NegatieveWortelException extends Exception {
    // TODO: constructor met een boodschap
}
` },
      { name: "Rekenmachine.java", content: `public class Rekenmachine {
    // TODO: double deel(double a, double b) throws DeelDoorNulException — gooi als b == 0

    // TODO: double wortel(double x) throws NegatieveWortelException — gooi als x < 0
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [{ pattern: "extends\\s+Exception", message: "Je exceptions moeten overerven van Exception." }],
      testFile: {
        name: "VerborgenTest.java",
        content: `public class VerborgenTest {
${TEST_HELPER}
    public static void main(String[] args) {
        Rekenmachine r = new Rekenmachine();

        boolean deelGooit = false;
        double deelResultaat = 0.0;
        try { deelResultaat = r.deel(10.0, 2.0); } catch (DeelDoorNulException e) { deelGooit = true; }
        check("deel(10, 2) gooit niet", !deelGooit);
        checkNaby("deel(10, 2) = 5", 5.0, deelResultaat);

        boolean wortelGooit = false;
        double wortelResultaat = 0.0;
        try { wortelResultaat = r.wortel(9.0); } catch (NegatieveWortelException e) { wortelGooit = true; }
        check("wortel(9) gooit niet", !wortelGooit);
        checkNaby("wortel(9) = 3", 3.0, wortelResultaat);

        boolean deelNulGooit = false;
        try { r.deel(10.0, 0.0); } catch (DeelDoorNulException e) { deelNulGooit = true; }
        check("deel(10, 0) gooit DeelDoorNulException", deelNulGooit);

        boolean negWortelGooit = false;
        try { r.wortel(-1.0); } catch (NegatieveWortelException e) { negWortelGooit = true; }
        check("wortel(-1) gooit NegatieveWortelException", negWortelGooit);
        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "DeelDoorNulException.java", content: `public class DeelDoorNulException extends Exception {
    public DeelDoorNulException(String boodschap) {
        super(boodschap);
    }
}
` },
      { name: "NegatieveWortelException.java", content: `public class NegatieveWortelException extends Exception {
    public NegatieveWortelException(String boodschap) {
        super(boodschap);
    }
}
` },
      { name: "Rekenmachine.java", content: `public class Rekenmachine {
    public double deel(double a, double b) throws DeelDoorNulException {
        if (b == 0) throw new DeelDoorNulException("Je mag niet delen door nul");
        return a / b;
    }

    public double wortel(double x) throws NegatieveWortelException {
        if (x < 0) throw new NegatieveWortelException("Kan geen wortel nemen van een negatief getal");
        return Math.sqrt(x);
    }
}
` },
    ],
    relatedConcepts: ["exceptions"],
  },
];
