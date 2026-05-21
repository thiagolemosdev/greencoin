import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_LOCALE } from "@core/constants";
import type { SupportedLocale } from "@core/constants";

type AppState = {
  locale: SupportedLocale;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  setLocale: (locale: SupportedLocale) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
};

function applyDarkMode(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      sidebarCollapsed: false,
      darkMode: false,
      setLocale: (locale) => set({ locale }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleDarkMode: () => {
        const next = !get().darkMode;
        applyDarkMode(next);
        set({ darkMode: next });
      },
      setDarkMode: (dark) => {
        applyDarkMode(dark);
        set({ darkMode: dark });
      },
    }),
    {
      name: "app-state",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) applyDarkMode(state.darkMode);
      },
    },
  ),
);
