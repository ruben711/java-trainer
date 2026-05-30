"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface ParsedField {
  name: string;
  type: string;
}

interface GenerateMenuProps {
  open: boolean;
  fileContent: string;
  onClose: () => void;
  onInsert: (code: string, imports?: string[]) => void;
}

type GenType = "constructor" | "getters" | "setters" | "all" | "equalsHashCode" | "toString";

const GEN_OPTIONS: { id: GenType; label: string; hint: string }[] = [
  { id: "constructor", label: "Constructor", hint: "public ClassName(…) { this.x = x; }" },
  { id: "getters", label: "Getters", hint: "public Type getX() { return x; }" },
  { id: "setters", label: "Setters", hint: "public void setX(Type x) { this.x = x; }" },
  { id: "all", label: "Constructor + getters + setters", hint: "alles in één keer" },
  { id: "equalsHashCode", label: "equals() en hashCode()", hint: "Objects.equals / Objects.hash" },
  { id: "toString", label: "toString()", hint: '"ClassName{x=…, y=…}"' },
];

export default function GenerateMenu({ open, fileContent, onClose, onInsert }: GenerateMenuProps) {
  const className = useMemo(() => parseClassName(fileContent), [fileContent]);
  const fields = useMemo(() => parseFields(fileContent), [fileContent]);

  const [genType, setGenType] = useState<GenType>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const generateBtnRef = useRef<HTMLButtonElement>(null);

  // Reset selectie wanneer de modal opent (alle velden aanvinken).
  useEffect(() => {
    if (!open) return;
    setSelected(new Set(fields.map((f) => f.name)));
    setGenType("all");
    setTimeout(() => generateBtnRef.current?.focus(), 0);
  }, [open, fields]);

  // Escape sluit, Ctrl/Cmd+Enter genereert.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        generateBtnRef.current?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const fieldsToUse = fields.filter((f) => selected.has(f.name));
  // Getters/setters/all hebben velden nodig; constructor/equalsHashCode/toString
  // werken ook met 0 velden (trivial implementaties).
  const needsFields = genType === "getters" || genType === "setters" || genType === "all";
  const disabled = needsFields && fieldsToUse.length === 0;

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === fields.length) setSelected(new Set());
    else setSelected(new Set(fields.map((f) => f.name)));
  }

  function handleGenerate() {
    const parts: string[] = [];
    const imports: string[] = [];
    if (genType === "constructor" || genType === "all") parts.push(genConstructor(className, fieldsToUse));
    if (genType === "getters" || genType === "all") parts.push(...fieldsToUse.map(genGetter));
    if (genType === "setters" || genType === "all") parts.push(...fieldsToUse.map(genSetter));
    if (genType === "toString") parts.push(genToString(className, fieldsToUse));
    if (genType === "equalsHashCode") {
      parts.push(genEquals(className, fieldsToUse));
      parts.push(genHashCode(fieldsToUse));
      // hashCode gebruikt altijd Objects.hash → importeren
      imports.push("java.util.Objects");
      if (fieldsToUse.some((f) => f.type.endsWith("[]"))) {
        imports.push("java.util.Arrays");
      }
    }
    if (parts.length === 0) {
      onClose();
      return;
    }
    onInsert("\n" + parts.join("\n"), [...new Set(imports)]);
    onClose();
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col overflow-hidden rounded-md border border-border-strong bg-surface shadow-panel"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h2 className="eyebrow text-[12px] normal-case tracking-normal text-text">
            Genereer code
            <span className="ml-2 font-mono text-faint">{className}</span>
          </h2>
          <button onClick={onClose} className="btn-ghost h-8 !px-2" aria-label="Sluiten">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4">
          {/* Wat genereren? */}
          <div>
            <p className="eyebrow mb-1.5 text-[10px]">Wat genereren?</p>
            <div className="flex flex-col gap-1">
              {GEN_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGenType(opt.id)}
                  className={`flex items-center justify-between rounded-[5px] border px-2.5 py-1.5 text-left text-xs transition-colors ${
                    genType === opt.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted hover:border-border-strong hover:text-text"
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="font-mono text-[10px] text-faint">{opt.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Velden */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="eyebrow text-[10px]">
                Velden ({fieldsToUse.length}/{fields.length})
              </p>
              {fields.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="font-mono text-[10px] text-muted hover:text-accent"
                >
                  {selected.size === fields.length ? "alles uit" : "alles aan"}
                </button>
              )}
            </div>
            <div className="max-h-44 overflow-y-auto rounded-[5px] border border-border bg-surface-2">
              {fields.length === 0 ? (
                <p className="px-3 py-2 text-xs italic text-faint">
                  Geen private velden gevonden in dit bestand.
                </p>
              ) : (
                fields.map((f) => (
                  <label
                    key={f.name}
                    className="flex cursor-pointer items-center gap-2 border-b border-border/60 px-3 py-1.5 text-xs last:border-0 hover:bg-surface-3"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(f.name)}
                      onChange={() => toggle(f.name)}
                      className="h-3 w-3 accent-accent"
                    />
                    <span className="font-mono text-accent-2">{f.type}</span>
                    <span className="font-mono text-text">{f.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Acties */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <span className="mr-auto font-mono text-[10px] text-faint">Esc · annuleer · Ctrl ↵ · genereer</span>
            <button onClick={onClose} className="btn-ghost h-8 text-xs">
              Annuleren
            </button>
            <button
              ref={generateBtnRef}
              onClick={handleGenerate}
              disabled={disabled}
              className="btn-primary h-8 text-xs disabled:opacity-50"
            >
              Genereer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Java-parsing en code-generatie ─────────────────────────────────

function stripForParsing(content: string): string {
  // Vervang commentaar en string-literals door spaties van dezelfde lengte
  // zodat posities behouden blijven.
  return content
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/"(?:\\.|[^"\\])*"/g, (m) => " ".repeat(m.length));
}

function parseClassName(content: string): string {
  const cleaned = stripForParsing(content);
  const m = cleaned.match(
    /\b(?:public\s+)?(?:abstract\s+|final\s+|static\s+)*(?:class|enum|interface|record)\s+(\w+)/,
  );
  return m ? m[1] : "Klasse";
}

function parseFields(content: string): ParsedField[] {
  const cleaned = stripForParsing(content);
  const fields: ParsedField[] = [];
  const seen = new Set<string>();
  // private/protected, optioneel final/transient/volatile, geen static,
  // type (met optionele generics en/of []), naam, optionele initializer
  const re =
    /(?:private|protected)\s+(?:(?:final|transient|volatile)\s+)*([A-Za-z_]\w*(?:\s*<[^>]+>)?(?:\s*\[\s*\])?)\s+(\w+)\s*(?:=[^;]+)?\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    // Skip static fields
    const lookback = cleaned.slice(Math.max(0, m.index - 30), m.index);
    if (/\bstatic\b\s*(?:final\s+)?$/.test(lookback)) continue;
    const fullMatch = m[0];
    if (/\bstatic\b/.test(fullMatch.slice(0, fullMatch.indexOf(m[1])))) continue;
    const type = m[1].replace(/\s+/g, "");
    const name = m[2];
    if (seen.has(name)) continue;
    seen.add(name);
    fields.push({ type, name });
  }
  return fields;
}

function capitalize(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function genConstructor(className: string, fields: ParsedField[]): string {
  if (fields.length === 0) {
    return `    public ${className}() {\n    }\n`;
  }
  const params = fields.map((f) => `${f.type} ${f.name}`).join(", ");
  const assigns = fields.map((f) => `        this.${f.name} = ${f.name};`).join("\n");
  return `    public ${className}(${params}) {\n${assigns}\n    }\n`;
}

function genGetter(field: ParsedField): string {
  let method: string;
  if (field.type === "boolean") {
    // Als veld al "isGroot" heet → gebruik veldnaam zelf (geen "isIsGroot")
    method = /^is[A-Z]/.test(field.name) ? field.name : "is" + capitalize(field.name);
  } else {
    method = "get" + capitalize(field.name);
  }
  return `    public ${field.type} ${method}() {\n        return ${field.name};\n    }\n`;
}

function genSetter(field: ParsedField): string {
  const method = "set" + capitalize(field.name);
  return `    public void ${method}(${field.type} ${field.name}) {\n        this.${field.name} = ${field.name};\n    }\n`;
}

const PRIMITIVES = new Set(["int", "long", "short", "byte", "boolean", "char", "float", "double"]);

function fieldEquals(field: ParsedField): string {
  // IntelliJ-style: Double.compare/Float.compare voor float-types, == voor andere
  // primitieven, Arrays.equals voor arrays, Objects.equals voor objecten.
  if (field.type === "double") return `Double.compare(${field.name}, that.${field.name}) == 0`;
  if (field.type === "float") return `Float.compare(${field.name}, that.${field.name}) == 0`;
  if (PRIMITIVES.has(field.type)) return `${field.name} == that.${field.name}`;
  if (field.type.endsWith("[]")) return `Arrays.equals(${field.name}, that.${field.name})`;
  return `Objects.equals(${field.name}, that.${field.name})`;
}

function genEquals(className: string, fields: ParsedField[]): string {
  let body = `        if (this == o) return true;\n        if (o == null || getClass() != o.getClass()) return false;\n`;
  if (fields.length === 0) {
    body += `        return true;\n`;
  } else {
    body += `        ${className} that = (${className}) o;\n`;
    const comps = fields.map(fieldEquals);
    if (comps.length === 1) {
      body += `        return ${comps[0]};\n`;
    } else {
      body += `        return ${comps.join(" &&\n                ")};\n`;
    }
  }
  return `    @Override\n    public boolean equals(Object o) {\n${body}    }\n`;
}

function genHashCode(fields: ParsedField[]): string {
  if (fields.length === 0) {
    return `    @Override\n    public int hashCode() {\n        return 0;\n    }\n`;
  }
  const arrayFields = fields.filter((f) => f.type.endsWith("[]"));
  const normalFields = fields.filter((f) => !f.type.endsWith("[]"));
  if (arrayFields.length === 0) {
    return `    @Override\n    public int hashCode() {\n        return Objects.hash(${normalFields
      .map((f) => f.name)
      .join(", ")});\n    }\n`;
  }
  // Mix van array + normale velden: IntelliJ-style combineer hash met Arrays.hashCode.
  const normalArgs = normalFields.map((f) => f.name).join(", ");
  let body = normalFields.length
    ? `        int result = Objects.hash(${normalArgs});\n`
    : `        int result = 1;\n`;
  for (const f of arrayFields) {
    body += `        result = 31 * result + Arrays.hashCode(${f.name});\n`;
  }
  body += `        return result;\n`;
  return `    @Override\n    public int hashCode() {\n${body}    }\n`;
}

function genToString(className: string, fields: ParsedField[]): string {
  if (fields.length === 0) {
    return `    @Override\n    public String toString() {\n        return "${className}{}";\n    }\n`;
  }
  const lines = fields
    .map((f, i) => `                "${i === 0 ? "" : ", "}${f.name}=" + ${f.name}`)
    .join(" +\n");
  return `    @Override\n    public String toString() {\n        return "${className}{" +\n${lines} +\n                "}";\n    }\n`;
}
