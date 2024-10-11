"use client";

import { DataTable } from "@/components/ui/data-table";
import { fetchBranches } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";

export default function ListBranches() {
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

  return <DataTable data={branches} columns={columns} />;
}
