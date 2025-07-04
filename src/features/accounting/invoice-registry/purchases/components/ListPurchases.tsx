"use client";

import { DataTable } from "@/components/ui/data-table";
import { usePurchases } from "../hooks/usePurchases";
import { columns } from "./columns";

export default function ListPurchases() {
  const { data: purchases, isError, isLoading } = usePurchases();

  if (isError) {
    return <div>Error al cargar las compras.</div>;
  }

  if (isLoading || !purchases) {
    return <div>Cargando...</div>;
  }

  return <DataTable data={purchases} columns={columns} />;
}
