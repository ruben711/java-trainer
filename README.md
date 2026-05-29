# ☕ Java Trainer

Interactief oefenplatform voor **Java**, met een multi-file mini-IDE in de
browser, server-side code-uitvoering, XP/levels/badges en (later) een
leaderboard. Warm "koffie/Java"-thema, volledig Nederlandstalige UI.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** met CSS-variabele theme-tokens (light + dark)
- **Zustand + persist** (XP, voortgang, file-trees per oefening — localStorage)
- **Monaco Editor** (`@monaco-editor/react`) met multi-model Java
- Server-side **code-execution** via een pluggable backend-adapter
- **Upstash Redis** (optioneel) voor leaderboard/sessies/notificaties

## Snel starten

```bash
npm install
cp .env.example .env.local   # pas waarden aan indien nodig
npm run dev                  # http://localhost:3000
```

Standaard draait dev met `EXEC_BACKEND=wandbox` (zie `.env.local`), zodat de
code-uitvoering **zonder setup** werkt. Voor productie kies je Piston (zie
hieronder).

## Code-execution backend (`EXEC_BACKEND`)

Java is gecompileerd en kan niet in de browser draaien (zoals sql.js voor SQL).
Daarom stuurt de frontend alle bestanden naar onze eigen route `POST /api/run`,
die ze doorstuurt naar de gekozen backend. De backend is volledig omschakelbaar
via één env-var — zo zit je nooit vast aan één provider.

| `EXEC_BACKEND` | Setup | Opmerking |
| --- | --- | --- |
| `judge0` | **Geen server — enkel een key** | **Aanrader (plug & play), ook op Vercel.** Managed API. Zonder key → gratis `ce.judge0.com`. Met RapidAPI-key → betrouwbaar. |
| `piston` | Docker (VPS) | Zelf-gehost = geen limieten, snel, volledige controle. Vraagt wel een VPS (zie onder). |
| `wandbox` | Geen | Gratis publieke dienst (OpenJDK 21/22). Handig als snelle dev-fallback. Fair-use: kan traag/rate-limited zijn. |

> ⚠️ De **publieke Piston** (`emkc.org`) is sinds **15-02-2026 whitelist-only**.
> Daarom is de standaard nu **Judge0** (managed, plug & play). Piston blijft een
> optie als je zelf hostt; Wandbox is de no-setup dev-fallback.

### Plug & play: Judge0 (aanrader, werkt op Vercel) ⭐

Geen server, geen Docker — je plakt één API-key. Multi-file Java wordt automatisch
samengevoegd tot één bron door de adapter, dus jij hoeft niets te doen.

