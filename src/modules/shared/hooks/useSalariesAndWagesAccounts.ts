import { fetchSalariesAndWagesAccounts } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useSalariesAndWagesAccounts(isEnabled = true){
  return useQuery({
    queryKey: ["SalariesAndWagesAccounts"],
    queryFn: fetchSalariesAndWagesAccounts,
    enabled: isEnabled
  })
}