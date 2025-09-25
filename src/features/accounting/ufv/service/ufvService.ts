import { api } from "@/lib/api";
import { NewConfigValues, Ufv, UfvRegister } from "../schemas/ufvSchema";

export async function fetchUfvValues(): Promise<Ufv> {
  const response = await api.get(`/api/Ufv/get`);
  return response.data;
}

export async function postUfvValues(data: UfvRegister | NewConfigValues) {
  const response = await api.post(`/api/Ufv/registerUfvDollar`, data);
  return response.data;
}
