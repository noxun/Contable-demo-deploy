"use client";
import { Button } from "@/components/ui/button";
import { useGenerateExcelReport } from "../hooks/useGenerateExcelReport";

export function ButtonGenerateExcelReport({ type }: { type: "sale" | "buy" }) {
  const generateExcelReportMutation = useGenerateExcelReport();

  function handleClick() {
    generateExcelReportMutation.mutate(type);
  }

  return (
    <Button
      onClick={handleClick}
      disabled={generateExcelReportMutation.isPending}
    >
      {generateExcelReportMutation.isPending
        ? "Generando..."
        : `Reporte ${type === "sale" ? "Venta" : "Compra"} Excel`}
    </Button>
  );
}
