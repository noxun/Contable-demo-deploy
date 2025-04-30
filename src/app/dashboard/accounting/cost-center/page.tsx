"use client";

import React, { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCostCenterByRoleData } from "@/lib/data";
import ListCostCenter from "./ListCostCenter";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import useUserStore from "@/lib/userStore";

const CostCenterPage = () => {
  const loginData = useUserStore((state) => state.loginData);
  const filteredCostCenterClients = loginData?.rols.filter(
    (item) => !item.isMenu && !item.main
  ) ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const {
    data: costCenter,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["costCenter", filteredCostCenterClients],
    queryFn: () => fetchCostCenterByRoleData(filteredCostCenterClients),
  });

  if (isError) return <div>Error: {error.message}</div>;
  if (isPending) return <div>Loading...</div>;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCostCenter = (Array.isArray(costCenter) ? costCenter : [])
    .map(({ accountItems, ...rest }) => {
      const filteredItems = accountItems.filter(({ description }) =>
        description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      return filteredItems.length > 0
        ? { ...rest, accountItems: filteredItems }
        : null;
    })
    .filter(Boolean);

  return (
    <div>
      <h1 className="text-2xl font-bold">Cuentas Por Cobrar</h1>
      <Input
        type="search"
        placeholder="Buscar por nombre"
        onChange={handleSearch}
      />
      <ListCostCenter costCenter={filteredCostCenter ?? []} />
    </div>
  );
};

export default CostCenterPage;
