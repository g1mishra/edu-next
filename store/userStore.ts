import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  age?: number;
  hasHydrated: boolean;
  setAge: (age: number) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      age: undefined,
      hasHydrated: false,
      setAge: (age: number) => set({ age }),
      clearUser: () => set({ age: undefined }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
