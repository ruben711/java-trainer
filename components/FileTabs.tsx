"use client";

import { FileCode2, X } from "lucide-react";

function baseName(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? path : path.slice(i + 1);
}

interface FileTabsProps {
  openTabs: string[];
  activePath: string | null;
  errorPaths?: string[];
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}

export default function FileTabs({
  openTabs,
  activePath,
  errorPaths = [],
  onSelect,
  onClose,
}: FileTabsProps) {
  if (openTabs.length === 0) {
    return (
      <div className="flex h-9 items-center border-b border-border bg-surface-2 px-3 font-mono text-[11px] text-faint">
        geen bestand open
      </div>
    );
  }
  const errSet = new Set(errorPaths);
  return (
    <div className="flex h-9 items-stretch overflow-x-auto border-b border-border bg-surface-2">
      {openTabs.map((path) => {
        const active = path === activePath;
        const hasErr = errSet.has(path);
        return (
          <div
            key={path}
            onClick={() => onSelect(path)}
            className={`tab group h-9 ${active ? "tab-active" : "tab-inactive"}`}
          >
            {active && <span className="tab-accent" />}
            {hasErr ? (
              <span className="status-dot shrink-0 bg-hard" />
            ) : (
              <FileCode2 size={12} className="shrink-0 text-muted" />
            )}
            <span
              className={`max-w-[12rem] truncate font-mono ${hasErr ? "text-hard" : ""}`}
            >
              {baseName(path)}
            </span>
            <button
              type="button"
              aria-label={`Sluit ${baseName(path)}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose(path);
              }}
              className="ml-1 rounded-[3px] p-0.5 text-faint opacity-0 hover:bg-bg hover:text-text group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
      <div className="flex-1 bg-surface-2" />
    </div>
  );
}
