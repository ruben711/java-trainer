"use client";

import { useEffect, useRef, useState } from "react";

export type CreateKind =
  | "class"
  | "interface"
  | "test"
  | "main"
  | "empty"
  | "folder";

interface FileTreeProps {
  files: { path: string }[];
  folders: string[];
  activePath: string | null;
  errorPaths?: string[];
  onSelect: (path: string) => void;
  onCreate: (kind: CreateKind, dir: string, name: string) => void;
  onRename: (path: string, newBase: string) => void;
  onDuplicate: (path: string) => void;
  onDelete: (path: string) => void;
  onRenameFolder: (dir: string, newName: string) => void;
  onDeleteFolder: (dir: string) => void;
}

type TreeNode =
  | { type: "folder"; name: string; path: string; children: TreeNode[] }
  | { type: "file"; name: string; path: string };

function parentDir(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}

function buildTree(files: { path: string }[], folders: string[]): TreeNode[] {
  const dirs = new Set<string>(folders.filter(Boolean));
  for (const f of files) {
    const parts = f.path.split("/");
    parts.pop();
    let acc = "";
    for (const p of parts) {
      acc = acc ? acc + "/" + p : p;
      dirs.add(acc);
    }
  }
  const childrenOf = (dir: string): TreeNode[] => {
    const folderNodes: TreeNode[] = [...dirs]
      .filter((d) => parentDir(d) === dir)
      .map((d) => ({
        type: "folder" as const,
        name: d.split("/").pop()!,
        path: d,
        children: childrenOf(d),
      }));
    const fileNodes: TreeNode[] = files
      .filter((f) => parentDir(f.path) === dir)
      .map((f) => ({
        type: "file" as const,
        name: f.path.split("/").pop()!,
        path: f.path,
      }));
    folderNodes.sort((a, b) => a.name.localeCompare(b.name));
    fileNodes.sort((a, b) => a.name.localeCompare(b.name));
    return [...folderNodes, ...fileNodes];
  };
  return childrenOf("");
}

const NEW_ITEMS: { kind: CreateKind; label: string; icon: string }[] = [
  { kind: "class", label: "Nieuwe klasse", icon: "J" },
  { kind: "interface", label: "Nieuwe interface", icon: "I" },
  { kind: "test", label: "Test-klasse", icon: "T" },
  { kind: "main", label: "Main-klasse", icon: "▶" },
  { kind: "empty", label: "Leeg bestand", icon: "·" },
  { kind: "folder", label: "Nieuwe map", icon: "▸" },
];

const DEFAULT_NAME: Record<CreateKind, string> = {
  class: "NieuweKlasse",
  interface: "NieuweInterface",
  test: "Test",
  main: "Main",
  empty: "bestand.txt",
  folder: "map",
};

