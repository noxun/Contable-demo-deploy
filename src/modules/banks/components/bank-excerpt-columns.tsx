"use client";

import { Button } from "@/components/ui/button";
import { BankExcerpt } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<BankExcerpt>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "bankId",
    header: "Id del banco",
  },
  {
    accessorKey: "createdAt",
    header: "Creado el",
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      const bankExcerpt = row.original;
      return (
        <Button asChild>
          <Link href={`/dashboard/banks/extract/${bankExcerpt.id}`}>Ver Detalles</Link>
        </Button>
      );
    },
  },
];
