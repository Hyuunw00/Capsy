import { create } from "zustand";
interface LoginState {
  accessToken: string | null;
  isLoggedIn: boolean;

  email: string;
  password: string;
  passwordConfirm: string;

  isEmailValid: boolean;
  isPasswordValid: boolean;
  isPasswordConfirmValid: boolean;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (password: string) => void;

  setIsEmailValid: (isValid: boolean) => void;
  setIsPasswordValid: (isValid: boolean) => void;
  setIsPasswordConfirmValid: (isValid: boolean) => void;

  login: (accessToken: string | null) => void;
  logout: () => void;
}
export const useLoginStore = create<LoginState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  isEmailValid: false,
  isPasswordValid: false,
  isPasswordConfirmValid: false,

  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setPasswordConfirm: (passwordConfirm: string) => set({ passwordConfirm }),

  setIsEmailValid: (isValid: boolean) => set({ isEmailValid: isValid }),
  setIsPasswordValid: (isValid: boolean) => set({ isPasswordValid: isValid }),
  setIsPasswordConfirmValid: (isValid: boolean) => set({ isPasswordConfirmValid: isValid }),

  login: (accessToken: string | null) => set({ isLoggedIn: true, accessToken: accessToken }),
  logout: () => set({ isLoggedIn: false, accessToken: null }),
}));
