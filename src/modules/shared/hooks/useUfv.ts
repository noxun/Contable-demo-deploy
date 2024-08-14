import { fetchUfvValues } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useUfv(enabled = true){
  return useQuery({
    queryKey: ["Ufv"],
    queryFn: fetchUfvValues,
    enabled: enabled
  })
}