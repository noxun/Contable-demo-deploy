import { fetchTrazoInternCodes } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useTrazoInternCodes() {
  return useQuery({
    queryKey: ["trazoInternCodes"],
    queryFn: fetchTrazoInternCodes,
  });
}
