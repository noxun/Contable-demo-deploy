import { api } from "@/lib/api";
import { CostCenter, Role } from "@/lib/types";

export const costCenterService = {
  async fetchCostCenterByRoleData(data: Role[]) {
    const response = await api.post(`/api/CostCenter`, data);
    return response.data as CostCenter[];
  },
  async fetchAllCostCenter(): Promise<CostCenter[]> {
    const response = await api.get(`/api/CostCenter`);
    return response.data as CostCenter[];
  },
};
