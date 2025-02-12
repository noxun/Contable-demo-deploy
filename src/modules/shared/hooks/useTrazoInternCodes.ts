import { fetchTrazoInternCodes } from "@/lib/data";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useTrazoInternCodes(
  page: number,
  pageSize: number,
  searchQuery: string
) {
  return useQuery({
    queryKey: ["trazoInternCodes", page, pageSize, searchQuery],
    queryFn: () => fetchTrazoInternCodes(page, pageSize, searchQuery),
    placeholderData: keepPreviousData,
  });
}
