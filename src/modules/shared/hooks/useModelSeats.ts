import { fetchAllModelSeats } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useModelSeats() {
  return useQuery({
    queryKey: ["AllModelSeats"],
    queryFn: () => fetchAllModelSeats(),
    //ahora es asi aca porque la signature de allmodelSeats cambio
  });
}
