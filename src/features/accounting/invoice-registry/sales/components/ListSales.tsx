"use client";

import { DataTable } from "@/components/ui/data-table";
import { useSales } from "../hooks/useSales";
import { columns } from "./columns";

export default function ListSales() {
  const { data: sales, isError, isLoading } = useSales();

  if (isError) {
    return <div>Error al cargar las ventas.</div>;
  }

  if (isLoading || !sales) {
    return <div>Cargando...</div>;
  }

  return <DataTable data={sales} columns={columns} />;
}
