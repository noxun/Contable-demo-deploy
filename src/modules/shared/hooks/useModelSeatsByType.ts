import { fetchAllModelSeats } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useModelSeatsByType(type: number | undefined) {
  return useQuery({
    queryKey: ["AllModelSeats", type],
    queryFn: () => fetchAllModelSeats(type),
    enabled: type !== undefined
  });
}
