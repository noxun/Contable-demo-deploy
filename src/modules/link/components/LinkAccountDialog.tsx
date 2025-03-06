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
import LinkAccountForm from "./LinkAccountForm";
import { RelationAccount } from "@/lib/types";
import { cn } from "@/lib/utils";


type LinkAccountDialogProps = {
  account: RelationAccount;
  triggerClassName?: string;
}

export default function LinkAccountDialog({account, triggerClassName}: LinkAccountDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn("", triggerClassName)}>Relacionar</Button>
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
