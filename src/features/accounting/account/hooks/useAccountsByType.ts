import { fetchAccountsByType } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useAccountsByType(type: number) {
  return useQuery({
    queryKey: ["accountsAll", type],
    queryFn: () => fetchAccountsByType(type),
    staleTime: 1000 * 60 * 10, //10min
    refetchOnWindowFocus: false, // no volver a hacer la consulta al hacer focus en la ventana
  });
}
