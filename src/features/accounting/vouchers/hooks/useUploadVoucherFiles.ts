import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { voucherFileService } from "../services/voucherFileService";
import type { UploadVoucherFiles } from "../schemas/voucherFileSchema";

export function useUploadVoucherFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherFileService.uploadFiles,
    onSuccess: (data, variables) => {
      toast.success("Files uploaded successfully");
      // Invalidate the voucher files query to refetch the list
      queryClient.invalidateQueries({
        queryKey: ["voucherFiles", variables.voucherId],
      });
    },
    onError: (error) => {
      toast.error("Failed to upload files", {
        description: error instanceof Error ? error.message : "An error occurred",
      });
    },
  });
}