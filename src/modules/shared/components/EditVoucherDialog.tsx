"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditVoucher from "./EditVoucher";
import { VoucherType } from "../types/sharedTypes";
import { Button } from "@/components/ui/button";

type EditVoucherDialogProps = {
  id: number; //voucherId
  type: number;
  accountDate?: string;
  accountCode?: string;
};

export default function EditVoucherDialog({
  id,
  type,
  accountDate,
  accountCode,
}: EditVoucherDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Editar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <h2 className="text-lg font-bold">Formulario para editar voucher</h2>
        <EditVoucher
          id={id.toString()}
          type={type.toString() as VoucherType}
          accountDate={JSON.stringify(accountDate)}
          accountCode={accountCode}
        />
      </DialogContent>
    </Dialog>
  );
}
