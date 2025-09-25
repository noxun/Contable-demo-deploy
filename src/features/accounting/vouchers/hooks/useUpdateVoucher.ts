import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVoucher } from "../services/voucherService";
import { toast } from "sonner";

export function useUpdateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVoucher,
    onSuccess: (_, variables) => {
      console.log("Voucher edited successfully:");
      toast.success("Transacción editada correctamente");
      queryClient.invalidateQueries({
        queryKey: ["Vouchers", variables.id, variables.type],
      });
    },
    onError: (error) => {
      console.error("Error editing voucher:", error);
      toast.error("Error al editar la transacción");
    },
  });
}
