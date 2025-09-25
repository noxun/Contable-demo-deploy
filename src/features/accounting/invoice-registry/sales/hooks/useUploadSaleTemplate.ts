import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { toast } from "sonner";
import { salesQueryConfig } from "./useSales";

export function useUploadSaleTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleService.uploadSaleTemplate,
    onSuccess: () => {
      toast.success("Plantilla de ventas subida exitosamente");
      queryClient.invalidateQueries(salesQueryConfig());
    },
    onError: (error) => {
      console.error("Error uploading sale template:", error);
      toast.error("Error al subir la plantilla de ventas");
    },
  });
}
