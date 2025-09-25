import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { voucherFileService } from "../services/voucherFileService";

export function useDeleteVoucherFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => voucherFileService.deleteFile(fileId),
    onSuccess: () => {
      toast.success("File deleted successfully");
      // Invalidate all voucher files queries to refetch the lists
      queryClient.invalidateQueries({
        queryKey: ["voucherFiles"],
      });
    },
    onError: (error) => {
      toast.error("Failed to delete file", {
        description: error instanceof Error ? error.message : "An error occurred",
      });
    },
  });
}