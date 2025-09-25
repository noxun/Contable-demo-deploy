import { ColumnDef } from "@tanstack/react-table";
import { Receipt } from "../schemas/receiptSchema";
import { DeleteReceiptButton } from "./DeleteReceiptButton";
import { CreateOrUpdateReceiptFormDialog } from "./CreateOrUpdateReceiptFormDialog";

import PdfReceipt from "./PdfReceipts";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "num",
    header: "Número",
  },
  {
    accessorKey: "concept",
    header: "Concepto",
  },
  {
    accessorKey: "amountBs",
    header: "Monto Bs",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountBs"));
      const formatted = new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "amountSus",
    header: "Monto $US",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountSus"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "receiverName",
    header: "Receptor",
  },
  {
    accessorKey: "payerName",
    header: "Pagador",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString("es-BO")}</div>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const receipt = row.original;
      return (
        <div className="flex items-center gap-2">
          <CreateOrUpdateReceiptFormDialog mode="edit" receipt={receipt} />
          <DeleteReceiptButton receiptId={receipt.id} />
          <PdfReceipt receipt={receipt} trigger={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      );
    },
  },
];
