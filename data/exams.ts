import type { Exercise } from "@/lib/exercises";

// Zelfde test-helper als in exercises.ts / exercises-extra.ts.
const TEST_HELPER = `    static int geslaagd = 0, gefaald = 0;
    static void check(String naam, boolean ok) {
        if (ok) { geslaagd++; System.out.println("[OK]   " + naam); }
        else    { gefaald++; System.out.println("[FOUT] " + naam); }
    }
    static void klaar() {
        System.out.println();
        System.out.println(geslaagd + " geslaagd, " + gefaald + " gefaald.");
        if (gefaald == 0) System.out.println("ALLE TESTS GESLAAGD");
    }`;

export const EXAMS: Exercise[] = [
  {
    id: "kinderopvang-examen",
    chapterId: "EXAM",
    title: "Kinderopvang — synthese-examen (±2u)",
    difficulty: "insane",
    tags: ["examen", "overerving", "abstract", "exceptions", "LocalDate"],
    prompt: `**Kinderopvang — synthese-examen (±2 uur)**

Een groot oefen-examen rond **overerving, abstracte klassen, exceptions** en **datums met java.time.LocalDate**. Plan minstens 2 uur. Geen XP — puur oefenen voor het echte werk.

## Inleiding

De dienst die opvang voor kinderen verzorgt, wil van de **onthaalmoeders** en de **crèches** kunnen zien wat de leeftijd is van hun verzorgers en wanneer die in dienst traden. Deze info is interessant voor het personeelsbeleid.

Van de kindjes die opgevangen worden, wil men de leeftijd kunnen opvragen — om na te gaan of ze niet onwettig worden opgevangen:
- In een **crèche** worden peuters van **0 tot en met 2 jaar** opgevangen (kindjes van 3 jaar of ouder zijn te oud).
- Bij een **onthaalmoeder** is de maximumleeftijd **11 jaar** (kindjes van 12 jaar of ouder zijn te oud).

Schrijf de applicatie zodat ze voldoet aan de principes van **goed ontwerp**: uitbreidbaarheid, hergebruik, cohesie en lage afhankelijkheid.

## Wat moet er gebouwd worden?

### 1. Persoon (abstract)

Een **abstracte** klasse met:
- velden naam (String) en geboortedatum (LocalDate)
- constructor Persoon(String naam, LocalDate geboortedatum)
- getters getNaam() en getGeboortedatum()
- int getLeeftijd() — bereken de leeftijd in volledige jaren met Period.between(geboortedatum, LocalDate.now()).getYears()
- toString() in de vorm: naam + ", geboortedatum: " + dd-MM-yyyy

### 2. Kind extends Persoon

Een gewoon kind. Constructor Kind(String naam, LocalDate geboortedatum) die super(...) aanroept. Verder erft het alles over van Persoon.

### 3. Verzorger extends Persoon

Voeg een extra veld toe: startdatum (LocalDate).
- Constructor Verzorger(String naam, LocalDate geboortedatum, LocalDate startdatum)
- getStartdatum()
- toString() voegt aan de super-toString toe: ", start: dd-MM-yyyy"

### 4. Opvang (abstract)

Algemene basisklasse voor crèche en onthaalmoeder. Velden:
- naam (String)
- kinderen (ArrayList<Kind>) — start als lege lijst
- verzorgers (ArrayList<Verzorger>)

Constructor Opvang(String naam, ArrayList<Verzorger> verzorgers):
- bewaar alles, initialiseer kinderen als nieuwe lege ArrayList
- als het aantal verzorgers kleiner is dan het minimum dat nodig is bij opstart → gooi **OngeldigAantalInOpvangException**

Methodes:
- getNaam(), getAantalVerzorgers(), getAantalKinderen()
- void schrijfIn(Kind kind):
  1. als het kind te oud is → **OngeldigeLeeftijdKindException**
  2. als de opvang vol zit (huidig aantal >= getMaxAantalKinderen) → **OngeldigAantalInOpvangException**
  3. als er na inschrijving te weinig verzorgers zouden zijn voor het nieuwe aantal → **OngeldigAantalInOpvangException**
  4. anders: voeg het kind toe aan de lijst
- String getOverzichtKinderen() — "Overzicht van de kinderen" gevolgd door elk kind op een aparte regel
- String getOverzichtVerzorgers() — idem voor verzorgers

Template-methodes (protected abstract — de subklassen vullen deze in):
- int getMinimumVerzorgers(int aantalKinderen)
- boolean isKindTeOud(Kind kind)
- int getMaxAantalKinderen()
- int getMinimumAantalVerzorgersBijOpstart()

### 5. Creche extends Opvang

Regels:
- max **100** kinderen
- min **2** verzorgers bij opstart
- per groep van **14** kinderen is **1** verzorger nodig, maar **minimum altijd 2**
- kinderen van **3 jaar of ouder** zijn te oud

Voorbeelden van het minimum aantal verzorgers:
- 14 kinderen → 2 verzorgers
- 28 kinderen → 2 verzorgers
- 29 kinderen → 3 verzorgers (boven de 28 → Math.ceil(N / 14.0))
- 30 kinderen → 3 verzorgers

toString(): "Creche " + naam.

### 6. OnthaalMoeder extends Opvang

Regels:
- max **8** kinderen
- min **1** verzorger
- kinderen van **12 jaar of ouder** zijn te oud

toString(): "Onthaalmoeder " + naam.

### 7. Exceptions (ongecontroleerd)

Beide moeten overerven van **RuntimeException** (= ongecontroleerd / unchecked).
- OngeldigAantalInOpvangException(String boodschap) → super(boodschap)
- OngeldigeLeeftijdKindException(String boodschap) → super(boodschap)

### 8. Hoofdprogramma (main)

In de main-methode:
- Maak een crèche aan met twee verzorgers.
- Schrijf een lus die toelaat om kinderen toe te voegen. Vraag voor elk kind: naam, geboortejaar, geboortemaand, geboortedag. Voeg het kind toe.
- Bij ongeldige leeftijd, volle crèche, te weinig verzorgers of ongeldige datum: vang de exceptions op en print een **duidelijke foutboodschap**.
- De lus loopt zolang de gebruiker aangeeft nog kinderen te willen toevoegen.
- Schrijf gelijkaardige code voor een onthaalmoeder.

(De hidden tests testen de hoofdprogramma-lus niet — de focus ligt op de klasse-hiërarchie en de exception-logica. Maar de Hoofdprogramma-klasse moet wel compileren.)

## Hulp bij LocalDate

Vandaag opvragen:
- LocalDate vandaag = LocalDate.now();

Een specifieke datum maken:
- LocalDate dag = LocalDate.of(2014, 2, 24);   // jaar, maand, dag

Vergelijken (isBefore / isAfter / isEqual):
- vandaag.isAfter(LocalDate.of(2020,1,1))

Optellen en aftrekken:
- LocalDate later = vandaag.plusDays(10);
- LocalDate eerder = vandaag.minusYears(5);

Verschil berekenen (Period):
- Period p = Period.between(LocalDate.of(2020,1,1), vandaag);
- int jaren = p.getYears();
- int maanden = p.getMonths();

Formateren naar tekst:
- String tekst = vandaag.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

Ongeldige datum (bv. 31 februari) gooit een DateTimeException:
- try { LocalDate.of(2024, 2, 31); } catch (DateTimeException e) { ... }

## Aandachtspunten

- Gebruik **GEEN** package-regel — werk in de default package.
- Hou klassen klein, gebruik overerving om duplicatie te vermijden.
- De template-methodes in Opvang zijn **protected abstract** — vul ze in in elke subklasse.
- Test stap voor stap met de **Test**-knop (toont per check juist/fout, kost geen poging).
- Trek je tijd — dit examen is opgebouwd om ±2u te duren.

## Extra (niet getest, maar leerrijk)

Schrijf JUnit-testen voor Creche.constructor en .schrijfIn, voor OnthaalMoeder.constructor en .schrijfIn, en voor Kind.getLeeftijd. Dit is exact wat in een echt examen óók gevraagd wordt. Gebruik de LocalDateTest die je in de cursus terugvindt als inspiratie.`,
    example: `Crèche met 2 verzorgers, 14 kinderen toegevoegd: OK
15de tot 28e kind: nog steeds OK (2 verzorgers blijven volstaan tot 28)
29e kind met slechts 2 verzorgers: OngeldigAantalInOpvangException
Onthaalmoeder met 1 verzorger, 8 kinderen: OK
9e kind: OngeldigAantalInOpvangException ("Opvang is volzet")
Kind van 3 jaar in crèche: OngeldigeLeeftijdKindException`,
    starterFiles: [
      { name: "Persoon.java", content: `import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;

public abstract class Persoon {
    private String naam;
    private LocalDate geboortedatum;

    public Persoon(String naam, LocalDate geboortedatum) {
        // TODO: bewaar naam en geboortedatum
    }

    public String getNaam() {
        return null; // TODO
    }

    public LocalDate getGeboortedatum() {
        return null; // TODO
    }

    public int getLeeftijd() {
        // TODO: Period.between(geboortedatum, LocalDate.now()).getYears()
        return 0;
    }

    @Override
    public String toString() {
        // TODO: naam + ", geboortedatum: " + dd-MM-yyyy
        return "";
    }
}
` },
      { name: "Kind.java", content: `import java.time.LocalDate;

public class Kind extends Persoon {

    public Kind(String naam, LocalDate geboortedatum) {
        super(naam, geboortedatum);
    }
}
` },
      { name: "Verzorger.java", content: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Verzorger extends Persoon {

    // TODO: veld startdatum (LocalDate)

    public Verzorger(String naam, LocalDate geboortedatum, LocalDate startdatum) {
        super(naam, geboortedatum);
        // TODO: bewaar startdatum
    }

    public LocalDate getStartdatum() {
        return null; // TODO
    }

    @Override
    public String toString() {
        // TODO: super.toString() + ", start: dd-MM-yyyy"
        return super.toString();
    }
}
` },
      { name: "Opvang.java", content: `import java.util.ArrayList;

public abstract class Opvang {
    private String naam;
    private ArrayList<Kind> kinderen;
    private ArrayList<Verzorger> verzorgers;

    public Opvang(String naam, ArrayList<Verzorger> verzorgers) {
        // TODO: bewaar naam, init kinderen als nieuwe lege ArrayList, bewaar verzorgers
        // TODO: gooi OngeldigAantalInOpvangException als er te weinig verzorgers zijn
    }

    public String getNaam() {
        return null; // TODO
    }

    public int getAantalVerzorgers() {
        return 0; // TODO
    }

    public int getAantalKinderen() {
        return 0; // TODO
    }

    public void schrijfIn(Kind kind) {
        // TODO:
        // 1) isKindTeOud(kind) → OngeldigeLeeftijdKindException
        // 2) huidig >= getMaxAantalKinderen() → OngeldigAantalInOpvangException
        // 3) getAantalVerzorgers() < getMinimumVerzorgers(huidig + 1) → OngeldigAantalInOpvangException
        // 4) anders: voeg toe
    }

    public String getOverzichtKinderen() {
        return ""; // TODO: "Overzicht van de kinderen" + elke kind op nieuwe regel
    }

    public String getOverzichtVerzorgers() {
        return ""; // TODO: "Overzicht van de verzorgers" + elke verzorger op nieuwe regel
    }

    // Template-methodes — vul ze in in Creche en OnthaalMoeder
    protected abstract int getMinimumVerzorgers(int aantalKinderen);
    protected abstract boolean isKindTeOud(Kind kind);
    protected abstract int getMaxAantalKinderen();
    protected abstract int getMinimumAantalVerzorgersBijOpstart();
}
` },
      { name: "Creche.java", content: `import java.util.ArrayList;

public class Creche extends Opvang {

    public Creche(String naam, ArrayList<Verzorger> verzorgers) {
        super(naam, verzorgers);
    }

    @Override
    protected int getMaxAantalKinderen() {
        return 0; // TODO: 100
    }

    @Override
    protected int getMinimumAantalVerzorgersBijOpstart() {
        return 0; // TODO: 2
    }

    @Override
    protected int getMinimumVerzorgers(int aantalKinderen) {
        // TODO: 2 als aantal <= 28, anders (int) Math.ceil(aantal / 14.0)
        return 0;
    }

    @Override
    protected boolean isKindTeOud(Kind kind) {
        return false; // TODO: kind.getLeeftijd() >= 3 ?
    }

    @Override
    public String toString() {
        return ""; // TODO: "Creche " + naam
    }
}
` },
      { name: "OnthaalMoeder.java", content: `import java.util.ArrayList;

public class OnthaalMoeder extends Opvang {

    public OnthaalMoeder(String naam, ArrayList<Verzorger> verzorgers) {
        super(naam, verzorgers);
    }

    @Override
    protected int getMaxAantalKinderen() {
        return 0; // TODO: 8
    }

    @Override
    protected int getMinimumAantalVerzorgersBijOpstart() {
        return 0; // TODO: 1
    }

    @Override
    protected int getMinimumVerzorgers(int aantalKinderen) {
        return 0; // TODO: 1
    }

    @Override
    protected boolean isKindTeOud(Kind kind) {
        return false; // TODO: kind.getLeeftijd() >= 12 ?
    }

    @Override
    public String toString() {
        return ""; // TODO: "Onthaalmoeder " + naam
    }
}
` },
      { name: "OngeldigAantalInOpvangException.java", content: `public class OngeldigAantalInOpvangException extends RuntimeException {

    public OngeldigAantalInOpvangException(String boodschap) {
        super(boodschap);
    }
}
` },
      { name: "OngeldigeLeeftijdKindException.java", content: `public class OngeldigeLeeftijdKindException extends RuntimeException {

    public OngeldigeLeeftijdKindException(String boodschap) {
        super(boodschap);
    }
}
` },
      { name: "Hoofdprogramma.java", content: `import java.util.ArrayList;
import java.util.Scanner;
import java.time.LocalDate;
import java.time.DateTimeException;

public class Hoofdprogramma {

    public static void main(String[] args) {
        // TODO:
        // 1) Maak een Creche met 2 verzorgers.
        // 2) Lus: vraag naam, jaar, maand, dag en voeg kind toe.
        //    Vang OngeldigeLeeftijdKindException + OngeldigAantalInOpvangException + DateTimeException op
        //    en print een duidelijke foutboodschap.
        //    Lus stopt wanneer de gebruiker stopt.
        // 3) Idem voor een OnthaalMoeder.
    }
}
` },
    ],
    grading: {
      type: "tests",
      staticChecks: [
        { pattern: "abstract\\s+class\\s+Persoon", message: "Persoon moet een abstracte klasse zijn." },
        { pattern: "abstract\\s+class\\s+Opvang", message: "Opvang moet een abstracte klasse zijn." },
        { pattern: "class\\s+Kind\\s+extends\\s+Persoon", message: "Kind moet overerven van Persoon." },
        { pattern: "class\\s+Verzorger\\s+extends\\s+Persoon", message: "Verzorger moet overerven van Persoon." },
        { pattern: "class\\s+Creche\\s+extends\\s+Opvang", message: "Creche moet overerven van Opvang." },
        { pattern: "class\\s+OnthaalMoeder\\s+extends\\s+Opvang", message: "OnthaalMoeder moet overerven van Opvang." },
        { pattern: "OngeldigAantalInOpvangException\\s+extends\\s+RuntimeException", message: "OngeldigAantalInOpvangException moet overerven van RuntimeException (ongecontroleerd)." },
        { pattern: "OngeldigeLeeftijdKindException\\s+extends\\s+RuntimeException", message: "OngeldigeLeeftijdKindException moet overerven van RuntimeException (ongecontroleerd)." },
      ],
      testFile: {
        name: "VerborgenTest.java",
        content: `import java.time.LocalDate;
import java.util.ArrayList;
import java.lang.reflect.Modifier;

public class VerborgenTest {
${TEST_HELPER}

    public static void main(String[] args) {
        // ── Structuur ──
        check("Persoon is abstract", Modifier.isAbstract(Persoon.class.getModifiers()));
        check("Opvang is abstract", Modifier.isAbstract(Opvang.class.getModifiers()));
        check("OngeldigAantalInOpvangException extends RuntimeException",
                RuntimeException.class.isAssignableFrom(OngeldigAantalInOpvangException.class));
        check("OngeldigeLeeftijdKindException extends RuntimeException",
                RuntimeException.class.isAssignableFrom(OngeldigeLeeftijdKindException.class));

        // ── Kind + Persoon getLeeftijd ──
        Kind kind5 = new Kind("Sam", LocalDate.now().minusYears(5));
        check("Kind getNaam", "Sam".equals(kind5.getNaam()));
        check("Kind getGeboortedatum niet null", kind5.getGeboortedatum() != null);
        check("Kind 5 jaar oud", kind5.getLeeftijd() == 5);

        Kind kind2 = new Kind("Anna", LocalDate.now().minusYears(2));
        check("Kind 2 jaar oud", kind2.getLeeftijd() == 2);

        // ── Verzorger ──
        Verzorger vTest = new Verzorger("Lisa", LocalDate.of(1985, 5, 15), LocalDate.of(2020, 9, 1));
        check("Verzorger getNaam", "Lisa".equals(vTest.getNaam()));
        check("Verzorger getStartdatum", LocalDate.of(2020, 9, 1).equals(vTest.getStartdatum()));
        String vStr = vTest.toString();
        check("Verzorger toString bevat naam", vStr.contains("Lisa"));
        check("Verzorger toString bevat geboortedatum (dd-MM-yyyy)", vStr.contains("15-05-1985"));
        check("Verzorger toString bevat startdatum (dd-MM-yyyy)", vStr.contains("01-09-2020"));

        // ── Creche: 1 verzorger gooit ──
        ArrayList<Verzorger> v1Lst = new ArrayList<Verzorger>();
        v1Lst.add(new Verzorger("V1", LocalDate.of(1990,1,1), LocalDate.of(2020,1,1)));
        boolean creche1 = false;
        try { new Creche("Te weinig", v1Lst); }
        catch (OngeldigAantalInOpvangException e) { creche1 = true; }
        check("Creche met 1 verzorger gooit OngeldigAantalInOpvangException", creche1);

        // ── Creche met 2 verzorgers OK ──
        ArrayList<Verzorger> v2Lst = new ArrayList<Verzorger>();
        v2Lst.add(new Verzorger("V1", LocalDate.of(1990,1,1), LocalDate.of(2020,1,1)));
        v2Lst.add(new Verzorger("V2", LocalDate.of(1991,1,1), LocalDate.of(2021,1,1)));
        Creche creche = new Creche("Zonnebloem", v2Lst);
        check("Creche getNaam", "Zonnebloem".equals(creche.getNaam()));
        check("Creche 2 verzorgers", creche.getAantalVerzorgers() == 2);
        check("Creche start met 0 kinderen", creche.getAantalKinderen() == 0);

        // ── Jong kind toevoegen ──
        creche.schrijfIn(new Kind("Bob", LocalDate.now().minusYears(1)));
        check("Na inschrijving 1 kind", creche.getAantalKinderen() == 1);

        // ── 3-jarig kind te oud voor crèche ──
        boolean cTeOud = false;
        try { creche.schrijfIn(new Kind("Te oud", LocalDate.now().minusYears(3))); }
        catch (OngeldigeLeeftijdKindException e) { cTeOud = true; }
        check("Creche kind 3 jaar → OngeldigeLeeftijdKindException", cTeOud);

        // ── Vul aan tot 28 (de max met 2 verzorgers) ──
        for (int i = 1; i < 28; i++) {
            creche.schrijfIn(new Kind("K" + i, LocalDate.now().minusYears(1)));
        }
        check("Creche 28 kinderen totaal", creche.getAantalKinderen() == 28);

        // ── 29ste kind: met slechts 2 verzorgers → exception ──
        boolean cRatio = false;
        try { creche.schrijfIn(new Kind("K29", LocalDate.now().minusYears(1))); }
        catch (OngeldigAantalInOpvangException e) { cRatio = true; }
        check("29ste kind met 2 verzorgers → OngeldigAantalInOpvangException", cRatio);

        // ── Overzichten ──
        String ovk = creche.getOverzichtKinderen();
        check("getOverzichtKinderen bevat Bob", ovk.contains("Bob"));
        String ovv = creche.getOverzichtVerzorgers();
        check("getOverzichtVerzorgers bevat V1", ovv.contains("V1"));

        // ── OnthaalMoeder met 0 verzorgers gooit ──
        boolean om0 = false;
        try { new OnthaalMoeder("Leeg", new ArrayList<Verzorger>()); }
        catch (OngeldigAantalInOpvangException e) { om0 = true; }
        check("OnthaalMoeder met 0 verzorgers gooit", om0);

        // ── OnthaalMoeder met 1 verzorger OK ──
        ArrayList<Verzorger> omV = new ArrayList<Verzorger>();
        omV.add(new Verzorger("Tante M", LocalDate.of(1980,1,1), LocalDate.of(2010,1,1)));
        OnthaalMoeder om = new OnthaalMoeder("Mia", omV);
        check("OnthaalMoeder getNaam", "Mia".equals(om.getNaam()));
        check("OnthaalMoeder 1 verzorger", om.getAantalVerzorgers() == 1);

        // ── 11-jarig kind OK ──
        om.schrijfIn(new Kind("Tim", LocalDate.now().minusYears(11)));
        check("11-jarig kind OK bij OM", om.getAantalKinderen() == 1);

        // ── 12-jarig kind te oud ──
        boolean om12 = false;
        try { om.schrijfIn(new Kind("Te oud", LocalDate.now().minusYears(12))); }
        catch (OngeldigeLeeftijdKindException e) { om12 = true; }
        check("12-jarig kind te oud voor OM", om12);

        // ── Vul OM tot 8 ──
        for (int i = 1; i < 8; i++) {
            om.schrijfIn(new Kind("K" + i, LocalDate.now().minusYears(2)));
        }
        check("OnthaalMoeder 8 kinderen totaal", om.getAantalKinderen() == 8);

        // ── 9de kind → vol ──
        boolean omVol = false;
        try { om.schrijfIn(new Kind("K9", LocalDate.now().minusYears(2))); }
        catch (OngeldigAantalInOpvangException e) { omVol = true; }
        check("9de kind bij OM → OngeldigAantalInOpvangException", omVol);

        klaar();
    }
}
`,
      },
    },
    solutionFiles: [
      { name: "Persoon.java", content: `import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;

public abstract class Persoon {
    private String naam;
    private LocalDate geboortedatum;

    public Persoon(String naam, LocalDate geboortedatum) {
        this.naam = naam;
        this.geboortedatum = geboortedatum;
    }

    public String getNaam() { return naam; }
    public LocalDate getGeboortedatum() { return geboortedatum; }

    public int getLeeftijd() {
        return Period.between(geboortedatum, LocalDate.now()).getYears();
    }

    @Override
    public String toString() {
        return naam + ", geboortedatum: " + geboortedatum.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
    }
}
` },
      { name: "Kind.java", content: `import java.time.LocalDate;

public class Kind extends Persoon {
    public Kind(String naam, LocalDate geboortedatum) {
        super(naam, geboortedatum);
    }
}
` },
      { name: "Verzorger.java", content: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Verzorger extends Persoon {
    private LocalDate startdatum;

    public Verzorger(String naam, LocalDate geboortedatum, LocalDate startdatum) {
        super(naam, geboortedatum);
        this.startdatum = startdatum;
    }

    public LocalDate getStartdatum() { return startdatum; }

    @Override
    public String toString() {
        return super.toString() + ", start: " + startdatum.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
    }
}
` },
      { name: "Opvang.java", content: `import java.util.ArrayList;

public abstract class Opvang {
    private String naam;
    private ArrayList<Kind> kinderen;
    private ArrayList<Verzorger> verzorgers;

    public Opvang(String naam, ArrayList<Verzorger> verzorgers) {
        this.naam = naam;
        this.kinderen = new ArrayList<Kind>();
        this.verzorgers = verzorgers;

        if (getAantalVerzorgers() < getMinimumAantalVerzorgersBijOpstart()) {
            throw new OngeldigAantalInOpvangException("Te weinig verzorgers om de opvang te starten.");
        }
    }

    public String getNaam() { return naam; }
    public int getAantalVerzorgers() { return verzorgers.size(); }
    public int getAantalKinderen() { return kinderen.size(); }

    public void schrijfIn(Kind kind) {
        if (kind == null) return;
        if (isKindTeOud(kind)) {
            throw new OngeldigeLeeftijdKindException("Kind te oud om opgevangen te worden.");
        }
        int huidig = getAantalKinderen();
        if (huidig >= getMaxAantalKinderen()) {
            throw new OngeldigAantalInOpvangException("Opvang is volzet.");
        }
        if (getAantalVerzorgers() < getMinimumVerzorgers(huidig + 1)) {
            throw new OngeldigAantalInOpvangException("Te weinig verzorgers voor " + (huidig + 1) + " kinderen.");
        }
        kinderen.add(kind);
    }

    public String getOverzichtKinderen() {
        String s = "Overzicht van de kinderen\\n";
        for (Kind k : kinderen) s += k + "\\n";
        return s;
    }

    public String getOverzichtVerzorgers() {
        String s = "Overzicht van de verzorgers\\n";
        for (Verzorger v : verzorgers) s += v + "\\n";
        return s;
    }

    protected abstract int getMinimumVerzorgers(int aantalKinderen);
    protected abstract boolean isKindTeOud(Kind kind);
    protected abstract int getMaxAantalKinderen();
    protected abstract int getMinimumAantalVerzorgersBijOpstart();
}
` },
      { name: "Creche.java", content: `import java.util.ArrayList;

public class Creche extends Opvang {

    public Creche(String naam, ArrayList<Verzorger> verzorgers) {
        super(naam, verzorgers);
    }

    @Override
    protected int getMaxAantalKinderen() { return 100; }

    @Override
    protected int getMinimumAantalVerzorgersBijOpstart() { return 2; }

    @Override
    protected int getMinimumVerzorgers(int aantalKinderen) {
        if (aantalKinderen <= 28) return 2;
        return (int) Math.ceil(aantalKinderen / 14.0);
    }

    @Override
    protected boolean isKindTeOud(Kind kind) {
        return kind.getLeeftijd() >= 3;
    }

    @Override
    public String toString() { return "Creche " + getNaam(); }
}
` },
      { name: "OnthaalMoeder.java", content: `import java.util.ArrayList;

public class OnthaalMoeder extends Opvang {

    public OnthaalMoeder(String naam, ArrayList<Verzorger> verzorgers) {
        super(naam, verzorgers);
    }

    @Override
    protected int getMaxAantalKinderen() { return 8; }

    @Override
    protected int getMinimumAantalVerzorgersBijOpstart() { return 1; }

    @Override
    protected int getMinimumVerzorgers(int aantalKinderen) { return 1; }

    @Override
    protected boolean isKindTeOud(Kind kind) {
        return kind.getLeeftijd() >= 12;
    }

    @Override
    public String toString() { return "Onthaalmoeder " + getNaam(); }
}
` },
      { name: "OngeldigAantalInOpvangException.java", content: `public class OngeldigAantalInOpvangException extends RuntimeException {

    public OngeldigAantalInOpvangException(String boodschap) {
        super(boodschap);
    }
}
` },
      { name: "OngeldigeLeeftijdKindException.java", content: `public class OngeldigeLeeftijdKindException extends RuntimeException {

    public OngeldigeLeeftijdKindException(String boodschap) {
        super(boodschap);
    }
}
` },
      { name: "Hoofdprogramma.java", content: `import java.util.ArrayList;
import java.util.Scanner;
import java.time.LocalDate;
import java.time.DateTimeException;

public class Hoofdprogramma {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        ArrayList<Verzorger> cV = new ArrayList<Verzorger>();
        cV.add(new Verzorger("V1", LocalDate.of(1990,1,1), LocalDate.of(2020,1,1)));
        cV.add(new Verzorger("V2", LocalDate.of(1992,1,1), LocalDate.of(2021,1,1)));
        Creche creche = new Creche("Zonnebloem", cV);

        boolean doorgaan = true;
        while (doorgaan) {
            System.out.print("Naam kind (of 'stop'): ");
            String naam = sc.nextLine();
            if (naam == null || naam.equalsIgnoreCase("stop")) { doorgaan = false; break; }
            try {
                System.out.print("Geboortejaar: ");  int j = Integer.parseInt(sc.nextLine());
                System.out.print("Geboortemaand: "); int m = Integer.parseInt(sc.nextLine());
                System.out.print("Geboortedag: ");   int d = Integer.parseInt(sc.nextLine());
                creche.schrijfIn(new Kind(naam, LocalDate.of(j, m, d)));
                System.out.println("Kind " + naam + " is ingeschreven.");
            } catch (DateTimeException | NumberFormatException e) {
                System.out.println("Ongeldige datum: " + e.getMessage());
            } catch (OngeldigeLeeftijdKindException | OngeldigAantalInOpvangException e) {
                System.out.println("Niet ingeschreven: " + e.getMessage());
            }
        }
        System.out.println();
        System.out.println(creche.getOverzichtKinderen());

        ArrayList<Verzorger> oV = new ArrayList<Verzorger>();
        oV.add(new Verzorger("Tante M", LocalDate.of(1980,1,1), LocalDate.of(2010,1,1)));
        OnthaalMoeder om = new OnthaalMoeder("Mia", oV);
        System.out.println(om);
        sc.close();
    }
}
` },
    ],
    relatedConcepts: ["abstract class", "overerving", "exceptions", "LocalDate", "Period", "polymorfisme"],
  },
];
