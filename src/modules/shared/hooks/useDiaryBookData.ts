"use client";

import { fetchDiaryBookData } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useDiaryBookData(
  InitDate: string,
  EndDate: string,
  inSus: boolean,
  isEnabled: boolean,
  sucursalID?: string
) {
  return useQuery({
    queryKey: ["DiaryBookData", InitDate, EndDate, inSus, sucursalID],
    queryFn: () => fetchDiaryBookData(InitDate, EndDate, inSus, sucursalID),
    enabled: isEnabled,
  });
}
