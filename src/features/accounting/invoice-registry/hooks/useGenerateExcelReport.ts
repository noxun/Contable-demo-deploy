import { useMutation } from "@tanstack/react-query";
import { invoiceRegistryService } from "../services/invoiceRegistryService";
import { toast } from "sonner";
import { useInvoiceFilters } from "./useInvoiceFilters";

export function useGenerateExcelReport() {
  const { filters } = useInvoiceFilters();

  return useMutation({
    mutationFn: (type: "sale" | "buy") =>
      invoiceRegistryService.generateExcelReport(
        type,
        filters.applyVoucher,
        filters.orderByDesc,
        filters?.initDate ?? undefined,
        filters?.endDate ?? undefined
      ),
    onError: (error, variables) => {
      console.error(
        `Error generating Excel report of type ${variables}:`,
        error
      );
      toast.error("Error al generar el reporte Excel");
    },
    onSuccess: (data) => {
      toast.success("Reporte Excel generado exitosamente");
      if (typeof window !== "undefined") {
        const link = document.createElement("a");
        link.href = data;
        link.download = `reporte-${Date.now()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  });
}
