import { api } from "@/lib/api";
import { ConfigValuesType } from "../schemas/configFormSchema";

export const configService = {
  async fetchConfigValues() {
    const response = await api.get("/api/Ufv/getConfigValues");
    return response.data as ConfigValuesType;
  },
};
