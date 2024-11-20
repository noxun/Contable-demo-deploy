import { fetchTypeCompanies } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useTypeCompanies() {
  return useQuery({
    queryKey: ["typeCompanies"],
    queryFn: fetchTypeCompanies,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000 * 10,//10 min
  });
}
