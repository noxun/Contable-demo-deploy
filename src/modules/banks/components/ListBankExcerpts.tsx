"use client";

import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import { fetchBankExcerpt } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./bank-excerpt-columns";
import { useState } from "react";
import { BankExcerpt, BankSelectionState } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ListBankExcerpts({
  bankId,
}: {
  bankId: string | number;
}) {
  const [selectedAccounts, setSelectedAccounts] = useState<BankSelectionState>(
    {}
  );

  const [filterByAccountId, setFilterByAccountId] = useState<
    "all" | "registered" | "unregistered"
  >("all");

  const handleSelectChange = (
    bankExtractId: number,
    accountId: number | null
  ) => {
    setSelectedAccounts((prev) => ({
      ...prev,
      [bankExtractId]: accountId,
    }));
  };

  const { data, isPending, isLoading } = useQuery({
    queryKey: ["bankExcerpt", bankId],
    queryFn: () => fetchBankExcerpt(bankId.toString()),
  });

  const filteredBankExtracts = (Array.isArray(data) ? data : []).filter(
    (bankExcerpt) => {
      if (filterByAccountId === "unregistered")
        return bankExcerpt.accountId === 0;
      if (filterByAccountId === "registered")
        return bankExcerpt.accountId !== 0;
      return true;
    }
  );

  if (isLoading || isPending || data === undefined) return <Spinner />;

  return (
    <>
      <div className="flex items-center gap-2">
        <div>Filtros:</div>
        <Select
          onValueChange={(value) =>
            setFilterByAccountId(value as "all" | "registered" | "unregistered")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado de registro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="unregistered">No registrado</SelectItem>
            <SelectItem value="registered">Registrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filteredBankExtracts}
        columns={columns(bankId, selectedAccounts, handleSelectChange)}
      />
    </>
  );
}
