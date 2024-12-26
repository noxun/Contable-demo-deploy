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
import FormNewVoucherWithTypeSelect from "@/modules/shared/components/FormNewVoucherWithTypeSelect";
import { ReceiptText } from "lucide-react";

type DialogFormNewVoucherProps = {
  bankId: string;
  bankExtractId: number;
  disabled?: boolean;
};

export default function DialogFormNewVoucher({
  bankId,
  bankExtractId,
  disabled,
}: DialogFormNewVoucherProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled}>
          <ReceiptText className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Transaccion</DialogTitle>
          <DialogDescription>Modal para nueva transacción</DialogDescription>
        </DialogHeader>
        <FormNewVoucherWithTypeSelect bankId={bankId} bankExtractId={bankExtractId} />
      </DialogContent>
    </Dialog>
  );
}
