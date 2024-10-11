"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Branch } from "@/lib/types";
export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "nameSucutsal",
    header: "Nombre Sucursal",
  },
  {
    accessorKey:"address",
    header: "Direccion"
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
    header: "Telefono"
  },
  {
    accessorKey: "status",
    header: "Estado"
  }
];
