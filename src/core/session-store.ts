import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserId: (userId: string) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUserId: (userId) => set({ userId }),
      clearSession: () => set({ accessToken: null, refreshToken: null, userId: null }),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
      }),
    },
  ),
);
