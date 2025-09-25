import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchasesService } from "../services/purchasesService";
import { toast } from "sonner";

export function useCreatePurchaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchasesService.postPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PurchasesList"] });
      toast.success("Compra creada exitosamente");
    },
    onError: (error) => {
      console.error("Error al crear la compra:", error);
      toast.error("Error al crear la compra");
    },
  });
}
