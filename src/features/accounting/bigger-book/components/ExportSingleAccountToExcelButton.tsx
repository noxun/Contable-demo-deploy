"use client";

import { Button } from "@/components/ui/button";
import { exportSingleAccountDataToExcel } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type Props = {
  account: any;
  initDate: string;
  endDate: string;
  inSus: boolean;
};

export default function ExportSingleAccountToExcelButton({
  account,
  initDate,
  endDate,
  inSus,
}: Props) {
  const exportSingleAccountToExcelMutation = useMutation({
    mutationFn: exportSingleAccountDataToExcel,
    onError: (error: AxiosError) => {
      console.error("Error exporting account data to Excel:", error);
      toast.error("Error exporting account data to Excel");
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        const link = document.createElement("a");
        link.href = data;
        link.download = "SingleAccountReport.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  });

  const handleClick = () => {
    exportSingleAccountToExcelMutation.mutate({
      account,
      initDate,
      endDate,
      inSus,
    });
  };

  return (
    <Button onClick={handleClick} disabled={exportSingleAccountToExcelMutation.isPending}>
      Descargar Excel de la Cuenta Activa
    </Button>
  );
}
