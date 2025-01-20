"use client";

import { TrazoInternCode } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DialogPayroll from "./DialogPayroll";
import SheetDataset from "./SheetDataset";

export const columns: ColumnDef<TrazoInternCode>[] = [
  {
    accessorKey: "value",
    header: "Valor",
  },
  {
    accessorKey: "procedureId",
    header: "Id del proceso",
  },
  {
    accessorKey: "fieldId",
    header: "Id del campo",
  },
  {
    header: "Acciones",
    cell: ({row}) => {
      const payroll = row.original;
      return (
        <div>
          <DialogPayroll procedureId={payroll.procedureId}/>
          <SheetDataset procedureId={payroll.procedureId}/>
        </div>
      )
    }
  }
];
