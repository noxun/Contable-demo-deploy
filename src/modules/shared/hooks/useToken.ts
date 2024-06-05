"use client";
import { useEffect, useState } from "react";

export default function useToken() {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isTokenReady, setIsTokenReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken ?? "");
    setIsTokenReady(true); // Indica que el token ha sido cargado
  }, []);

  return {
    token,
    isTokenReady,
  };
}
