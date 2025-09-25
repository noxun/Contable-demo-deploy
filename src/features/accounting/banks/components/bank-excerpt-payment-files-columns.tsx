"use client";

import { BankExtractPaymentFile } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
export const columns: ColumnDef<BankExtractPaymentFile>[] = [
  {
    accessorKey: "number",
    header: "Numero",
  },
  {
    accessorKey: "providor",
    header: "Proveedor",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "urlFile",
    header: "Archivo",
    cell: ({ row }) => {
      const paymentFile = row.original;
      return (
        <Link href={paymentFile.urlFile} prefetch={false} download>
          Descargar
        </Link>
      );
    },
  },
];
