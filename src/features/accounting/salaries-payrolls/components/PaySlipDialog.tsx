"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { ReceiptText } from "lucide-react";
import { useState } from "react";
import PaySlipDocument from "./PaySlipDocument";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import usePaySlipData from "@/features/accounting/shared/hooks/usePaySlipData";

type PaySlipDialogProps = {
  idSalaryWages: number;
  datePaySlip: string;
};

export default function PaySlipDialog({
  idSalaryWages,
  datePaySlip,
}: PaySlipDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    data: paySlip,
    isLoading,
    isError,
  } = usePaySlipData(idSalaryWages, datePaySlip, open);

  if (isError) {
    return <div>Error al cargar la boleta de pago</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Boleta de Pago"
          className="p-1 text-blue-500 rounded-full"
          aria-label="Boleta de Pago"
        >
          <ReceiptText className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] h-[80%]">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Boleta de Pago</DialogTitle>
            <DialogDescription>
              Esta es la boleta de pago de la persona seleccionada
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        {isLoading || paySlip === undefined ? (
          <div>Cargando...</div>
        ) : (
          <PDFViewer className="w-full h-full">
            <PaySlipDocument data={paySlip} />
          </PDFViewer>
        )}
      </DialogContent>
    </Dialog>
  );
}
