"use client";

import { Button } from "@/components/ui/button";
import { BankExcerpt } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Save, PlaneIcon } from "lucide-react";
import AccountsSelect from "./AccountsSelect";

export const columns: ColumnDef<BankExcerpt>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "nroDocument",
    header: "Numero de Doc.",
  },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  {
    header: "Cuenta de banco",
    cell: ({ row }) => {
      return <AccountsSelect />;
    },
  },
  {
    accessorKey: "glossInExtract",
    header: "Glosa",
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Guardar como Asiento">
            <Save />
          </Button>
          <Button variant="outline" size="icon" title="Registrar en el trazo">
            <PlaneIcon />
          </Button>
        </div>
      );
    },
  },
];
