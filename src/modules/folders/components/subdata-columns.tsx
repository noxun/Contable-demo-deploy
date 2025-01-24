"use client";

import { Badge } from "@/components/ui/badge";
import { SubData } from "@/lib/trazoTypes";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ChangeReceiptStatusButton from "./ChangeReceiptStatusButton";

export function columns(procedureId: number): ColumnDef<SubData>[] {
  return [
    {
      accessorKey: "label",
      header: "Nombre",
    },
    {
      accessorKey: "recibo",
      header: "Recibo",
      cell: ({ row }) => {
        const recibo = row.original.recibo;
        return (
          <Badge
            className={cn("bg-red-500", {
              "bg-green-500": recibo,
            })}
          >
            {recibo ? "Si" : "No"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Proforma",
    },
    {
      accessorKey: "description2",
      header: "Planilla",
    },
    {
      accessorKey: "observation",
      header: "Diferencia",
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const subData = row.original;
        return (
          <div>
            <ChangeReceiptStatusButton
              subDataId={subData.id}
              procedureId={procedureId}
            />
          </div>
        );
      },
    },
  ];
}
