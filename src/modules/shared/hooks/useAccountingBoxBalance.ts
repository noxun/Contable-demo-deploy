import { getAccountingBoxBalance } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useAccountingBoxBalance(
  accountingBoxId: number | null | undefined
) {
  return useQuery({
    queryKey: ["accountingBoxBalance", accountingBoxId],
    queryFn: () => {
      if (accountingBoxId) {
        return getAccountingBoxBalance(accountingBoxId);
      }
    },
    enabled: !!accountingBoxId,
  });
}
