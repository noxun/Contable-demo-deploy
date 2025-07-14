// components/download-templates-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { exportBalanceSheetXlsx, exportStatementIncomeXlsx } from "@/features/accounting/cash-flow/services/service";

export function DownloadTemplatesButton() {
  const [isLoading, setIsLoading] = useState(false);

  function downloadFromUrl(url: string, filename: string) {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handleDownloadTemplates = async () => {
    setIsLoading(true);
    try {
      toast.info("Descargando plantillas...");
      
      // Fetch both templates in parallel but handle downloads sequentially
      const [balanceSheetData, incomeStatementData] = await Promise.all([
        exportBalanceSheetXlsx(),
        exportStatementIncomeXlsx(),
      ]);
      
      // Download files sequentially to avoid race conditions
      if (balanceSheetData) {
        downloadFromUrl(balanceSheetData, "Balance-Sheet.xlsx");
      }
      
      if (incomeStatementData) {
        downloadFromUrl(incomeStatementData, "Income-Statement.xlsx");
      }
      
      toast.success("Plantillas descargadas correctamente");
    } catch (error) {
      console.error("Error al descargar plantillas:", error);
      toast.error("Error al descargar plantillas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-fit flex gap-1 items-center"
      onClick={handleDownloadTemplates}
      title="Descargar ambas plantillas"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <LoaderIcon className="animate-spin h-4 w-4" />
          Descargando...
        </>
      ) : (
        "Descargar plantillas"
      )}
    </Button>
  );
}