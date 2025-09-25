"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BiggerBookTemplate } from "@/features/accounting/shared/components/templatePDF/BiggerBook";
import { AccountData } from "../types";

interface ReportGenerateBiggerBookProps {
  data: AccountData[];
  dateRange?: DateRange;
  setFile: (file: JSX.Element | null) => void;
  inSus: boolean;
  text?: string;
  className?: string;
}

export const ReportGenerateBiggerBook = ({
  data,
  dateRange,
  setFile,
  inSus,
  text,
  className,
}: ReportGenerateBiggerBookProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      toast("Generando reporte...");
      const MyDocument = (
        <BiggerBookTemplate
          inSus={inSus}
          dateRange={dateRange}
          records={data}
        />
      );
      setFile(MyDocument);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button className={className} onClick={handleGenerateReport}>
        {isLoading ? "Generando PDF..." : text ? text : "Generar PDF"}
      </Button>
    </>
  );
};
