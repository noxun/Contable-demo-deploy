"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BankExcerpt } from "@/lib/types";
import { FormCreateOrUpdateVoucher } from "../../vouchers/components/FormCreateOrUpdateVoucher";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";
import { addDays, format, parse, set } from "date-fns";

type Props = {
  bankExtract: BankExcerpt;
  bankId: number;
  bankAccountId: number;
  disabled?: boolean;
};

export default function DialogAdvancedExtractRegistry({
  bankExtract,
  bankAccountId,
  bankId,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const defaultValues = useMemo(() => {
    const parsedDate = parse(bankExtract.date, "d/M/yyyy HH:mm:ss", new Date());
    const adjustedDate = addDays(parsedDate, 1);
    return {
      voucherDate: format(adjustedDate, "yyyy-MM-dd"),
      gloss: bankExtract.glossInExtract,
      hojaDeRuta: bankExtract.internCode,
      type: bankExtract.type,
      bankId,
      bankItemRef: bankExtract.id,
      items: [
        {
          accountId: bankAccountId,
          debitBs: bankExtract.amount > 0 ? bankExtract.amount : 0,
          assetBs: bankExtract.amount < 0 ? -bankExtract.amount : 0,
          debitSus: 0,
          assetSus: 0,
          gloss: bankExtract.glossInExtract,
          description: null,
          typeOfExpense: null,
          voucherId: 0,
          carpeta: null,
        },
        {
          accountId: bankExtract.accountId,
          debitBs: bankExtract.amount < 0 ? -bankExtract.amount : 0,
          assetBs: bankExtract.amount > 0 ? bankExtract.amount : 0,
          debitSus: 0,
          assetSus: 0,
          gloss: bankExtract.glossInExtract,
          description: null,
          typeOfExpense: null,
          voucherId: 0,
          carpeta: null,
        },
      ],
    };
  }, [bankExtract, bankId, bankAccountId]);

  function handleOnSuccess() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={disabled}
          title="Registro Avanzado"
        >
          <ReceiptText className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registro Avanzado de Extracto Bancario</DialogTitle>
          <DialogDescription>
            Registro avanzado para el extracto bancario seleccionado.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <FormCreateOrUpdateVoucher
            mode="create"
            onSuccess={handleOnSuccess}
            defaultValues={defaultValues}
            enableSelectPortals={false}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
