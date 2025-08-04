import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVoucher } from "../services/voucherService";
import { toast } from "sonner";

export function useCreateVoucher() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      console.log("Voucher created successfully:");
      toast.success("Transacción creada correctamente");
    },
    onError: (error) => {
      console.error("Error creating voucher:", error);
      toast.error("Error al crear la transacción");
    },
  });
}
