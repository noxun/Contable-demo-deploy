import { useQuery } from "@tanstack/react-query";
import { voucherFileService } from "../services/voucherFileService";

export function useVoucherFiles(voucherId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["voucherFiles", voucherId],
    queryFn: () => voucherFileService.getVoucherFiles(voucherId),
    enabled: enabled && !!voucherId,
  });
}