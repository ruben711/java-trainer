"use client";

import JavaIde from "@/components/JavaIde";
import type { ProjectFile } from "@/lib/store";

const STARTER: ProjectFile[] = [
  {
    path: "Main.java",
    content: `public class Main {
    public static void main(String[] args) {
        Dier[] dieren = { new Hond(), new Kat() };
        for (Dier d : dieren) {
            System.out.println(d.maakGeluid());
        }
    }
}
`,
  },
  {
    path: "Dier.java",
    content: `public interface Dier {
    String maakGeluid();
}
`,
  },
  {
    path: "Hond.java",
    content: `public class Hond implements Dier {
    public String maakGeluid() {
        return "Woef";
    }
}
`,
  },
  {
    path: "Kat.java",
    content: `public class Kat implements Dier {
    public String maakGeluid() {
        return "Miauw";
    }
}
`,
  },
];

export default function SandboxPage() {
  return (
    <div className="mx-auto flex h-full max-w-[120rem] flex-col gap-3 px-3 py-3">
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
        <span className="eyebrow">Scratch</span>
        <span className="text-faint">/</span>
        <span className="font-mono text-[13px]">sandbox</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-faint">
          Run <kbd className="kbd">Ctrl ↵</kbd>
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <JavaIde projectId="sandbox" initialFiles={STARTER} />
      </div>
    </div>
  );
}
