"use client";

import { TrazoInternCode } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DialogPayroll from "./DialogPayroll";

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
      return (
        <div>
          <DialogPayroll procedureId={172}/>
        </div>
      )
    }
  }
];
