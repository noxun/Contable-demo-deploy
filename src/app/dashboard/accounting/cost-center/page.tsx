"use client";

import React, { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCostCenter } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/modules/cost-center/components/columns";
import ListCostCenter from "./ListCostCenter";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";

const CostCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] =useDebounce(searchQuery, 300);

  const {
    data: costCenter,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["costCenter"],
    queryFn: fetchCostCenter,
  });

  if (isError) return <div>Error: {error.message}</div>;
  if (isPending) return <div>Loading...</div>;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCostCenter = costCenter
  .map(({ accountItems, ...rest }) => {
    const filteredItems = accountItems.filter(({ description }) =>
      description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
    return filteredItems.length > 0 ? { ...rest, accountItems: filteredItems } : null;
  })
  .filter(Boolean);

  return (
    <div>
      <h1 className="text-2xl font-bold">Cuentas Por Cobrar</h1>
      <Input type="search" placeholder="Buscar por nombre" onChange={handleSearch} />
      <ListCostCenter costCenter={filteredCostCenter ?? []} />
    </div>
  );
};

export default CostCenterPage;
