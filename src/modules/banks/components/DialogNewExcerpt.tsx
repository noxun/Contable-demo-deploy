import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { File } from "lucide-react";
import ImportBankExcerptForm from "./ImportBankExcerptForm";
import { useState } from "react";

export default function DialogNewExcerpt({
  bankId,
}: {
  bankId: string | number;
}) {

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <File className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extracto de Banco</DialogTitle>
          <DialogDescription>
            Sube el extracto del banco seleccionado
          </DialogDescription>
        </DialogHeader>
        <ImportBankExcerptForm setOpen={setOpen} bankId={bankId} />
      </DialogContent>
    </Dialog>
  );
}