1. Maak een gratis account op [RapidAPI](https://rapidapi.com).
2. Abonneer (gratis tier) op **"Judge0 CE"** → kopieer je `X-RapidAPI-Key`.
3. Zet in **Vercel → Settings → Environment Variables** (of in `.env.local`):

```
EXEC_BACKEND=judge0
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_KEY=<jouw X-RapidAPI-Key>
JUDGE0_LANGUAGE_ID=62          # 62 = OpenJDK 13 (overal aanwezig)
```

4. Redeploy. Klaar — geen server om te beheren.

> Zonder `JUDGE0_KEY` valt hij terug op de gratis publieke instantie
> `ce.judge0.com` (handig om te testen, maar gedeeld → kan traag/gelimiteerd zijn).
> De gratis RapidAPI-tier (~50 runs/dag) volstaat om te starten; loop je daar
> tegenaan, dan upgrade je het RapidAPI-plan met een paar clicks (nog steeds
> geen server). Wil je onbeperkt + gratis runs? Host dan Piston zelf (hieronder).

### Zelf Piston hosten (productie)

```bash
# 1. Start de Piston API-container
#    (--privileged is meestal nodig voor de isolate-sandbox)
docker run -d --name piston_api --privileged -p 2000:2000 \
  ghcr.io/engineer-man/piston

# 2. Installeer de Java-runtime in Piston (eenmalig)
curl -X POST http://localhost:2000/api/v2/packages \
  -H "content-type: application/json" \
  -d '{"language":"java","version":"15.0.2"}'

# 3. Controleer de geïnstalleerde runtimes
curl http://localhost:2000/api/v2/runtimes
```

Zet daarna in `.env.local`:

```
EXEC_BACKEND=piston
PISTON_URL=http://localhost:2000/api/v2/execute   # let op: GEEN /piston/ segment
PISTON_JAVA_VERSION=15.0.2                          # of * voor de laatste
```

### Alternatief: app op Vercel + Piston op een VPS (onbeperkt + gratis runs)

Wil je geen managed API maar onbeperkte, gratis runs? Vercel is serverless en kan
Piston niet zelf draaien, dus zet je de app op **Vercel** + Piston op een kleine
**VPS** (€4-6/mnd), afgeschermd met een token. Iets meer setup dan Judge0, maar
geen limieten. Voor ~10 gebruikers ruim voldoende.

Een turnkey setup staat in [`deploy/`](deploy/) (Piston + Caddy voor gratis HTTPS
en token-controle):

```bash
# Op de VPS (Docker geïnstalleerd):
git clone <repo> && cd <repo>/deploy
cp .env.example .env          # vul PISTON_DOMAIN + PISTON_AUTH in
docker compose up -d
# Eenmalig de Java-runtime installeren:
curl -X POST http://127.0.0.1:2000/api/v2/packages \
  -H "content-type: application/json" -d '{"language":"java","version":"15.0.2"}'
```

Wijs vooraf een subdomein (bv. `piston.jouwsite.be`) via een A-record naar de VPS.
Caddy regelt automatisch HTTPS en laat enkel verzoeken met het juiste token door.

Zet daarna in **Vercel → Settings → Environment Variables**:

```
EXEC_BACKEND=piston
PISTON_URL=https://piston.jouwsite.be/api/v2/execute
PISTON_AUTH=<hetzelfde token als in deploy/.env>
PISTON_JAVA_VERSION=15.0.2
```

> Draait de app óók op die VPS (i.p.v. Vercel)? Dan kan Piston op `127.0.0.1`
> blijven, laat je `PISTON_AUTH` leeg en gebruik je `PISTON_URL=http://127.0.0.1:2000/api/v2/execute`
> — geen publieke poort, geen token nodig.

## Veiligheid

- Piston/Judge0 sandboxen zelf (containers met resource-limieten).
- `/api/run` voegt toe: **max 1 uitvoering per 20s per gebruiker/sessie**
  (beschermt je Judge0-quota; instelbaar via `RUN_COOLDOWN_MS`, valt terug op IP
  als er geen sessie is, en is robuust via Upstash op serverless), **max
  payload-grootte**, **max aantal bestanden** en een **harde timeout**.

## Environment variables

Zie [`.env.example`](.env.example). Alles behalve `EXEC_BACKEND`/`PISTON_URL`
is optioneel — zonder Upstash/Discord draait de app gewoon door (die features
worden dan no-op).

## Projectstructuur (kort)

```
app/            routes (dashboard, sandbox, oefeningen, …) + api/run
components/     CodeEditor, FileTree, FileTabs, OutputPanel, JavaIde, nav, …
lib/            store (zustand), exec-adapters (piston/wandbox/judge0),
                javaFiles (skeletons), xp, badges, identity, theme
styles/         globals.css (koffie/Java theme via CSS-variabelen)
```

## Status

- ✅ Scaffold, koffie/Java-theming, navigatie, dashboard
- ✅ Mini-IDE (file tree + Monaco multi-file + `/api/run`) — getest end-to-end
- ⏳ Grading (output-match + verborgen test-harness)
- ⏳ Oefeningen + XP + opslaan, Theorie, Examen
- ⏳ Leaderboard / admin / notificaties (Upstash)
