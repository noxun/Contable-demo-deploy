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
import { BiggerBookTemplate } from "@/modules/shared/components/templatePDF/BiggerBook";
import useBiggerBookDataByAccountCode from "@/modules/shared/hooks/useBiggerBookDataByAccountCode";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";

export default function BiggerBookByAccountCodeDialog({
  accountCode,
}: {
  accountCode: string;
}) {
  const [open, setOpen] = useState(false);

  const {
    data: biggerBook,
    isError,
    isLoading,
  } = useBiggerBookDataByAccountCode(accountCode, open);

  if (isError) {
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Libro Mayor</Button>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-[80%] h-[80%]">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Libro Mayor del banco</DialogTitle>
            <DialogDescription>
              Datos del libro mayor del banco
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        <div>Hubo un error al obtener los datos del libro mayor</div>
      </DialogContent>
    </Dialog>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Libro Mayor</Button>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-[80%] h-[80%]">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Libro Mayor del banco</DialogTitle>
            <DialogDescription>
              Datos del libro mayor del banco
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        {isLoading || biggerBook === undefined ? (
          <div>Cargando...</div>
        ) : (
          <PDFViewer className="w-full h-full">
            <BiggerBookTemplate inSus={false} records={biggerBook} />
          </PDFViewer>
        )}
      </DialogContent>
    </Dialog>
  );
}
