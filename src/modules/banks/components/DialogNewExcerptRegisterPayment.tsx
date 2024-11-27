import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Coins, File } from "lucide-react";
import ImportBankExcerptForm from "./ImportBankExcerptForm";
import ImportBankExcerptRegisterPaymentForm from "./ImportBankExcerptRegisterPaymentForm";

export default function DialogNewExcerptRegisterPayment({
  bankExtractId,
}: {
  bankExtractId: string | number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Coins className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro de Pago</DialogTitle>
          <DialogDescription>
            Sube el registro de pagos
          </DialogDescription>
        </DialogHeader>
        <ImportBankExcerptRegisterPaymentForm bankExtractId={bankExtractId}/>
      </DialogContent>
    </Dialog>
  );
}
