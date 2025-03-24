"use client";

import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import { fetchBankExcerpt } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./bank-excerpt-columns";
import { useCallback, useMemo, useState } from "react";
import {
  BankExcerpt,
  BankSelectionState,
  TypeSelectionState,
} from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteAllBankExtractsDialog from "./DeleteAllBankExtractsDialog";
import { useSearchParams } from "next/navigation";

export default function ListBankExcerpts({
  bankId,
}: {
  bankId: string | number;
}) {
  const [selectedAccounts, setSelectedAccounts] = useState<BankSelectionState>(
    {}
  );

  const [selectedTypes, setSelectedTypes] = useState<TypeSelectionState>({});

  const [filterByAccountId, setFilterByAccountId] = useState<
    "all" | "registered" | "unregistered"
  >("unregistered");

  const searchParams = useSearchParams();
  const bankAccountId = searchParams.get("bankAccountId");

  const handleSelectChange = useCallback(
    (bankExtractId: number, accountId: number | null) => {
      setSelectedAccounts((prev) => ({
        ...prev,
        [bankExtractId]: accountId,
      }));
    },
    []
  );

  const handleTypeSelectChange = useCallback(
    (bankExtractId: number, type: number | null) => {
      setSelectedTypes((prev) => ({
        ...prev,
        [bankExtractId]: type,
      }));
    },
    []
  );

  console.log(selectedTypes,selectedAccounts)

  const { data, isPending, isLoading } = useQuery({
    queryKey: ["bankExcerpt", bankId],
    queryFn: () => fetchBankExcerpt(bankId.toString()),
  });

  const filteredBankExtracts = useMemo(
    () => (Array.isArray(data) ? data : []).filter((bankExcerpt) => {
      if (filterByAccountId === "unregistered") return bankExcerpt.accountingEntry === false;
      if (filterByAccountId === "registered") return bankExcerpt.accountingEntry === true;
      return true;
    }),
    [data, filterByAccountId]
  );

  const memoizedColumns = useMemo(
    () => columns(
      bankAccountId,
      bankId,
      selectedAccounts,
      selectedTypes,
      handleSelectChange,
      handleTypeSelectChange
    ),
    [bankAccountId, bankId, selectedAccounts, selectedTypes, handleSelectChange, handleTypeSelectChange]
  );

  if (isLoading || isPending || data === undefined) return <Spinner />;

  console.log(selectedAccounts, selectedTypes)

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
        <DeleteAllBankExtractsDialog bankId={bankId as number}/>
      </div>

      <DataTable
        data={filteredBankExtracts}
        columns={memoizedColumns}
      />
    </>
  );
}
