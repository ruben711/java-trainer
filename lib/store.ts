"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { XP_BY_DIFFICULTY } from "./xp";
import {
  generateUid,
  defaultDisplayName,
  todayStr,
  dayDiff,
} from "./identity";
import type { NameStyle, CustomTag } from "./nameStyle";

export const XP_RULES_VERSION = 1;

export type Difficulty = "easy" | "medium" | "hard" | "insane";

export interface ProjectFile {
  path: string; // bv. "dieren/Dier.java" of "Main.java"
  content: string;
}

export interface ProjectState {
  files: ProjectFile[];
  folders: string[]; // expliciete (ook lege) mappen
  activePath: string | null;
  openTabs: string[];
  updatedAt: number;
}

export interface ExerciseProgress {
  solved: boolean;
  firstSolvedAt?: number;
  attempts: number;
  lastAttemptAt?: number;
  xpAwarded: number;
}

export interface AttemptLog {
  exerciseId: string;
  title: string;
  difficulty?: Difficulty;
  passed: boolean;
  at: number;
}

interface SubmitMeta {
  title?: string;
  difficulty?: Difficulty;
}

export interface SubmitOutcome {
  awardedXp: number;
  firstSolve: boolean;
}

interface JtState {
  uid: string;
  displayName: string | null;
  xp: number;
  xpRulesVersion: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDay: string | null;
  progress: Record<string, ExerciseProgress>;
  projects: Record<string, ProjectState>;
  favorites: string[];
  notes: Record<string, string>;
  recent: AttemptLog[];
  earnedBadges: string[];
  nameStyle: NameStyle | null;
  customTag: CustomTag | null;
  notifLastSeen: number;

  ensureIdentity: () => void;
  setDisplayName: (name: string) => void;
  setNameStyle: (style: NameStyle | null) => void;
  setCustomTag: (tag: CustomTag | null) => void;
  markNotifsSeen: () => void;
  registerActivity: () => void;
  submitResult: (
    exerciseId: string,
    passed: boolean,
    meta?: SubmitMeta,
  ) => SubmitOutcome;
  saveProject: (
    id: string,
    p: Partial<ProjectState> & { files: ProjectFile[] },
  ) => void;
  getProject: (id: string) => ProjectState | undefined;
  resetProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setNote: (id: string, text: string) => void;
  setEarnedBadges: (ids: string[]) => void;
  resetAll: () => void;
}

const RECENT_CAP = 50;

export const useStore = create<JtState>()(
  persist(
    (set, get) => ({
      uid: "",
      displayName: null,
      xp: 0,
      xpRulesVersion: XP_RULES_VERSION,
      streakCount: 0,
      longestStreak: 0,
      lastActiveDay: null,
      progress: {},
      projects: {},
      favorites: [],
      notes: {},
      recent: [],
      earnedBadges: [],
      nameStyle: null,
      customTag: null,
      notifLastSeen: 0,

      ensureIdentity: () => {
        const s = get();
        if (!s.uid) {
          const uid = generateUid();
          set({ uid, displayName: s.displayName ?? defaultDisplayName(uid) });
        }
      },

      setDisplayName: (name) => set({ displayName: name.trim().slice(0, 24) }),

      setNameStyle: (style) => set({ nameStyle: style }),
      setCustomTag: (tag) => set({ customTag: tag }),
      markNotifsSeen: () => set({ notifLastSeen: Date.now() }),

      registerActivity: () => {
        const { lastActiveDay, streakCount, longestStreak } = get();
        const today = todayStr();
        if (lastActiveDay === today) return;
        let next = 1;
        if (lastActiveDay) {
          const diff = dayDiff(lastActiveDay, today);
          if (diff === 1) next = streakCount + 1;
          else if (diff <= 0) next = Math.max(1, streakCount);
        }
        set({
          lastActiveDay: today,
          streakCount: next,
          longestStreak: Math.max(longestStreak, next),
        });
      },

      submitResult: (exerciseId, passed, meta = {}) => {
        const state = get();
        const prev =
          state.progress[exerciseId] ??
          ({ solved: false, attempts: 0, xpAwarded: 0 } as ExerciseProgress);
        const now = Date.now();
        let awardedXp = 0;
        let firstSolve = false;

        let next: ExerciseProgress = {
          ...prev,
          attempts: prev.attempts + 1,
          lastAttemptAt: now,
        };

        if (passed && !prev.solved) {
          firstSolve = true;
          const diff = meta.difficulty ?? "medium";
          awardedXp = XP_BY_DIFFICULTY[diff] ?? 25;
          next = {
            ...next,
            solved: true,
            firstSolvedAt: now,
            xpAwarded: awardedXp,
          };
        } else if (passed) {
          next.solved = true;
        }

        const recent: AttemptLog[] = [
          {
            exerciseId,
            title: meta.title ?? exerciseId,
            difficulty: meta.difficulty,
            passed,
            at: now,
          },
          ...state.recent,
        ].slice(0, RECENT_CAP);

        set({
          progress: { ...state.progress, [exerciseId]: next },
          recent,
          xp: state.xp + awardedXp,
        });
        get().registerActivity();
        return { awardedXp, firstSolve };
      },

      saveProject: (id, p) => {
        const projects = get().projects;
        const existing = projects[id];
        set({
          projects: {
            ...projects,
            [id]: {
              files: p.files,
              folders: p.folders ?? existing?.folders ?? [],
              activePath:
                p.activePath ??
                existing?.activePath ??
                p.files[0]?.path ??
                null,
              openTabs: p.openTabs ?? existing?.openTabs ?? [],
              updatedAt: Date.now(),
            },
          },
        });
      },

      getProject: (id) => get().projects[id],

      resetProject: (id) => {
        const { [id]: _removed, ...rest } = get().projects;
        set({ projects: rest });
      },

      toggleFavorite: (id) => {
        const favs = get().favorites;
        set({
          favorites: favs.includes(id)
            ? favs.filter((f) => f !== id)
            : [...favs, id],
        });
      },

      isFavorite: (id) => get().favorites.includes(id),

      setNote: (id, text) => set({ notes: { ...get().notes, [id]: text } }),

      setEarnedBadges: (ids) => set({ earnedBadges: ids }),

      resetAll: () => {
        const { uid, displayName } = get();
        set({
          uid,
          displayName,
          xp: 0,
          xpRulesVersion: XP_RULES_VERSION,
          streakCount: 0,
          longestStreak: 0,
          lastActiveDay: null,
          progress: {},
          projects: {},
          favorites: [],
          notes: {},
          recent: [],
          earnedBadges: [],
          nameStyle: get().nameStyle,
          customTag: get().customTag,
        });
      },
    }),
    {
      name: "jt-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        uid: s.uid,
        displayName: s.displayName,
        xp: s.xp,
        xpRulesVersion: s.xpRulesVersion,
        streakCount: s.streakCount,
        longestStreak: s.longestStreak,
        lastActiveDay: s.lastActiveDay,
        progress: s.progress,
        projects: s.projects,
        favorites: s.favorites,
        notes: s.notes,
        recent: s.recent,
        earnedBadges: s.earnedBadges,
        nameStyle: s.nameStyle,
        customTag: s.customTag,
        notifLastSeen: s.notifLastSeen,
      }),
    },
  ),
);
