"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCostCenter } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/modules/cost-center/components/columns";
import ListCostCenter from "./ListCostCenter";

const CostCenterPage = () => {
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

  return (
    <div>
      <h1 className="text-2xl font-bold">Cuentas Por Cobrar</h1>
      <ListCostCenter costCenter={costCenter} />
    </div>
  );
};

export default CostCenterPage;
