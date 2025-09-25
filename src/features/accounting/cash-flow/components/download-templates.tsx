// components/download-templates-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  exportBalanceSheetXlsx,
  exportStatementIncomeXlsx,
} from "@/features/accounting/cash-flow/services/service";

function downloadFile(url: string, filename: string) {
  return new Promise<void>((resolve) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Clean up after a short delay to ensure download started
    setTimeout(() => {
      document.body.removeChild(link);
      resolve();
    }, 100);
  });
}

export function DownloadTemplatesButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadTemplates = async () => {
    setIsLoading(true);
    try {
      toast.info("Descargando plantillas...");

      // Download each template sequentially to avoid race conditions
      try {
        const balanceSheetData = await exportBalanceSheetXlsx();
        if (balanceSheetData) {
          await downloadFile(balanceSheetData, "Balance-Sheet.xlsx");
          // Small delay between downloads
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error("Error downloading Balance Sheet:", error);
      }

      try {
        const incomeStatementData = await exportStatementIncomeXlsx();
        if (incomeStatementData) {
          await downloadFile(incomeStatementData, "Income-Statement.xlsx");
        }
      } catch (error) {
        console.error("Error downloading Income Statement:", error);
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
