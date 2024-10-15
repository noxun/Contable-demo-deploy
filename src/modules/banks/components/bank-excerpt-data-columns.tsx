"use client";

import { BankExcerptData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Select from 'react-select'


export const columns: ColumnDef<BankExcerptData>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "agency",
    header: "Agencia",
  },
  {
    accessorKey: "accountingAccount",
    header: "Cuenta",
    cell: ({row}) => {
      const bankExcerptData = row.original
      return <Select/>
    } 
  },
  {
    accessorKey: "internCode",
    header: "Codigo de Interno",
    cell: ({row}) => {
      const bankExcerptData = row.original
      return <Select/>
    } 
  }
];
