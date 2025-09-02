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
import { BiggerBookTemplate } from "@/features/accounting/shared/components/templatePDF/BiggerBook";
import useBiggerBookDataByAccountCode from "@/features/accounting/shared/hooks/useBiggerBookDataByAccountCode";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { PDFViewer } from "@react-pdf/renderer";
import { AlertTriangle, FileX } from "lucide-react";
import { useState } from "react";

export default function BiggerBookByAccountCodeDialog({
  accountCode,
  triggerType,
  children,
}: {
  accountCode: string;
  triggerType: "button" | "link";
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const {
    data: biggerBook,
    isError,
    isLoading,
  } = useBiggerBookDataByAccountCode(accountCode, open);

  if (isError || biggerBook?.length === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerType === "button" ? (
            <Button>Libro Mayor A</Button>
          ) : (
            <a href="#" className="text-blue-500 underline">
              {children ?? "Libro Mayor E"}
            </a>
          )}
        </DialogTrigger>
        <DialogContent className="p-0 min-w-[80%] h-[80%]">
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle>Libro Mayor</DialogTitle>
              <DialogDescription>Datos del libro mayor</DialogDescription>
            </DialogHeader>
          </VisuallyHidden.Root>
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="mb-4">
              {isError ? (
                <AlertTriangle className="w-16 h-16 text-red-500" />
              ) : (
                <FileX className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                isError ? "text-red-700" : "text-gray-700"
              }`}
            >
              {isError ? "Error al cargar datos" : "Sin datos disponibles"}
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              {isError
                ? "Hubo un error al obtener los datos del libro mayor."
                : "No hay datos disponibles para esta cuenta en el período seleccionado."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerType === "button" ? (
          <Button>Libro Mayor</Button>
        ) : (
          <div className="text-blue-500 underline cursor-pointer">
            {children ?? "Libro Mayor"}
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="p-0 min-w-[80%] h-[80%]">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Libro Mayor</DialogTitle>
            <DialogDescription>Datos del libro mayor</DialogDescription>
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