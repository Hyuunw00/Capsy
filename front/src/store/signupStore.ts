import { create } from "zustand";

interface SignUpSate {
  id: string;
  email: string;
  password: string;
  passwordConfirm: string;
  isIdValid: boolean;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  isPasswordConfirmValid: boolean;
  setId: (id: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  setIsIdValid: (isValid: boolean) => void;
  setIsEmailValid: (isValid: boolean) => void;
  setIsPasswordValid: (isValid: boolean) => void;
  setIsPasswordConfirmValid: (isValid: boolean) => void;
}

export const useSignupStore = create<SignUpSate>((set) => ({
  id: "",
  email: "",
  password: "",
  passwordConfirm: "",
  isIdValid: false,
  isEmailValid: false,
  isPasswordValid: false,
  isPasswordConfirmValid: false,

  setId: (id: string) => set({ id }),
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setPasswordConfirm: (passwordConfirm: string) => set({ passwordConfirm }),

  setIsIdValid: (isValid: boolean) => set({ isIdValid: isValid }),
  setIsEmailValid: (isValid: boolean) => set({ isEmailValid: isValid }),
  setIsPasswordValid: (isValid: boolean) => set({ isPasswordValid: isValid }),
  setIsPasswordConfirmValid: (isValid: boolean) => set({ isPasswordConfirmValid: isValid }),
}));
