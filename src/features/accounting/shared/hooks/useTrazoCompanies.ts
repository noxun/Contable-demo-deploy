import { fetchTrazoCompanies } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useTrazoCompanies() {
  return useQuery({
    queryKey: ["TrazoCompanies"],
    queryFn: fetchTrazoCompanies
  })
}
