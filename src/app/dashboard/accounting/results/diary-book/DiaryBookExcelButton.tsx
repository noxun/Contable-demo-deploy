"use client";

import { Button } from "@/components/ui/button";
import useDiaryBookExcel from "@/features/accounting/shared/hooks/useDiaryBookExcel";
import { format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

export default function DiaryBookExcelButton({
  dateRange,
  inSus,
  sucursalId
}: {
  dateRange: DateRange;
  inSus: boolean;
  sucursalId?: string;
}) {
  const initDate = format(dateRange.from!, "yyyy/MM/dd");
  const endDate = format(dateRange.to!, "yyyy/MM/dd");

  const {
    refetch,
    isLoading,
    isError,
  } = useDiaryBookExcel(initDate, endDate, inSus, false, sucursalId);

  if (isError) return <Button disabled>Error</Button>;
  const handleOnClick = async () => {
    try {
      const { data: linkExcel } = await refetch()

      if (!linkExcel) {
        throw new Error();
      }

      const link = document.createElement("a");
      link.href = linkExcel;
      toast.success('Archivo generado...')
      link.click();
    } catch (error) {
      console.error("Error al generar el archivo:", error);
      toast.error('Error al generar el archivo.');
    }

  }

  return (
    <Button className="flex gap-2 items-center" onClick={handleOnClick} disabled={isLoading}>
      {isLoading ? (
        <><LoaderIcon className="animate-spin" />Cargando...</>
      )
        : "Generar Excel"}
    </Button>
  );
}