export default function FileTree(props: FileTreeProps) {
  const {
    files,
    folders,
    activePath,
    errorPaths = [],
    onSelect,
    onCreate,
    onRename,
    onDuplicate,
    onDelete,
    onRenameFolder,
    onDeleteFolder,
  } = props;

  const tree = buildTree(files, folders);
  const errSet = new Set(errorPaths);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedDir, setSelectedDir] = useState<string>("");
  const [newMenu, setNewMenu] = useState(false);
  const [creating, setCreating] = useState<{ kind: CreateKind; dir: string } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; node: TreeNode } | null>(null);

  // alle mappen standaard open houden zodra ze verschijnen
  const dirKey = folders.join("|") + "::" + files.map((f) => f.path).join("|");
  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev);
      for (const f of files) {
        const parts = f.path.split("/");
        parts.pop();
        let acc = "";
        for (const p of parts) {
          acc = acc ? acc + "/" + p : p;
          next.add(acc);
        }
      }
      for (const d of folders) next.add(d);
      return next;
    });
  }, [dirKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const newMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!newMenuRef.current || !newMenuRef.current.contains(e.target as Node)) {
        setNewMenu(false);
      }
      setMenu(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function toggle(dir: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  }

  function startCreate(kind: CreateKind) {
    setCreating({ kind, dir: selectedDir });
    setNewMenu(false);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
        <span className="pl-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Bestanden
        </span>
        <div ref={newMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setNewMenu((v) => !v)}
            className="btn-ghost h-7 gap-1 !px-2 text-xs"
          >
            + Nieuw ▾
          </button>
          {newMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-md border bg-surface-2 shadow-warm"
            >
              {NEW_ITEMS.map((it) => (
                <button
                  key={it.kind}
                  onClick={() => startCreate(it.kind)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-surface"
                >
                  <span aria-hidden className="w-4 text-center font-mono text-[11px] text-faint">{it.icon}</span>
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedDir && (
        <div className="flex items-center gap-1 px-3 py-1 text-[11px] text-muted">
          <span>doel-map:</span>
          <span className="font-mono text-accent">/{selectedDir}</span>
          <button
            className="ml-auto hover:text-text"
            onClick={() => setSelectedDir("")}
          >
            ✕ root
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto py-1">
        {creating && creating.dir === "" && (
          <CreateRow
            kind={creating.kind}
            depth={0}
            onSubmit={(name) => {
              onCreate(creating.kind, "", name);
              setCreating(null);
            }}
            onCancel={() => setCreating(null)}
          />
        )}
        {tree.length === 0 && !creating && (
          <p className="px-3 py-2 text-xs text-muted">
            Nog geen bestanden. Maak er een via <strong>+ Nieuw</strong>.
          </p>
        )}
        {tree.map((node) => (
          <NodeRow
            key={node.path}
            node={node}
            depth={0}
            expanded={expanded}
            activePath={activePath}
            selectedDir={selectedDir}
            errSet={errSet}
            renaming={renaming}
            creating={creating}
            onToggle={toggle}
            onSelect={onSelect}
            onSelectDir={setSelectedDir}
            onContext={(x, y, n) => setMenu({ x, y, node: n })}
            onRenameSubmit={(path, val) => {
              onRename(path, val);
              setRenaming(null);
            }}
            onRenameFolderSubmit={(dir, val) => {
              onRenameFolder(dir, val);
              setRenaming(null);
            }}
            onRenameCancel={() => setRenaming(null)}
            onCreateSubmit={(kind, dir, name) => {
              onCreate(kind, dir, name);
              setCreating(null);
            }}
            onCreateCancel={() => setCreating(null)}
          />
        ))}
      </div>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          node={menu.node}
          onRename={() => {
            setRenaming(menu.node.path || "::root");
            setMenu(null);
          }}
          onRenameFolder={() => {
            setRenaming("dir:" + menu.node.path);
            setMenu(null);
          }}
          onDuplicate={() => {
            if (menu.node.type === "file") onDuplicate(menu.node.path);
            setMenu(null);
          }}
          onDelete={() => {
            if (menu.node.type === "file") onDelete(menu.node.path);
            else onDeleteFolder(menu.node.path);
            setMenu(null);
          }}
          onNewHere={() => {
            setSelectedDir(menu.node.type === "folder" ? menu.node.path : parentDir(menu.node.path));
            setCreating({
              kind: "class",
              dir: menu.node.type === "folder" ? menu.node.path : parentDir(menu.node.path),
            });
            setMenu(null);
          }}
        />
      )}
    </div>
  );
}

interface NodeRowProps {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  activePath: string | null;
  selectedDir: string;
  errSet: Set<string>;
  renaming: string | null;
  creating: { kind: CreateKind; dir: string } | null;
  onToggle: (dir: string) => void;
  onSelect: (path: string) => void;
  onSelectDir: (dir: string) => void;
  onContext: (x: number, y: number, node: TreeNode) => void;
  onRenameSubmit: (path: string, val: string) => void;
  onRenameFolderSubmit: (dir: string, val: string) => void;
  onRenameCancel: () => void;
  onCreateSubmit: (kind: CreateKind, dir: string, name: string) => void;
  onCreateCancel: () => void;
}

function NodeRow(p: NodeRowProps) {
  const { node, depth } = p;
  const pad = { paddingLeft: 8 + depth * 14 };

  if (node.type === "folder") {
    const open = p.expanded.has(node.path);
    const isRenaming = p.renaming === "dir:" + node.path;
    return (
      <div>
        <div
          style={pad}
          onClick={() => {
            p.onToggle(node.path);
            p.onSelectDir(node.path);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            p.onContext(e.clientX, e.clientY, node);
          }}
          className={`flex cursor-pointer items-center gap-1 py-1 pr-2 text-sm hover:bg-surface-2 ${
            p.selectedDir === node.path ? "bg-surface-2" : ""
          }`}
        >
          <span className="w-3 text-[10px] text-faint">{open ? "▾" : "▸"}</span>
          {isRenaming ? (
            <InlineInput
              initial={node.name}
              onSubmit={(v) => p.onRenameFolderSubmit(node.path, v)}
              onCancel={p.onRenameCancel}
            />
          ) : (
            <span className="truncate">{node.name}</span>
          )}
        </div>
        {open && (
          <div>
            {p.creating && p.creating.dir === node.path && (
              <CreateRow
                kind={p.creating.kind}
                depth={depth + 1}
                onSubmit={(name) =>
                  p.onCreateSubmit(p.creating!.kind, node.path, name)
                }
                onCancel={p.onCreateCancel}
              />
            )}
            {node.children.map((c) => (
              <NodeRow key={c.path} {...p} node={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const active = node.path === p.activePath;
  const hasErr = p.errSet.has(node.path);
  const isJava = /\.java$/i.test(node.name);
  const isRenaming = p.renaming === node.path;
  return (
    <div
      style={pad}
      onClick={() => p.onSelect(node.path)}
      onContextMenu={(e) => {
        e.preventDefault();
        p.onContext(e.clientX, e.clientY, node);
      }}
      className={`relative flex cursor-pointer items-center gap-1.5 py-[3px] pr-2 text-[12.5px] ${
        active ? "bg-surface-2 text-text" : "hover:bg-surface-2"
      }`}
    >
      {active && <span className="absolute inset-y-0 left-0 w-0.5 bg-accent" />}
      <span className="w-3" />
      <span aria-hidden className="flex w-3.5 justify-center">
        {hasErr ? (
          <span className="status-dot bg-hard" />
        ) : isJava ? (
          <span className="font-mono text-[10px] font-semibold text-accent-2">J</span>
        ) : (
          <span className="status-dot bg-faint" />
        )}
      </span>
      {isRenaming ? (
        <InlineInput
          initial={node.name}
          onSubmit={(v) => p.onRenameSubmit(node.path, v)}
          onCancel={p.onRenameCancel}
        />
      ) : (
        <span className={`truncate font-mono text-[12.5px] ${hasErr ? "text-hard" : active ? "text-accent" : ""}`}>
          {node.name}
        </span>
      )}
    </div>
  );
}

function CreateRow({
  kind,
  depth,
  onSubmit,
  onCancel,
}: {
  kind: CreateKind;
  depth: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) {
  const icon =
    NEW_ITEMS.find((i) => i.kind === kind)?.icon ?? "·";
  return (
    <div
      style={{ paddingLeft: 8 + depth * 14 }}
      className="flex items-center gap-1.5 py-1 pr-2"
    >
      <span className="w-3" />
      <span aria-hidden className="text-[12px]">{icon}</span>
      <InlineInput initial={DEFAULT_NAME[kind]} selectAll onSubmit={onSubmit} onCancel={onCancel} />
    </div>
  );
}

function InlineInput({
  initial,
  onSubmit,
  onCancel,
  selectAll,
}: {
  initial: string;
  onSubmit: (val: string) => void;
  onCancel: () => void;
  selectAll?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    if (selectAll) {
      const dot = initial.indexOf(".");
      el.setSelectionRange(0, dot > 0 ? dot : initial.length);
    }
  }, [initial, selectAll]);
  return (
    <input
      ref={ref}
      defaultValue={initial}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const v = (e.target as HTMLInputElement).value.trim();
          if (v) onSubmit(v);
          else onCancel();
        } else if (e.key === "Escape") onCancel();
      }}
      onBlur={(e) => {
        const v = e.target.value.trim();
        if (v && v !== initial) onSubmit(v);
        else onCancel();
      }}
      className="w-full rounded border bg-bg px-1.5 py-0.5 font-mono text-[13px] outline-none ring-1 ring-accent/50"
    />
  );
}

function ContextMenu({
  x,
  y,
  node,
  onRename,
  onRenameFolder,
  onDuplicate,
  onDelete,
  onNewHere,
}: {
  x: number;
  y: number;
  node: TreeNode;
  onRename: () => void;
  onRenameFolder: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onNewHere: () => void;
}) {
  const isFolder = node.type === "folder";
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ top: y, left: x }}
      className="fixed z-50 w-48 overflow-hidden rounded-md border bg-surface-2 py-1 text-sm shadow-warm"
    >
      {isFolder && (
        <MenuItem onClick={onNewHere}>+ Nieuwe klasse hierin</MenuItem>
      )}
      {isFolder ? (
        <MenuItem onClick={onRenameFolder}>Map hernoemen</MenuItem>
      ) : (
        <MenuItem onClick={onRename}>Hernoemen</MenuItem>
      )}
      {!isFolder && <MenuItem onClick={onDuplicate}>Dupliceren</MenuItem>}
      <MenuItem onClick={onDelete} danger>
        {isFolder ? "Map verwijderen" : "Verwijderen"}
      </MenuItem>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-3 py-1.5 text-left hover:bg-surface ${
        danger ? "text-hard" : ""
      }`}
    >
      {children}
    </button>
  );
}
