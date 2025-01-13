"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProcedureDataset from "@/modules/shared/hooks/useProcedureDataset";
import { useState } from "react";

type SheetDatasetProps = {
  procedureId: number;
}

export default function SheetDataset({procedureId}: SheetDatasetProps) {

  const [open, setOpen] = useState(false);

  const {data: procedureDataset, isLoading, isError} = useProcedureDataset(procedureId);

  if(isError){
    return <div>Hubo un error al obtener los datos del dataset</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Datasets</SheetTitle>
          <SheetDescription>
            Datasets de la planilla
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
