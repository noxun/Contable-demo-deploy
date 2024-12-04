"use client";

import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import { fetchBankExcerpt } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./bank-excerpt-columns";
import { useState } from "react";
import { BankSelectionState } from "@/lib/types";

export default function ListBankExcerpts({
  bankId,
}: {
  bankId: string | number;
}) {

  const [selectedAccounts, setSelectedAccounts] = useState<BankSelectionState>({});

  const handleSelectChange = (bankExtractId: number, accountId: number | null) => {
    setSelectedAccounts(prev => ({
      ...prev,
      [bankExtractId]: accountId
    }))
  }


  const { data, isPending, isLoading } = useQuery({
    queryKey: ["bankExcerpt", bankId],
    queryFn: () => fetchBankExcerpt(bankId.toString()),
  });

  if (isLoading || isPending || data === undefined) return <Spinner />;

  return <DataTable data={data} columns={columns(bankId,selectedAccounts, handleSelectChange)} />;
}
