import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { env } from "@/env";

let token = null;
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("loginResponse");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.replace("/auth/login");
        toast.warning("Sesión expirada, por favor inicie sesión nuevamente");
      }
    }
    return Promise.reject(error);
  }
);
