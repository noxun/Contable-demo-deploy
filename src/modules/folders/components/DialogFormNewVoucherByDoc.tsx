"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegisterVoucherByDocumentResponse } from "@/lib/types";
import FormNewVoucherWithTypeSelect from "@/modules/shared/components/FormNewVoucherWithTypeSelect";
import { Dispatch, SetStateAction, useState } from "react";

type DialogFormNewVoucherByDocProps = {
  isOpen: boolean;
  voucher: RegisterVoucherByDocumentResponse
}

export default function DialogFormNewVoucherByDoc(
  { isOpen = false, voucher }: DialogFormNewVoucherByDocProps
) {

  const [open, setOpen] = useState(isOpen);


  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Voucher</DialogTitle>
          <DialogDescription>
            Formulario para registrar un nuevo voucher
          </DialogDescription>
        </DialogHeader>
        <FormNewVoucherWithTypeSelect/>
      </DialogContent>
    </Dialog>
  );
}
