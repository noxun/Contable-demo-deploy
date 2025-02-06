"use client";

import { Button } from "@/components/ui/button";
import useDiaryBookExcel from "@/modules/shared/hooks/useDiaryBookExcel";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export default function DiaryBookExcelButton({
  dateRange,
  inSus,
}: {
  dateRange: DateRange;
  inSus: boolean;
}) {
  //TODO ESTE COMPONENTE ASUME QUE LA FECHA DE INICIO Y FIN ESTAN DEFINIDAS

  const initDate = format(dateRange.from!, "yyyy/MM/dd");
  const endDate = format(dateRange.to!, "yyyy/MM/dd");

  const {
    data: excelLink,
    isLoading,
    isError,
  } = useDiaryBookExcel(initDate, endDate, inSus, true);

  if (isError) return <Button disabled>Error</Button>;

  return (
    <Button disabled={isLoading} asChild={!isLoading}>
      <a download href={excelLink}>
        {isLoading ? "Descargando..." : "Descargar Excel"}
      </a>
    </Button>
  );
}
