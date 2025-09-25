import { numberToLiteral } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useNumberToLiteral(number: number, inSus: boolean = false) {
  return useQuery({
    queryKey: ["numberToLiteral", number, inSus],
    queryFn: () => numberToLiteral(number, inSus),
    enabled: !!number && number > 0,
  })
}