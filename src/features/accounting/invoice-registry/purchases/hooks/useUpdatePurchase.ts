import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchasesService } from "../services/purchasesService";
import { toast } from "sonner";

export function useUpdatePurchaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchasesService.updatePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PurchasesList"] });
      toast.success("Compra editada exitosamente");
    },
    onError: (error) => {
      console.error("Error al editar la compra:", error);
      toast.error("Error al editar la compra");
    },
  });
}
