"use client";

import { Button } from "@/components/ui/button";
import { useExportAccountsToExcel } from "../hooks/useExportAccountsToExcel";

export function AccountExportToExcelButton() {
  const exportAccountsToExcelMutation = useExportAccountsToExcel();

  const handleExport = () => {
    exportAccountsToExcelMutation.mutate();
  };

  return (
    <Button
      onClick={handleExport}
      disabled={exportAccountsToExcelMutation.isPending}
    >
      {exportAccountsToExcelMutation.isPending
        ? "Exportando..."
        : "Exportar Plan de Cuentas a Excel"}
    </Button>
  );
}
