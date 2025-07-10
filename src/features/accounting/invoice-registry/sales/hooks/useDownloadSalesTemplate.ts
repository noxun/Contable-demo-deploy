import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { saleService } from "../services/saleService";

export function useDownloadSalesTemplate() {
  return useMutation({
    mutationFn: saleService.downloadSalesTemplate,
    onSuccess: (data) => {
      // Create blob URL and download
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plantilla-ventas.xlsx';
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Plantilla de ventas descargada exitosamente");
    },
    onError: (error) => {
      console.error("Error downloading sales template:", error);
      toast.error("Error al descargar la plantilla de ventas");
    },
  });
}
