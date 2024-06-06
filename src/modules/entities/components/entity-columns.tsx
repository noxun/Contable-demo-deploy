"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Link from "next/link";
import { Entity } from "../types/entity";
import EntityDeleteButton from "./EntityDeleteButton";

export const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "code",
    header: "Codigo",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "nitCi",
    header: "NIT/CI",
  },
  {
    accessorKey: "acronym",
    header: "Acronimo",
  },
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "phone",
    header: "Telefono",
  },
  {
    accessorKey: "accountId",
    header: "Cuenta",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entity = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/entities/${entity.id}/edit`}>
                  Editar
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Esta absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta accion no puede revertirse. Esto borrara permanentemente el
                la entidad con id: {entity.id}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <EntityDeleteButton id={entity.id!}>
                  Eliminar
                </EntityDeleteButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
