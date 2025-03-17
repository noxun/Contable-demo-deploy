"use client";

import { DataTable } from "@/components/ui/data-table";
import { fetchBranches } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";

import useToken from "@/modules/shared/hooks/useToken";
import { Branch } from "@/lib/types";
import { useDialogState } from "@branch/hooks/useDialogState";
import { DeleteBranch } from "./DeleteBranch";

import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import DialogEditBranch from "./DialogEditBranch";

export default function ListBranches() {
  const { dialogData, closeDialog, openDialog } = useDialogState<Branch>();

  const { token } = useToken();

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "nameSucutsal",
      header: "Nombre Sucursal",
    },
    {
      accessorKey: "address",
      header: "Direccion",
    },
    {
      accessorKey: "email",
      header: "Correo",
    },
    {
      accessorKey: "personInCharge",
      header: "Persona a Cargo:",
    },
    {
      accessorKey: "phone",
      header: "Telefono",
    },
    {
      accessorKey: "status",
      header: "Estado",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex items-center justify-end">
            <DialogEditBranch branch={branch} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openDialog("delete", branch)}>
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const {
    data: branches,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["allBranches"],
    queryFn: fetchBranches,
  });

  if (branches === undefined || isLoading || isPending)
    return <div>Cargando...</div>;

  return (
    <div>
      <DataTable data={branches} columns={columns} />
      {dialogData.branch && token && (
        <DeleteBranch
          branchToDelete={dialogData.branch as Branch}
          onCloseDialog={closeDialog}
          token={token as string}
        />
      )}
    </div>
  );
}
