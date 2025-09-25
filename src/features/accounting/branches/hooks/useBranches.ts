import { fetchBranchList } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export function useBranches() {
  return useQuery({
    queryKey: ["allBranches"],
    queryFn: fetchBranchList
  })
}