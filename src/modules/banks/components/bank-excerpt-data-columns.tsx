"use client";

import { Button } from "@/components/ui/button";
import { BankExcerptData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { PlaneIcon, Save, SaveAll } from "lucide-react";
import Select from 'react-select'


export const columns: ColumnDef<BankExcerptData>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "description",
    header: "Descripcion",
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
  },
  {
    header: "Asiento Modelo",
    cell: ({row}) => {
      const bankExcerptData = row.original
      return <Select/>
    } 
  },
  {
    header: "Acciones",
    cell: ({row}) => {
      return <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" title="Guardar como Asiento"><Save/></Button>
        <Button variant="outline" size="icon" title="Registrar en el trazo"><PlaneIcon/></Button>
        <Button variant="outline" size="icon" title="Completar Registro"><SaveAll/></Button>
      </div>
    }
  }
];
