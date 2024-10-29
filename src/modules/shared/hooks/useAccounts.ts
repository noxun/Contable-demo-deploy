import { fetchAllAccounts } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAllAccounts,
  });
}
