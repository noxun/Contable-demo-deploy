"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import ListCostCenter from "../../../../features/accounting/cost-center/components/ListCostCenter";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import useUserStore from "@/lib/userStore";
import { useCostCenterByRoleData } from "@/features/accounting/cost-center/hooks/useCostCenterByRoleData";

const CostCenterPage = () => {
  const loginData = useUserStore((state) => state.loginData);

  const filteredCostCenterClients = useMemo(() => {
    return loginData?.rols.filter((item) => !item.isMenu && !item.main) ?? [];
  }, [loginData?.rols]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const {
    data: costCenter,
    isPending,
    isError,
    error,
  } = useCostCenterByRoleData(filteredCostCenterClients);

  const filteredCostCenter = useMemo(() => {
    return (Array.isArray(costCenter) ? costCenter : [])
      .map(({ accountItems, ...rest }) => {
        const filteredItems = accountItems.filter(({ description }) =>
          description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
        return filteredItems.length > 0
          ? { ...rest, accountItems: filteredItems }
          : null;
      })
      .filter(Boolean);
  }, [costCenter, debouncedSearchQuery]);

  if (isError) return <div>Error: {error.message}</div>;
  if (isPending) return <div>Loading...</div>;

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

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
