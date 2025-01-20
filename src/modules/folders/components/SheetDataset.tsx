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
import ProcedureTablesList from "./ProcedureTablesList";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

type SheetDatasetProps = {
  procedureId: number;
};

export default function SheetDataset({ procedureId }: SheetDatasetProps) {
  const [open, setOpen] = useState(false);

  const {
    data: procedureDataset,
    isLoading,
    isError,
  } = useProcedureDataset(procedureId, open);

  if (isError) {
    return <div>Hubo un error al obtener los datos del dataset</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
      <Button size="icon" variant="outline">
          <Coins className="size-4"/>
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[50%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Datasets</SheetTitle>
          <SheetDescription>Datasets de la planilla</SheetDescription>
        </SheetHeader>
        {isLoading || procedureDataset === undefined ? (
          <div>Cargando...</div>
        ) : (
          <ProcedureTablesList procedureDataset={procedureDataset} />
        )}
      </SheetContent>
    </Sheet>
  );
}
