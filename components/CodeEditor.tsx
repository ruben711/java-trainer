"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Editor, { type OnMount } from "@monaco-editor/react";

export interface CodeEditorHandle {
  reveal: (path: string, line: number, col?: number) => void;
}

interface CodeEditorProps {
  files: { path: string; content: string }[];
  activePath: string | null;
  seedVersion: number;
  onChange: (path: string, value: string) => void;
  readOnly?: boolean;
  height?: string | number;
}

type Monaco = Parameters<OnMount>[1];
type IEditor = Parameters<OnMount>[0];
type ITextModel = ReturnType<Monaco["editor"]["createModel"]>;

function uriFor(monaco: Monaco, path: string) {
  return monaco.Uri.parse("file:///" + path.replace(/^\/+/, ""));
}

function defineThemes(monaco: Monaco) {
  monaco.editor.defineTheme("coffee-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5c636d", fontStyle: "italic" },
      { token: "keyword", foreground: "c678dd" },
      { token: "string", foreground: "98c379" },
      { token: "number", foreground: "e2c07c" },
      { token: "type", foreground: "61afef" },
      { token: "type.identifier", foreground: "61afef" },
      { token: "delimiter", foreground: "8a919a" },
    ],
    colors: {
      "editor.background": "#16181c",
      "editor.foreground": "#e2e5ea",
      "editorLineNumber.foreground": "#5c636d",
      "editorLineNumber.activeForeground": "#e27c3d",
      "editorCursor.foreground": "#e27c3d",
      "editor.selectionBackground": "#2a313c",
      "editor.lineHighlightBackground": "#1c1f24",
      "editorIndentGuide.background1": "#262a31",
      "editorGutter.background": "#16181c",
      "editorWidget.background": "#1c1f24",
      "editorWidget.border": "#262a31",
    },
  });
  monaco.editor.defineTheme("coffee-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8e959e", fontStyle: "italic" },
      { token: "keyword", foreground: "a626a4" },
      { token: "string", foreground: "3f8a4f" },
      { token: "number", foreground: "a07020" },
      { token: "type", foreground: "2a6db0" },
      { token: "type.identifier", foreground: "2a6db0" },
      { token: "delimiter", foreground: "5c636c" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#181b1f",
      "editorLineNumber.foreground": "#b0b6bd",
      "editorCursor.foreground": "#c75b21",
      "editor.selectionBackground": "#dbe6f3",
      "editor.lineHighlightBackground": "#f4f5f7",
    },
  });
}

let javaCompletionRegistered = false;
function registerJavaCompletion(monaco: Monaco) {
  if (javaCompletionRegistered) return;
  javaCompletionRegistered = true;
  monaco.languages.registerCompletionItemProvider("java", {
    triggerCharacters: ["."],
    provideCompletionItems(model: any, position: any) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      const K = monaco.languages.CompletionItemKind;
      const Rule = monaco.languages.CompletionItemInsertTextRule;
      const snip = (label: string, insertText: string, documentation: string) => ({
        label,
        kind: K.Snippet,
        insertText,
        insertTextRules: Rule.InsertAsSnippet,
        documentation,
        range,
      });
      const kw = (label: string) => ({ label, kind: K.Keyword, insertText: label, range });
      const cls = (label: string) => ({ label, kind: K.Class, insertText: label, range });
      const suggestions: any[] = [
        snip("sout", "System.out.println($0);", "System.out.println"),
        snip("souf", 'System.out.printf("$1%n", $0);', "System.out.printf"),
        snip("psvm", "public static void main(String[] args) {\n\t$0\n}", "main-methode"),
        snip("fori", "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}", "for-lus"),
        snip("foreach", "for (${1:Type} ${2:item} : ${3:collection}) {\n\t$0\n}", "for-each-lus"),
        snip("ifelse", "if ($1) {\n\t$2\n} else {\n\t$0\n}", "if / else"),
        snip("trycatch", "try {\n\t$1\n} catch (${2:Exception} ${3:e}) {\n\t$0\n}", "try / catch"),
        snip("clazz", "public class ${1:Naam} {\n\t$0\n}", "nieuwe klasse"),
        ...[
          "public", "private", "protected", "static", "final", "abstract", "class", "interface",
          "enum", "extends", "implements", "void", "return", "new", "if", "else", "for", "while",
          "switch", "case", "default", "break", "continue", "this", "super", "null", "true", "false",
          "import", "package", "throws", "throw", "try", "catch", "finally", "instanceof",
        ].map(kw),
        ...[
          "String", "int", "double", "boolean", "char", "long", "float", "System", "ArrayList",
          "LinkedList", "HashMap", "TreeMap", "HashSet", "TreeSet", "List", "Map", "Set", "Objects",
          "Math", "Integer", "Double", "Boolean", "Character", "Collections", "Arrays", "Random",
          "Scanner", "Comparable", "Comparator", "Override", "Exception", "RuntimeException",
        ].map(cls),
      ];
      return { suggestions };
    },
  } as any);
}

