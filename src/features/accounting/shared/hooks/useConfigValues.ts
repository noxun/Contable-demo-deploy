import { fetchConfigValues } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useConfigValues() {
  return useQuery({
    queryKey: ["configValues"],
    queryFn: fetchConfigValues,
  })
}