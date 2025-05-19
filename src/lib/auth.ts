import { env } from "@/env";
import { Login } from "@/features/accounting/auth/components/LoginForm";
import axios from "axios";

const API_URL = env.NEXT_PUBLIC_BACKEND_URL;

export async function login(data: Login) {
  const response = await axios.post(`${API_URL}/Auth/login`, data);
  return response.data;
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("loginResponse");
  if (typeof window !== "undefined") {
    window.location.replace("/auth/login");
  }
}
