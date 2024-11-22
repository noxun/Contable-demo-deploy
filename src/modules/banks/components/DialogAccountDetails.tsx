import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { PDFViewer } from "@react-pdf/renderer";
import { NotebookTabs } from "lucide-react";
import AccountDetailsPdf from "./AccountDetailsPdf";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBankExtractAccountDetails } from "@/lib/data";

type DialogAccountDetailsProps = {
  bankExtractId: number;
  accountId: number;
};

export default function DialogAccountDetails({
  bankExtractId,
  accountId,
}: DialogAccountDetailsProps) {
  const [open, setOpen] = useState(false);

  const { data: accountDetails, isPending } = useQuery({
    queryKey: ["accountDetails", bankExtractId, accountId],
    queryFn: () => fetchBankExtractAccountDetails(bankExtractId, accountId),
    enabled: open,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title="Ver cuenta" size="icon" variant="outline">
          <NotebookTabs className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-[70%] h-[80%]">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Detalles de la cuenta</DialogTitle>
            <DialogDescription>
              Detalles de la cuenta relacionada al banco.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        {isPending ? (
          <div>Cargando...</div>
        ) : (
          <PDFViewer className="w-full h-full rounded-lg">
            <AccountDetailsPdf data={accountDetails} />
          </PDFViewer>
        )}
      </DialogContent>
    </Dialog>
  );
}
