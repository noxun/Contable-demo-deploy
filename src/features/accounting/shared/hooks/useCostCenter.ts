import { fetchAllCostCenter } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useCostCenter() {

  return useQuery({
    queryKey: ["costCenter"],
    queryFn: fetchAllCostCenter,
  });
}
