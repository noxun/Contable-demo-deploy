"use client";
import { IResponseConceptFolder } from "../interface/folders";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Props {
  numRef: string;
  data: IResponseConceptFolder[] | undefined;
}

export const TableConceptExpense = ({ numRef, data }: Props) => {
  function columns(): ColumnDef<IResponseConceptFolder>[] {
    return [
      {
        accessorKey: "acronym",
        header: "Sigla",
      },
      {
        accessorKey: "description",
        header: "Descripción",
      },
      {
        accessorKey: "typeOfExpense",
        header: "Tipo",
      },
      {
        accessorKey: "debitBs",
        header: "Pago",
      },
    ];
  }

  return (
    <div>
      <DataTable columns={columns()} data={data ?? []} />
    </div>
  );
};
