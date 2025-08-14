import { fetchTrazoInternCodes } from "@/lib/data";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useTrazoInternCodes(
  page: number,
  pageSize: number,
  searchQuery: string,
  nameQuery: string,
) {
  return useQuery({
    queryKey: ["trazoInternCodes", page, pageSize, searchQuery, nameQuery],
    queryFn: () => fetchTrazoInternCodes(page, pageSize, searchQuery, nameQuery),
    placeholderData: keepPreviousData,
    retryDelay: 5000,
  });
}
