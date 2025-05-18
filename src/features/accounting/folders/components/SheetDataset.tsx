"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProcedureDataset from "@/features/accounting/shared/hooks/useProcedureDataset";
import { useState } from "react";
import ProcedureTablesList from "./ProcedureTablesList";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import usePayrollData from "@/features/accounting/shared/hooks/usePayrollData";

type SheetDatasetProps = {
  procedureId: number;
  value: string;
};

export default function SheetDataset({
  procedureId,
  value,
}: SheetDatasetProps) {
  const [open, setOpen] = useState(false);

  const {
    data: procedureDataset,
    isLoading,
    isError,
  } = useProcedureDataset(procedureId, open);

  const {
    data: payrollData,
    isError: isErrorPayRoll,
    isLoading: isLoadingPayRoll,
  } = usePayrollData(procedureId, open);

  if (isError || isErrorPayRoll) {
    return <div>Hubo un error al obtener los datos del dataset</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <Coins className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[60%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Planillaje y Facturacion Contable</SheetTitle>
          <SheetDescription>Datos de la planilla</SheetDescription>
        </SheetHeader>
        {isLoading ||
        isLoadingPayRoll ||
        procedureDataset === undefined ||
        payrollData === undefined ? (
          <div>Cargando...</div>
        ) : (
          <ProcedureTablesList
            procedureDataset={procedureDataset}
            value={value}
            totalProformaBs={payrollData.totalProformaBs}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
