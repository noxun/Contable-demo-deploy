"use client";

import { DataTable } from "@/components/ui/data-table";
import { fetchAllModelSeats } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";

export default function ListModelSeats() {
  const {
    data: modelSeats,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["AllModelSeats"],
    queryFn: fetchAllModelSeats,
  });

  if (modelSeats === undefined || isLoading || isPending)
    return <div>Cargando...</div>;

  return <DataTable data={modelSeats} columns={columns} />;
}
