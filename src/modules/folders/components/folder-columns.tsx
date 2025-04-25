"use client";

import { TrazoInternCode } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DialogPayroll from "./DialogPayroll";
import SheetDataset from "./SheetDataset";

export const columns: ColumnDef<TrazoInternCode>[] = [
  {
    accessorKey: "companyName",
    header: "Cliente",
  },
  {
    accessorKey: "value",
    header: "Hoja de Ruta",
  },
  {
    accessorKey: "nEmbarque",
    header: "N° Embarque",
  },
  {
    accessorKey: "empresaDeTransporte",
    header: "Transporte",
  },
  {
    accessorKey: "encargado",
    header: "Encargado",
  },
  {
    header: "Acciones",
    cell: ({row}) => {
      const payroll = row.original;
      return (
        <div>
          <DialogPayroll procedureId={payroll.procedureId}/>
          <SheetDataset procedureId={payroll.procedureId} value={payroll.value}/>
          {/* value is the internCode */}
        </div>
      )
    }
  }
];
