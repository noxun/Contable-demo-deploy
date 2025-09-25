"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkSheet } from "./WorkSheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { workSheetDataQueryOptions } from "../hooks/useWorkSheetData";

export function DialogWorkSheet() {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    enabled: open,
    ...workSheetDataQueryOptions(),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Hoja de Trabajo</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] overflow-y-auto h-[90%]">
        <DialogHeader>
          <DialogTitle>Hoja de Trabajo</DialogTitle>
          <DialogDescription>
            Hoja de trabajo del flujo de efectivo.
          </DialogDescription>
        </DialogHeader>
        {isError && <div>Error al cargar los datos.</div>}
        {isLoading || !data ? (
          <div>Cargando...</div>
        ) : (
          <WorkSheet workSheetData={data} />
        )}
      </DialogContent>
    </Dialog>
  );
}