function currentTheme(): string {
  if (typeof document === "undefined") return "coffee-light";
  return document.documentElement.classList.contains("dark")
    ? "coffee-dark"
    : "coffee-light";
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor(
    { files, activePath, seedVersion, onChange, readOnly, height = "100%" },
    ref,
  ) {
    const editorRef = useRef<IEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const modelsRef = useRef<Map<string, ITextModel>>(new Map());
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useImperativeHandle(ref, () => ({
      reveal: (path, line, col = 1) => {
        const editor = editorRef.current;
        const model = modelsRef.current.get(path);
        if (!editor || !model) return;
        editor.setModel(model);
        editor.revealLineInCenter(line);
        editor.setPosition({ lineNumber: line, column: col });
        editor.focus();
      },
    }));

    function ensureModel(path: string, content: string): ITextModel {
      const monaco = monacoRef.current!;
      let model = modelsRef.current.get(path);
      if (!model) {
        const uri = uriFor(monaco, path);
        model = monaco.editor.getModel(uri) ?? monaco.editor.createModel(content, "java", uri);
        model.onDidChangeContent(() => {
          onChangeRef.current(path, model!.getValue());
        });
        modelsRef.current.set(path, model);
      }
      return model;
    }

    const handleMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      defineThemes(monaco);
      registerJavaCompletion(monaco);
      monaco.editor.setTheme(currentTheme());

      for (const f of files) ensureModel(f.path, f.content);
      const first = activePath ?? files[0]?.path ?? null;
      if (first && modelsRef.current.has(first)) {
        editor.setModel(modelsRef.current.get(first)!);
      }

      // Volg light/dark wissels
      const observer = new MutationObserver(() =>
        monaco.editor.setTheme(currentTheme()),
      );
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    };

    // Voeg nieuwe modellen toe / ruim verwijderde op
    const pathKey = files.map((f) => f.path).join("|");
    useEffect(() => {
      if (!monacoRef.current) return;
      const wanted = new Set(files.map((f) => f.path));
      for (const f of files) ensureModel(f.path, f.content);
      for (const [path, model] of modelsRef.current) {
        if (!wanted.has(path)) {
          model.dispose();
          modelsRef.current.delete(path);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathKey]);

    // Wissel actief bestand
    useEffect(() => {
      const editor = editorRef.current;
      if (!editor || !activePath) return;
      const model = modelsRef.current.get(activePath);
      if (model && editor.getModel() !== model) editor.setModel(model);
    }, [activePath]);

    // Forceer her-seed van inhoud (reset / nieuwe oefening)
    useEffect(() => {
      if (!monacoRef.current) return;
      for (const f of files) {
        const model = ensureModel(f.path, f.content);
        if (model.getValue() !== f.content) model.setValue(f.content);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seedVersion]);

    // Ruim modellen op bij unmount
    useEffect(() => {
      return () => {
        for (const model of modelsRef.current.values()) model.dispose();
        modelsRef.current.clear();
      };
    }, []);

    return (
      <Editor
        height={height}
        defaultLanguage="java"
        theme={currentTheme()}
        onMount={handleMount}
        options={{
          readOnly,
          fontFamily:
            "var(--font-mono), ui-monospace, 'JetBrains Mono', monospace",
          fontSize: 13.5,
          lineHeight: 21,
          minimap: { enabled: true, renderCharacters: false, maxColumn: 90, scale: 1 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          tabSize: 4,
          renderLineHighlight: "all",
          automaticLayout: true,
          fixedOverflowWidgets: true,
          glyphMargin: true,
          lineNumbersMinChars: 3,
          folding: true,
          cursorBlinking: "smooth",
          guides: { indentation: true, bracketPairs: true },
          quickSuggestions: { other: true, comments: false, strings: false },
          suggestOnTriggerCharacters: true,
          tabCompletion: "on",
          acceptSuggestionOnEnter: "smart",
          parameterHints: { enabled: true },
          suggestSelection: "first",
        }}
        loading={
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Editor laden…
          </div>
        }
      />
    );
  },
);

export default CodeEditor;
