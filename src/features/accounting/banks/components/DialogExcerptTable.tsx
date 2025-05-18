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
      <DialogContent className="min-w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Extracto de Banco</DialogTitle>
          <DialogDescription>Tabla del extracto del Banco</DialogDescription>
        </DialogHeader>
        {/* <ListBankExcerptData bankId={bankId} /> */}
      </DialogContent>
    </Dialog>
  );
}
