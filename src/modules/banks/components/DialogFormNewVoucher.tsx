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
import { VoucherItemFromExtractedPDF } from "@/lib/types";
import FormNewVoucherWithTypeSelect from "@/modules/shared/components/FormNewVoucherWithTypeSelect";
import useVoucherItemsFromExtractedPDF from "@/modules/shared/hooks/useVoucherItemsFromExtractedPDF";
import { ReceiptText } from "lucide-react";
import { useState } from "react";

type DialogFormNewVoucherProps = {
  bankAccountId?: string;
  amountFromExtract?: number;
  bankId: string;
  bankExtractId: number;
  disabled?: boolean;
  gloss?: string;
};

export default function DialogFormNewVoucher({
  bankAccountId,
  amountFromExtract,
  bankId,
  bankExtractId,
  disabled,
  gloss,
}: DialogFormNewVoucherProps) {
  const [open, setOpen] = useState(false);

  const {
    data: voucherItemsPDF,
    isLoading,
    isError,
  } = useVoucherItemsFromExtractedPDF(bankExtractId, open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled} title="Registro Avanzado">
          <ReceiptText className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Transacción</DialogTitle>
          <DialogDescription>Modal para nueva transacción</DialogDescription>
        </DialogHeader>
        {isError && <div>Error al cargar los items</div>}
        {isLoading ? (
          <div>Cargando items...</div>
        ) : (
          <FormNewVoucherWithTypeSelect
            bankAccountId={bankAccountId}
            amountFromExtract={amountFromExtract}
            bankId={bankId}
            bankExtractId={bankExtractId}
            gloss={gloss}
            voucherItemsFromExtractedPDF={voucherItemsPDF}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
