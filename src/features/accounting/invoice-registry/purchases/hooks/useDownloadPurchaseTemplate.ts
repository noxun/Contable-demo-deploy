import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { purchasesService } from "../services/purchasesService";

export function useDownloadPurchaseTemplate() {
  return useMutation({
    mutationFn: purchasesService.downloadPurchaseTemplate,
    onSuccess: (data) => {
      // Create blob URL and download
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plantilla-compras.xlsx';
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Plantilla de compras descargada exitosamente");
    },
    onError: (error) => {
      console.error("Error downloading purchase template:", error);
      toast.error("Error al descargar la plantilla de compras");
    },
  });
}
