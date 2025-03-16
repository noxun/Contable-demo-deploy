"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Concept } from "../types/concept";
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
import ConceptDeleteButton from "./ConceptDeleteButton";

export const columns: ColumnDef<Concept>[] = [
  {
    accessorKey: "acronym",
    header: "Acronimo",
  },
  {
    accessorKey: "description",
    header: "Descripcion",
  },
  {
    accessorKey: "typeOfExpense",
    header: "Tipo de Gasto",
  },
  {
    accessorKey: "typeOfTax",
    header: "Tipo de Impuesto",
  },
  {
    accessorKey: "order",
    header: "Orden",
  },
  {
    accessorKey: "accountId",
    header: "Cuenta",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const concept = row.original;

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
                <Link href={`/dashboard/accounting/concepts/${concept.id}/edit`}>
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
                concepto con id: {concept.id}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <ConceptDeleteButton id={concept.id!}>
                  Eliminar
                </ConceptDeleteButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
