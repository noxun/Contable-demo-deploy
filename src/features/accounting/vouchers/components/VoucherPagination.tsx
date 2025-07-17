"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  setPage: (page: number) => void;
  inputPage: string;
  setInputPage: (value: string) => void;
  pagination: {
    TotalPages: number;
  };
};

export default function VoucherPagination({
  page,
  setPage,
  inputPage,
  setInputPage,
  pagination,
}: Props) {
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (pagination && page < pagination.TotalPages) {
      setPage(page + 1);
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
    <div className="flex flex-col items-center gap-4">
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevious}
              className={`cursor-pointer ${page === 1 ? "pointer-events-none opacity-50 cursor-default" : ""}`}
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
                  : "cursor-pointer"
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
  );
}
