"use client";

import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import { fetchBankExcerpt } from "@/lib/data";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

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

  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 10;


  const searchParams = useSearchParams();
  const bankAccountId = searchParams.get("bankAccountId");

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < 10) {
      setPage((prev) => prev + 1);
    }
  }

  const generatePageNumbers = () => {
    if (!data?.totalPages) return [];

    const totalPages = data.totalPages;
    const currentPage = page;
    const pageNumbers = [];

    // Always show first page
    if (totalPages > 1) pageNumbers.push(1);

    // Add ellipsis and surrounding pages if total pages > 5
    if (totalPages > 5) {
      // Add ellipsis before current page if needed
      if (currentPage > 3) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }

      // Add surrounding pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (!pageNumbers.includes(i)) pageNumbers.push(i);
      }

      // Add ellipsis after current page if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push(-1);
      }

      // Always show last page
      if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
    } else {
      // If 5 or fewer pages, show all
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

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
    queryKey: ["bankExcerpt", bankId, page, pageSize],
    queryFn: () => fetchBankExcerpt(bankId.toString(), page, pageSize),
    placeholderData: keepPreviousData,
  });

  const filteredBankExtracts = useMemo(
    () => (Array.isArray(data?.items) ? data.items : []).filter((bankExcerpt) => {
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

{data.currentPage && data.pageSize && data.totalCount && data.totalPages && (
        <div className="flex flex-col items-center gap-4">
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {generatePageNumbers().map((pageNum, index) => (
                pageNum === -1 ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <span className="px-2">...</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={
                    page === data.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          {/* <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Ir a pagina"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              min="1"
              max={data.totalPages}
              className="w-24"
            />
            <Button onClick={handlePageInput}>Ir</Button>
            <span className="text-sm text-muted-foreground">
              (Pagina {page} de {data.totalPages})
            </span>
          </div> */}
        </div>
      )}
    </>
  );
}
