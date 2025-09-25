import { generateDiaryBookExcel } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useDiaryBookExcel(
  initDate: string,
  endDate: string,
  inSus: boolean,
  isEnabled: boolean,
  sucursalId?: string
) {
  return useQuery({
    queryKey: ["DiaryBookExcel", initDate, endDate, inSus, sucursalId],
    queryFn: () => generateDiaryBookExcel(initDate, endDate, inSus, sucursalId),
    enabled: isEnabled,
  });
}
