import { Ufv } from "./types";
import { api } from "./api";
import { UfvRegister } from "@/modules/ufv/components/UfvRegisterForm";

function setAuthToken(token: string | undefined | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export async function fetchUfvValues(): Promise<Ufv> {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Ufv/get`);
  return response.data;
}

export async function postUfvValues(data: UfvRegister) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Ufv/registerUfvDollar`, data);
  return response.data;
}
