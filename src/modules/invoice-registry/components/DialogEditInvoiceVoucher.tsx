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
import { fetchInvoiceVoucherDetailsById } from "@/lib/data";
import EditVoucher from "@/modules/shared/components/EditVoucher";
import { VoucherType } from "@/modules/shared/types/sharedTypes";
import { PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { FilePenLine, ReceiptText } from "lucide-react";
import { useState } from "react";

export default function DialogEditInvoiceVoucher({
  voucherId,
  type,
}: {
  voucherId: string | number;
  type: string | number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <FilePenLine className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprobante</DialogTitle>
          <DialogDescription>
            Este modal muestra el comprobante de la factura
          </DialogDescription>
        </DialogHeader>
        <EditVoucher id={voucherId as string} type={type as VoucherType} />
      </DialogContent>
    </Dialog>
  );
}
