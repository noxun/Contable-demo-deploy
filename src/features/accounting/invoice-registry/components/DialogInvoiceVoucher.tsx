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
import { PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { useState } from "react";

export default function DialogInvoiceVoucher({
  invoiceRegistryId,
}: {
  invoiceRegistryId: number;
}) {
  const [open, setOpen] = useState(false);

  const { data: invoiceVoucher, isLoading } = useQuery({
    queryKey: ["invoiceVoucher", invoiceRegistryId],
    queryFn: () => fetchInvoiceVoucherDetailsById(invoiceRegistryId),
    enabled: open,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <ReceiptText className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprobante</DialogTitle>
          <DialogDescription>
            Este modal muestra el comprobante de la factura
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <PDFViewer className="w-full h-full rounded-lg">
            {/* document here */}
          </PDFViewer>
        )}
      </DialogContent>
    </Dialog>
  );
}
