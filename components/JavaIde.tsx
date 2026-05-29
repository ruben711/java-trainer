"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import CodeEditor, { type CodeEditorHandle } from "./CodeEditor";
import FileTabs from "./FileTabs";
import FileTree, { type CreateKind } from "./FileTree";
import OutputPanel from "./OutputPanel";
import { Play, RotateCcw } from "lucide-react";
import { useStore, type ProjectFile } from "@/lib/store";
import { executeJava } from "@/lib/runClient";
import type { ExecResult } from "@/lib/types";
import {
  classNameFromPath,
  dirName,
  hasMain,
  skeletonClass,
  skeletonInterface,
  skeletonMain,
  skeletonTest,
  toExecFiles,
  uniqueName,
} from "@/lib/javaFiles";

export interface JavaIdeHandle {
  getFiles: () => ProjectFile[];
  run: () => void;
  showResult: (result: ExecResult | null, testSlot?: ReactNode, loading?: boolean) => void;
  reset: () => void;
}

interface JavaIdeProps {
  projectId: string;
  initialFiles: ProjectFile[];
  initialFolders?: string[];
  extraActions?: ReactNode;
  onResult?: (result: ExecResult, files: ProjectFile[]) => void;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseErrorPaths(
  result: ExecResult | null,
  paths: string[],
  entryPath: string | null,
): string[] {
  if (!result?.compile || (result.compile.code ?? 0) === 0) return [];
  const text = (result.compile.stderr || "") + (result.compile.stdout || "");
  const found = new Set<string>();
  const re = /([A-Za-z0-9_./-]+\.java):\d+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const ref = m[1];
    if (ref === "prog.java" && entryPath) found.add(entryPath);
    else {
      const hit = paths.find(
        (p) => p === ref || p.endsWith("/" + ref) || p.split("/").pop() === ref,
      );
      if (hit) found.add(hit);
    }
  }
  return [...found];
}

