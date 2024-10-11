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
import ListBankExcerpt from "./ListBankExcerpt";

export default function DialogExcerptTable({
  bankId,
}: {
  bankId: string | number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <File className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extracto de Banco</DialogTitle>
          <DialogDescription>Tabla del extracto del Banco</DialogDescription>
        </DialogHeader>
        <ListBankExcerpt bankId={bankId} />
      </DialogContent>
    </Dialog>
  );
}
