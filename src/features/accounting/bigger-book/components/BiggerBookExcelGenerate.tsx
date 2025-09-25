"use client";

import { format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { getBigguerBookinExcel } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface BiggerBookExcelGenerateProps {
  dateRange: DateRange;
  inSus: boolean;
  search: string;
  sucursalId?: string;
}

export const BiggerBookExcelGenerate = ({
  dateRange,
  search,
  inSus,
  sucursalId,
}: BiggerBookExcelGenerateProps) => {
  const initialDate = dateRange.from && format(dateRange.from, "yyyy-MM-dd");
  const finallyDate = dateRange.to && format(dateRange.to, "yyyy-MM-dd");

  const { refetch, isLoading } = useQuery({
    queryKey: [dateRange, search, sucursalId],
    queryFn: () =>
      getBigguerBookinExcel({
        initDate: initialDate,
        endDate: finallyDate,
        search: search,
        inSus,
        sucursalId,
      }),
    enabled: false,
  });

  const handleOnClick = async () => {
    toast.info("Generando Excel...");

    try {
      const { data: linkExcel } = await refetch();
      const fileUrl =
        linkExcel instanceof Blob ? URL.createObjectURL(linkExcel) : linkExcel;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "BookBiggerData.xlsx";
      toast.success("Archivo generado...");
      link.click();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      toast.error("Error al descargar el archivo.");
    }
  };

  return (
    <Button
      disabled={isLoading}
      className="flex gap-2 items-center"
      onClick={handleOnClick}
    >
      {isLoading ? (
        <>
          <LoaderIcon className="animate-spin" />
          Cargando..
        </>
      ) : (
        "Generar Excel"
      )}
    </Button>
  );
};
