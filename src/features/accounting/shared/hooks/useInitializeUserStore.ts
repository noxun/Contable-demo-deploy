"use client"
import useUserStore from "@/lib/userStore";
import { useEffect } from "react";

export const useInitializeUserStore = () => {
  const setLoginData = useUserStore((state) => state.setLoginData);

  useEffect(() => {
    const storedLoginData = localStorage.getItem('loginData');
    if (storedLoginData) {
      setLoginData(JSON.parse(storedLoginData));
    }
  }, [setLoginData]);
};