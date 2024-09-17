import { fetchTypeCompanies } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useTypeCompanies() {
  return useQuery({
    queryKey: ["typeCompanies"],
    queryFn: fetchTypeCompanies,
  });
}
