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
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
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
