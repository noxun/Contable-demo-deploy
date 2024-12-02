"use client";

import { DataTable } from "@/components/ui/data-table";
import { fetchAllModelSeats } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";

export default function ListModelSeats() {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredModelSeats = modelSeats.filter((modelSeat) =>
    modelSeat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  return (
    <>
      <Input placeholder="Buscar..." type="search" value={searchQuery} onChange={handleChange} />
      <DataTable data={filteredModelSeats ?? []} columns={columns} />
    </>
  );
}
