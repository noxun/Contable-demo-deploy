import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
};

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageButtons = 5,
}: PaginationControlsProps) {
  // Handle edge cases
  if (totalPages <= 0) return null;

  // Ensure currentPage is within valid range
  const safePage = Math.max(1, Math.min(currentPage, totalPages));

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (totalPages <= maxPageButtons) {
      // Show all pages if there are fewer than maxPageButtons
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Otherwise, show a window of pages around the current page
    const halfWindow = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, safePage - halfWindow);
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    // Adjust if we're at the end
    if (end === totalPages) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = showPageNumbers ? getPageNumbers() : [];

  const handlePrevious = () => {
    if (safePage > 1) {
      onPageChange(safePage - 1);
    }
  };

  const handleNext = () => {
    if (safePage < totalPages) {
      onPageChange(safePage + 1);
    }
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={
              safePage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={safePage <= 1}
          />
        </PaginationItem>

        {showPageNumbers && (
          <>
            {/* First page */}
            {pageNumbers[0] > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => onPageChange(1)}
                    isActive={safePage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {pageNumbers[0] > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {/* Page numbers */}
            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={safePage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Last page */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => onPageChange(totalPages)}
                    isActive={safePage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              safePage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={safePage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
