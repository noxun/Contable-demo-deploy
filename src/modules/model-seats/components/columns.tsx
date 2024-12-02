"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ModelSeat } from "@/lib/types";
import EditModelSeatButton from "./EditModelSeatButton";
import DeleteModelSeatDialog from "./DeleteModelSeatDialog";

export const columns: ColumnDef<ModelSeat>[] = [
  {
    accessorKey: "description",
    header: "Descripciom",
  },
  {
    accessorKey: "typeTransaction",
    header: "Tipo de transaccion",
  },
  {
    accessorKey: "createdAt",
    header: "Creado el",
  },
  {
    accessorKey: "updatedAt",
    header: "Actualizado el",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const modelSeat = row.original;
      return (
        <div className="flex justify-center gap-4 items-center">
          <EditModelSeatButton modelSeat={modelSeat} />
          <DeleteModelSeatDialog modelSeatId={modelSeat.id} />
        </div>
      );
    },
  },
];