const JavaIde = forwardRef<JavaIdeHandle, JavaIdeProps>(function JavaIde(
  { projectId, initialFiles, initialFolders = [], extraActions, onResult },
  ref,
) {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [seedVersion, setSeedVersion] = useState(0);

  const [result, setResult] = useState<ExecResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [testSlot, setTestSlot] = useState<ReactNode>(null);

  const editorRef = useRef<CodeEditorHandle>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Init vanuit store of starter-files ──
  useEffect(() => {
    const saved = useStore.getState().getProject(projectId);
    if (saved && saved.files.length) {
      setFiles(saved.files);
      setFolders(saved.folders);
      const active = saved.activePath ?? saved.files[0]?.path ?? null;
      setActivePath(active);
      setOpenTabs(saved.openTabs.length ? saved.openTabs : active ? [active] : []);
    } else {
      const active = initialFiles[0]?.path ?? null;
      setFiles(initialFiles);
      setFolders(initialFolders);
      setActivePath(active);
      setOpenTabs(active ? [active] : []);
    }
    setReady(true);
    setSeedVersion((v) => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // ── Persist (debounced) ──
  useEffect(() => {
    if (!ready) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      useStore.getState().saveProject(projectId, {
        files,
        folders,
        activePath,
        openTabs,
      });
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [ready, files, folders, activePath, openTabs, projectId]);

  const allPaths = files.map((f) => f.path);
  const entryPath =
    files.find((f) => /\.java$/i.test(f.path) && hasMain(f.content))?.path ??
    activePath;
  const errorPaths = parseErrorPaths(result, allPaths, entryPath);

  const runCode = result?.run?.code;
  const runDot = loading
    ? "bg-medium"
    : !result
      ? "bg-faint"
      : !result.ok
        ? "bg-hard"
        : runCode === 0
          ? "bg-easy"
          : "bg-hard";
  const runLabel = loading
    ? "bezig…"
    : !result
      ? "klaar"
      : !result.ok
        ? "fout"
        : `exit ${runCode ?? "?"}`;

  function openFile(path: string) {
    setActivePath(path);
    setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]));
  }

  function handleEditorChange(path: string, value: string) {
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content: value } : f)),
    );
  }

  function closeTab(path: string) {
    setOpenTabs((tabs) => {
      const next = tabs.filter((t) => t !== path);
      if (path === activePath) {
        setActivePath(next[next.length - 1] ?? null);
      }
      return next;
    });
  }

  // ── File operations ──
  function createItem(kind: CreateKind, dir: string, rawName: string) {
    if (kind === "folder") {
      const path = dir ? `${dir}/${rawName}` : rawName;
      setFolders((prev) => (prev.includes(path) ? prev : [...prev, path]));
      return;
    }
    if (kind === "empty") {
      const name = rawName.includes(".") ? rawName : `${rawName}.txt`;
      const path = uniqueName(allPaths, dir, name.replace(/\.[^.]+$/, ""), name.match(/\.[^.]+$/)?.[0] ?? ".txt");
      setFiles((prev) => [...prev, { path, content: "" }]);
      openFile(path);
      return;
    }
    const className = rawName.replace(/\.java$/i, "");
    const path = uniqueName(allPaths, dir, className, ".java");
    const realName = classNameFromPath(path);
    const content =
      kind === "interface"
        ? skeletonInterface(realName, dir)
        : kind === "main"
          ? skeletonMain(realName, dir)
          : kind === "test"
            ? skeletonTest(realName, dir)
            : skeletonClass(realName, dir);
    setFiles((prev) => [...prev, { path, content }]);
    openFile(path);
    setSeedVersion((v) => v + 1);
  }

  function renameFile(path: string, newBase: string) {
    const dir = dirName(path);
    const isJava = /\.java$/i.test(path);
    let base = newBase;
    if (isJava && !/\.java$/i.test(base)) base += ".java";
    const newPath = dir ? `${dir}/${base}` : base;
    if (newPath === path || allPaths.includes(newPath)) return;
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, path: newPath } : f)),
    );
    setOpenTabs((tabs) => tabs.map((t) => (t === path ? newPath : t)));
    setActivePath((a) => (a === path ? newPath : a));
  }

  function duplicateFile(path: string) {
    const file = files.find((f) => f.path === path);
    if (!file) return;
    const dir = dirName(path);
    const isJava = /\.java$/i.test(path);
    const base = classNameFromPath(path);
    const ext = isJava ? ".java" : path.match(/\.[^.]+$/)?.[0] ?? "";
    const newPath = uniqueName(allPaths, dir, base, ext);
    const newBase = classNameFromPath(newPath);
    const content = isJava
      ? file.content.replace(new RegExp(`\\b${escapeRe(base)}\\b`, "g"), newBase)
      : file.content;
    setFiles((prev) => [...prev, { path: newPath, content }]);
    openFile(newPath);
    setSeedVersion((v) => v + 1);
  }

  function deleteFile(path: string) {
    setFiles((prev) => prev.filter((f) => f.path !== path));
    closeTab(path);
  }

  function renameFolder(dir: string, newName: string) {
    const parent = dirName(dir);
    const newDir = parent ? `${parent}/${newName}` : newName;
    if (newDir === dir) return;
    const rewrite = (p: string) =>
      p === dir || p.startsWith(dir + "/") ? newDir + p.slice(dir.length) : p;
    setFiles((prev) => prev.map((f) => ({ ...f, path: rewrite(f.path) })));
    setFolders((prev) => prev.map(rewrite));
    setOpenTabs((tabs) => tabs.map(rewrite));
    setActivePath((a) => (a ? rewrite(a) : a));
  }

  function deleteFolder(dir: string) {
    const inDir = (p: string) => p === dir || p.startsWith(dir + "/");
    setFiles((prev) => prev.filter((f) => !inDir(f.path)));
    setFolders((prev) => prev.filter((d) => !inDir(d)));
    setOpenTabs((tabs) => tabs.filter((t) => !inDir(t)));
    setActivePath((a) => (a && inDir(a) ? null : a));
  }

  // ── Run ──
  const run = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setResult(null);
    setTestSlot(null);
    const res = await executeJava(toExecFiles(files, activePath ?? undefined));
    setLoading(false);
    setResult(res);
    if (res.ok) onResult?.(res, files);
  }, [files, loading, onResult, activePath]);

  function resetToStarter() {
    setFiles(initialFiles);
    setFolders(initialFolders);
    const active = initialFiles[0]?.path ?? null;
    setActivePath(active);
    setOpenTabs(active ? [active] : []);
    setResult(null);
    setTestSlot(null);
    setSeedVersion((v) => v + 1);
  }

  useImperativeHandle(ref, () => ({
    getFiles: () => files,
    run,
    showResult: (r, slot, isLoading) => {
      setLoading(!!isLoading);
      setResult(r);
      setTestSlot(slot ?? null);
    },
    reset: resetToStarter,
  }));

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center gap-2 rounded-md border border-border bg-surface font-mono text-[13px] text-muted">
        <span className="status-dot animate-pulse bg-accent" /> IDE laden…
      </div>
    );
  }

  return (
    <div
      className="flex h-full min-h-0 overflow-hidden rounded-md border border-border bg-surface"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          run();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault(); // auto-saved
        }
      }}
    >
      <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-surface sm:flex">
        <FileTree
          files={files}
          folders={folders}
          activePath={activePath}
          errorPaths={errorPaths}
          onSelect={openFile}
          onCreate={createItem}
          onRename={renameFile}
          onDuplicate={duplicateFile}
          onDelete={deleteFile}
          onRenameFolder={renameFolder}
          onDeleteFolder={deleteFolder}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <FileTabs
          openTabs={openTabs}
          activePath={activePath}
          errorPaths={errorPaths}
          onSelect={setActivePath}
          onClose={closeTab}
        />
        {/* Editor-toolbar */}
        <div className="flex h-9 flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-2">
          <div className="inline-flex overflow-hidden rounded-[5px] border border-border">
            <button
              onClick={run}
              disabled={loading}
              className="btn-primary h-7 gap-1.5 !rounded-none !py-0 text-xs"
            >
              {loading ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Play size={11} className="fill-current" />
              )}
              Run
              <kbd className="kbd ml-0.5 !border-on-accent/30 !bg-transparent !text-on-accent/80">Ctrl ↵</kbd>
            </button>
            <button
              onClick={resetToStarter}
              className="btn-ghost h-7 gap-1.5 !rounded-none border-l border-border !py-0 text-xs"
              title="Terug naar de start-bestanden"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">{extraActions}</div>
        </div>

        {/* Editor (editor-elevatie = bg) */}
        <div className="min-h-0 flex-1 bg-bg">
          {activePath ? (
            <CodeEditor
              ref={editorRef}
              files={files}
              activePath={activePath}
              seedVersion={seedVersion}
              onChange={handleEditorChange}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-[13px] text-muted">
              open of maak een bestand om te beginnen
            </div>
          )}
        </div>

        <div className="h-52 shrink-0">
          <OutputPanel
            result={result}
            loading={loading}
            entryPath={entryPath}
            knownFiles={allPaths}
            onJump={(p, line) => {
              setActivePath(p);
              setOpenTabs((t) => (t.includes(p) ? t : [...t, p]));
              setTimeout(() => editorRef.current?.reveal(p, line), 0);
            }}
            testSlot={testSlot}
          />
        </div>

        {/* IDE-statusbalk */}
        <div className="statusbar">
          <span className="chip !rounded-[3px] border-accent-2/40 bg-accent-2/10 text-accent-2">Java</span>
          <span className="tabular-nums">{files.length} bestanden</span>
          {activePath && (
            <>
              <span className="vsep" />
              <span className="truncate">{activePath}</span>
            </>
          )}
          <span className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`status-dot ${runDot}`} /> {runLabel}
            </span>
            <span className="vsep" />
            <span>Ctrl ↵ Run</span>
          </span>
        </div>
      </div>
    </div>
  );
});

export default JavaIde;
