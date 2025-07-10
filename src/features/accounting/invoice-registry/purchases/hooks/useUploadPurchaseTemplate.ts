import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchasesService } from "../services/purchasesService";
import { toast } from "sonner";

export function useUploadPurchaseTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchasesService.uploadPurchaseTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PurchasesList"],
      });
      toast.success("Plantilla de compras subida correctamente.");
    },
    onError: (error) => {
      console.error("Error uploading purchase template:", error);
      toast.error("Error al subir la plantilla de compras.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["PurchasesList"],
      });
    },
  });
}
