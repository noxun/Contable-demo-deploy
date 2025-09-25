import { useQuery } from "@tanstack/react-query";
import { costCenterService } from "../services/costCenterService";

export default function useCostCenter() {
  return useQuery({
    queryKey: ["costCenter"],
    queryFn: costCenterService.fetchAllCostCenter,
  });
}
