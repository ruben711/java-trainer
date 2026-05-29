import Link from "next/link";

// Syntax-token helpers (One Dark-achtige accenten)
const K = ({ children }: { children: React.ReactNode }) => (
  <span className="text-insane">{children}</span>
); // keyword
const T = ({ children }: { children: React.ReactNode }) => (
  <span className="text-accent-2">{children}</span>
); // type
const S = ({ children }: { children: React.ReactNode }) => (
  <span className="text-easy">{children}</span>
); // string

function Dot({ className }: { className: string }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${className}`} />;
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1fr_1.2fr] lg:py-20">
        <div className="animate-fade-in">
          <span className="eyebrow">// java practice · in je browser</span>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] md:text-[2.9rem]">
            Schrijf, compileer en run{" "}
            <span className="text-accent">échte Java</span> — als in een IDE.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            Een multi-file mini-IDE met file tree, syntax-highlighting en een
            verborgen test-runner. Los oefeningen op, verdien XP en klim op het
            leaderboard.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Link href="/oefeningen" className="btn-primary">
              Start met oefenen
            </Link>
            <Link href="/sandbox" className="btn-secondary">
              Open de sandbox
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] text-faint">
            <span className="flex items-center gap-1.5">
              <Dot className="bg-easy" /> 20 oefeningen
            </span>
            <span>7 hoofdstukken</span>
            <span>multi-class projecten</span>
          </div>
        </div>

        <EditorMock />
      </section>

      <section className="grid gap-3 pb-20 sm:grid-cols-3">
        <FeaturePanel
          label="MULTI-FILE"
          title="Echte projecten"
          body="Maak klassen, interfaces en packages in een file tree — meerdere bestanden per oefening, net als in IntelliJ."
        />
        <FeaturePanel
          label="RUN"
          title="Compileer & run"
          body="Je code draait server-side. Output, compile-fouten en exit-code zie je meteen in een terminal-paneel."
        />
        <FeaturePanel
          label="PROGRESS"
          title="XP & leaderboard"
          body="Verdien XP per opgeloste oefening, ontgrendel glanzende tags en klim op het klassement."
        />
      </section>
    </div>
  );
}

function EditorMock() {
  const lines: React.ReactNode[] = [
    <>
      <K>public</K> <K>interface</K> <T>Dier</T>
      {" {"}
    </>,
    <>
      {"    "}
      <T>String</T> maakGeluid();
    </>,
    <>{"}"}</>,
    <>{" "}</>,
    <>
      <K>public</K> <K>class</K> <T>Hond</T> <K>implements</K> <T>Dier</T>
      {" {"}
    </>,
    <>
      {"    "}
      <K>public</K> <T>String</T> maakGeluid() {"{"}
    </>,
    <>
      {"        "}
      <K>return</K> <S>&quot;Woef&quot;</S>;
    </>,
    <>{"    }"}</>,
    <>{"}"}</>,
  ];
  return (
    <div className="animate-fade-in overflow-hidden rounded-lg border border-border bg-surface shadow-panel">
      {/* titlebar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
        <span className="flex gap-1.5">
          <Dot className="bg-hard/70" />
          <Dot className="bg-medium/70" />
          <Dot className="bg-easy/70" />
        </span>
        <span className="ml-1 font-mono text-[11px] text-faint">
          Dierentuin · java-trainer
        </span>
      </div>
      {/* tab bar */}
      <div className="flex border-b border-border bg-bg/40 font-mono text-[12px]">
        <span className="border-r border-border bg-surface px-3 py-1.5 text-text">
          Dier.java
        </span>
        <span className="border-r border-border px-3 py-1.5 text-faint">
          Hond.java
        </span>
        <span className="border-r border-border px-3 py-1.5 text-faint">
          Main.java
        </span>
      </div>
      {/* editor + gutter */}
      <div className="flex font-mono text-[12.5px] leading-[1.65]">
        <div className="select-none border-r border-border px-3 py-3 text-right text-faint">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 overflow-x-auto py-3 pl-3 pr-4 text-text">
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </pre>
      </div>
      {/* status bar */}
      <div className="flex items-center justify-between border-t border-border bg-surface-2 px-3 py-1.5 font-mono text-[11px] text-faint">
        <span className="flex items-center gap-1.5">
          <Dot className="bg-easy" /> klaar
        </span>
        <span>
          Woef · Miauw <span className="text-easy">exit 0</span> · 0.42s
        </span>
      </div>
    </div>
  );
}

function FeaturePanel({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-4 transition-colors hover:border-border-strong">
      <span className="eyebrow text-accent/80">{label}</span>
      <h3 className="mt-1.5 text-[15px] font-semibold">{title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
