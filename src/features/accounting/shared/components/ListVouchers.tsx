"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { VoucherType, VoucherTypeRoute } from "../types/sharedTypes";
import VoucherTable from "./VoucherTable";
import { fetchVouchers } from "@/lib/data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";
import { Label } from "@/components/ui/label";

type ListVouchersProps = {
  voucherType: VoucherType;
  voucherTypeRoute: VoucherTypeRoute;
  siat?: "siat" | "";
  glossSuffix?: string;
};

const firstDayOfYear = format(
  new Date(new Date().getFullYear(), 0, 1),
  "yyyy-MM-dd"
);
const today = format(new Date(), "yyyy-MM-dd");

export default function ListVouchers({
  voucherType,
  voucherTypeRoute,
  siat = "",
  glossSuffix = "",
}: ListVouchersProps) {
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const pageSize = 10;

  const [initDate, setInitDate] = useState(firstDayOfYear);
  const [endDate, setEndDate] = useState(today);
  const [glossQuery, setGlossQuery] = useState("");
  const [debouncedGlossQuery] = useDebounce(glossQuery, 800);

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: [
      "Vouchers",
      voucherType,
      page,
      pageSize,
      initDate,
      endDate,
      debouncedGlossQuery,
      siat,
      glossSuffix,
    ],
    queryFn: () =>
      fetchVouchers(
        voucherType,
        page,
        pageSize,
        initDate,
        endDate,
        debouncedGlossQuery + (glossSuffix ? `${glossSuffix}` : ""),
        siat
      ),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setPage(1);
  }, [voucherType]);

  if (isLoading || isPending) return <div>Cargando...</div>;

  if (error)
    return "Ocurrió un error al obtener los vouchers: " + error.message;

  const vouchers = data?.data ?? [];
  const pagination = data.pagination;

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (pagination && page < pagination.TotalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePageInput = () => {
    const pageNum = parseInt(inputPage);
    if (
      pagination &&
      !isNaN(pageNum) &&
      pageNum >= 1 &&
      pageNum <= pagination.TotalPages
    ) {
      setPage(pageNum);
    }
  };

  const handleGlossSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlossQuery(e.target.value);
  };

  const handleDateRangeChange = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    console.log(values);

    if (values?.range?.from && values?.range?.to) {
      setInitDate(format(values.range.from, "yyyy-MM-dd"));
      setEndDate(format(values.range.to, "yyyy-MM-dd"));
      setPage(1);
    } else {
      setInitDate("");
      setEndDate("");
    }
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    if (!pagination) return [];

    const totalPages = pagination.TotalPages;
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

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label className="flex-1 flex flex-col gap-2">
          Rango de Fechas
        <DateRangePicker
          showCompare={false}
          locale="es"
          onUpdate={handleDateRangeChange}
          initialDateFrom={firstDayOfYear}
          initialDateTo={today}
        />
        </Label>
        <Label className="flex-1 flex flex-col gap-2">          
          Buscar
          <Input placeholder="Buscar por glosa" type="search" value={glossQuery} onChange={handleGlossSearch} />
        </Label>
      </div>
      <VoucherTable
        voucherType={voucherType}
        voucherTypeRoute={voucherTypeRoute}
        data={vouchers ?? []}
      />
      {pagination && (
        <div className="flex flex-col items-center gap-4">
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {generatePageNumbers().map((pageNum, index) =>
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
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={
                    page === pagination.TotalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Ir a pagina"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              min="1"
              max={pagination.TotalPages}
              className="w-24"
            />
            <Button onClick={handlePageInput}>Ir</Button>
            <span className="text-sm text-muted-foreground">
              (Pagina {page} de {pagination.TotalPages})
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
