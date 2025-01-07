"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ModelSeat } from "@/lib/types";
import EditModelSeatButton from "./EditModelSeatButton";
import DeleteModelSeatDialog from "./DeleteModelSeatDialog";

export const columns: ColumnDef<ModelSeat>[] = [
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "type",
    header: "Tipo de transacción",
    cell: ({ row }) => {
      const modelSeat = row.original;
      return (
        <div>
          {modelSeat.type === 0
            ? "Traspaso"
            : modelSeat.type === 1 || modelSeat.type === 3
            ? "Egreso"
            : "Ingreso"}
        </div>
      );
    },
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
