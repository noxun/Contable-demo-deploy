import { fetchAllBanks } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useBanks() {
  return useQuery({
    queryKey: ["banks"],
    queryFn: fetchAllBanks,
    staleTime: 1000 * 30 * 10,
  });
}