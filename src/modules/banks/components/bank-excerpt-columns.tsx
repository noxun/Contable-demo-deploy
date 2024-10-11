"use client";

import { BankExcerpt } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";


export const columns: ColumnDef<BankExcerpt>[] = [
  {
    accessorKey: "description",
    header: "Descripcion",
  },
  {
    accessorKey:"date",
    header: "Fecha"
  },
  {
    accessorKey: "hour",
    header: "Hour",
  },
  {
    accessorKey: "meansOfCare",
    header: "Medios de Atencion",
  },
  {
    accessorKey: "place",
    header: "Lugar"
  },
  {
    accessorKey: "amount",
    header: "Cantidad"
  },
  {
    accessorKey: "balance",
    header: "Balance"
  }
];
