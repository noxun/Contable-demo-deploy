import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchasesService } from "../services/purchasesService";
import { toast } from "sonner";

export function useApplyPurchaseAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchasesService.applyPurchaseAccount,
    onSuccess: () => {
      toast.success("Cuenta aplicada correctamente");
    },
    onError: (error) => {
      console.error("Error al aplicar cuenta:", error);
      toast.error(`Error al aplicar cuenta: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["PurchasesList"] });
    },
  });
}
