"use client";

import { TrazoInternCode } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

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
];
