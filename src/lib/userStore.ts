import { create } from "zustand";
import { LoginResponse } from "./types";
import { persist } from "zustand/middleware";

type UserStore = {
  loginData: LoginResponse | null;
  setLoginData: (data: LoginResponse) => void;
  setUfvRegister: (value: boolean) => void;
  getLoginData: () => LoginResponse | null;
};

const useUserStore = create<UserStore>((set, get) => ({
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
  getLoginData: () => {
    const { loginData } = get();
    if (loginData) return loginData;
    
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem('loginResponse');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        set({ loginData: parsedData });
        return parsedData;
      }
    }
    return null;
  },
}));

export default useUserStore;