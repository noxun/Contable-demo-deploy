"use client";
import { DataTable } from "@/components/ui/data-table";
import useTrazoInternCodes from "@/modules/shared/hooks/useTrazoInternCodes";
import { columns } from "./folder-columns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function ListFolders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const { data: internCodes, isLoading, isError } = useTrazoInternCodes();

  if (isError) {
    return <div>Hubo un error al obtener las carpetas</div>;
  }

  if (isLoading && !internCodes) {
    return <div>Cargando datos...</div>;
  }

  const filteredInternCodes = (
    Array.isArray(internCodes) ? internCodes : []
  ).filter((internCode) =>
    internCode.value.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Input type="search" value={searchQuery} onChange={handleSearch} />
      <DataTable columns={columns} data={filteredInternCodes} />
    </>
  );
}
