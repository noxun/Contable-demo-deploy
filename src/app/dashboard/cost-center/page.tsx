"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCostCenter } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/modules/cost-center/components/columns";

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
      <h1 className="text-2xl font-bold">Centro de Costos</h1>
      <DataTable data={costCenter} columns={columns} />
    </div>
  );
};

export default CostCenterPage;
