import { fetchTrazoInternCodesByCompanyId } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useTrazoInternCodesByCompanyId(companyId: number | null) {
  return useQuery({
    queryKey: ["trazoInternCodes", companyId],
    queryFn: () => {
      if (!companyId) return Promise.resolve([]);
      return fetchTrazoInternCodesByCompanyId(companyId)
    },
    enabled: !!companyId,
  });
}
