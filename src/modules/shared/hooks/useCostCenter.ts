import { fetchCostCenter } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useCostCenter() {
  return useQuery({
    queryKey: ["costCenter"],
    queryFn: fetchCostCenter,
  });
}
