// components/download-templates-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  exportStatementIncomeXlsx,
  exportBalanceSheetXlsx,
} from "@/lib/data";
import { useState } from "react";
import { toast } from "sonner";

export function DownloadTemplatesButton() {
  const [isLoading, setIsLoading] = useState(false);

  const { refetch: refetchBalanceSheetXlsx } = useQuery({
    queryKey: ["BalanceSheetXlsx"],
    queryFn: () => exportBalanceSheetXlsx(),
    enabled: false,
  });

  const { refetch: refetchStatementIncomeXlsx } = useQuery({
    queryKey: ["StatementIncomeXlsx"],
    queryFn: () => exportStatementIncomeXlsx(),
    enabled: false,
  });

  function downloadBlobFile(data: Blob, filename: string) {
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  const handleDownloadTemplates = async () => {
    setIsLoading(true);
    try {
      toast.info("Descargando plantillas...");
      
      // Descargar ambas plantillas en paralelo
      await Promise.all([
        refetchBalanceSheetXlsx().then(({ data }) => {
          if (data) downloadBlobFile(data, "Balance-Sheet.xlsx");
        }),
        refetchStatementIncomeXlsx().then(({ data }) => {
          if (data) downloadBlobFile(data, "Income-Statement.xlsx");
        }),
      ]);
      
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