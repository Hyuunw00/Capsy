import { create } from "zustand";

interface LoginState {
  accessToken: string | null;
  email: string;
  password: string;
  isLoggedIn: boolean;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsEmailValid: (isValid: boolean) => void;
  setIsPasswordValid: (isValid: boolean) => void;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  accessToken: null,
  email: "",
  password: "",
  isLoggedIn: false,
  isEmailValid: true,
  isPasswordValid: true,
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setIsEmailValid: (isValid: boolean) => set({ isEmailValid: isValid }),
  setIsPasswordValid: (isValid: boolean) => set({ isPasswordValid: isValid }),
  login: (accessToken: string) => set({ isLoggedIn: true, accessToken: accessToken }),
  logout: () => set({ isLoggedIn: false, accessToken: null }),
}));
