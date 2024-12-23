import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark;

          if (newIsDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }

          return { isDark: newIsDark };
        });
      },
    }),
    {
      name: "theme-storage",
    },
  ),
);

// 시스템 테마 변경 감지해서 변경해주는 코드
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const currentState = useThemeStore.getState();
    currentState.toggleTheme();
  });
}
