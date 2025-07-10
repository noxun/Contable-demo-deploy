import { useQuery } from "@tanstack/react-query";
import { costCenterService } from "../services/costCenterService";
import { Role } from "@/lib/types";

export function useCostCenterByRoleData(filteredCostCenterClients: Role[]) {
  return useQuery({
    queryKey: ["costCenter", filteredCostCenterClients],
    queryFn: () =>
      costCenterService.fetchCostCenterByRoleData(filteredCostCenterClients),
  });
}
