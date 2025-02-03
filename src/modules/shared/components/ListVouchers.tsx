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
type ListVouchersProps = {
  voucherType: VoucherType;
  voucherTypeRoute: VoucherTypeRoute;
};

export default function ListVouchers({
  voucherType,
  voucherTypeRoute,
}: ListVouchersProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["Vouchers", voucherType, page, pageSize],
    queryFn: () => fetchVouchers(voucherType, page, pageSize),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setPage(1)
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
      <VoucherTable
        voucherType={voucherType}
        voucherTypeRoute={voucherTypeRoute}
        data={vouchers ?? []}
      />
      {pagination && (
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
                  page === pagination.TotalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}