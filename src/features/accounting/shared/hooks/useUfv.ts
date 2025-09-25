import { useQuery } from "@tanstack/react-query";
import { fetchUfvValues } from "../../ufv/service/ufvService";

export default function useUfv(enabled = true){
  return useQuery({
    queryKey: ["Ufv"],
    queryFn: fetchUfvValues,
    enabled: enabled
  })
}