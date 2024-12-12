"use client"
import { DataTable } from "@/components/ui/data-table";
import useTrazoInternCodes from "@/modules/shared/hooks/useTrazoInternCodes";
import { columns } from "./folder-columns";

export default function ListFolders() {
  const { data: internCodes, isLoading, isError } = useTrazoInternCodes();

  if (isError) {
    return <div>Hubo un error al obtener las carpetas</div>;
  }

  if (isLoading && !internCodes) {
    return <div>Cargando datos...</div>;
  }

  return <DataTable columns={columns} data={internCodes ?? []} />;
}
