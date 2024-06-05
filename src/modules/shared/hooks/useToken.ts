"use client";
import { useEffect, useState } from "react";
export default function useToken() {
  const [token, setToken] = useState<string | undefined>("");

  useEffect(() => {
    setToken(localStorage.getItem("token") ?? "");
  }, []);

  return {
    token,
  };
}
