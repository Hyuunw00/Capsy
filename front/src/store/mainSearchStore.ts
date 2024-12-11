import { create } from "zustand";

interface MainSearchState {
  searchInput: string;
  setSearchInput: (input: string) => void;
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
}

export const useMainSearchStore = create<MainSearchState>((set) => ({
  searchInput: "",
  setSearchInput: (searchInput: string) => set({ searchInput }),
  isFocused: false,
  setIsFocused: (isFocused: boolean) => set({ isFocused: isFocused }),
}));
