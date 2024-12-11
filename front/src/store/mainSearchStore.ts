import { create } from "zustand";

interface MainSearchState {
  searchInput: string;
  setSearchInput: (input: string) => void;
}

export const useMainSearchStore = create<MainSearchState>((set) => ({
  searchInput: "",
  setSearchInput: (searchInput: string) => set({ searchInput }),
}));
