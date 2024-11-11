"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAccountingBox } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/modules/accounting-box/components/columns";

const AccountingBoxPage = () => {
  const {
    data: accountingBox,
    isPending,
    error,
  } = useQuery({
    queryKey: ["accountingBox"],
    queryFn: fetchAccountingBox,
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Caja</h1>
      <DataTable data={accountingBox} columns={columns} />
    </div>
  );
};

export default AccountingBoxPage;
