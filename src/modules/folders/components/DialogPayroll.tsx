"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import usePayrollData from "@/modules/shared/hooks/usePayrollData";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";
import SettlementDocument from "./SettlementDocument";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Notebook } from "lucide-react";

export default function DialogPayroll({
  procedureId,
}: {
  procedureId: number;
}) {
  const [open, setOpen] = useState(false);

  const {
    data: payrollData,
    isError,
    isLoading,
  } = usePayrollData(procedureId, open);

  console.log(payrollData);

  if (isError) {
    return <div>Hubo un error al obtener la información</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Notebook className="size-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] min-h-[80%] p-0">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Planilla</DialogTitle>
            <DialogDescription>Esta es la planilla</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        {isLoading || payrollData === undefined ? (
          <div>Cargando...</div>
        ) : (
          <PDFViewer className="w-full h-full">
            <SettlementDocument data={payrollData} />
          </PDFViewer>
        )}
      </DialogContent>
    </Dialog>
  );
}
