import { create } from "zustand";
import { LoginResponse } from "./types";
import { persist } from "zustand/middleware";

type UserStore = {
  loginData: LoginResponse | null;
  setLoginData: (data: LoginResponse) => void;
  setUfvRegister: (value: boolean) => void;
};


const useUserStore = create<UserStore>((set) => ({
  loginData: null,
  setLoginData: (data) => {
    set({ loginData: data });
    if(typeof window !== "undefined"){
      localStorage.setItem('loginResponse', JSON.stringify(data));
    }
  },
  setUfvRegister: (value) => set((state) => {
    const newLoginData = state.loginData ? { ...state.loginData, ufvRegister: value } : null;
    if (newLoginData && typeof window !== "undefined") {
      localStorage.setItem('loginResponse', JSON.stringify(newLoginData));
    }
    return { loginData: newLoginData };
  }),
}));


export default useUserStore;
