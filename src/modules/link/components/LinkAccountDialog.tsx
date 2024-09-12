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
import { AccountRelation } from "@/lib/types";
import LinkAccountForm from "./LinkAccountForm";


type LinkAccountDialogProps = {
  account: AccountRelation
}

export default function LinkAccountDialog({account}: LinkAccountDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Relacionar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Relacionar con cuenta SIAT</DialogTitle>
          <DialogDescription>
            Use este apartado para relacionar la cuenta seleccionada con una
            cuenta del SIAT
          </DialogDescription>
        </DialogHeader>
        <LinkAccountForm accountToLink={account}/>
      </DialogContent>
    </Dialog>
  );
}
