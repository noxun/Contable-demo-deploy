import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVoucher } from "../services/voucherService";
import { toast } from "sonner";
import { useChangeBankExtractStatus } from "../../banks/hooks/useChangeBankExtractStatus";

export function useCreateVoucher() {
  const queryClient = useQueryClient();
  const changeBankExtractStatusMutation = useChangeBankExtractStatus();

  return useMutation({
    mutationFn: createVoucher,
    onSuccess: (_, variables) => {
      console.log("Voucher created successfully:");
      toast.success("Transacción creada correctamente");
      if (variables.bankId && variables.bankItemRef) {
        changeBankExtractStatusMutation.mutate(variables.bankItemRef);
        queryClient.invalidateQueries({
          queryKey: ["bankExcerpt", variables.bankId],
          exact: false,
        });
      }
    },
    onError: (error) => {
      console.error("Error creating voucher:", error);
      toast.error("Error al crear la transacción");
    },
  });
}
