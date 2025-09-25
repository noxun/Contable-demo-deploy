"use client";

import { useSearchParams, useRouter } from "next/navigation";

// Type for pagination data from the backend
export type PaginationData = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export function usePagination(
  paginationData?: PaginationData,
  defaultPage = 1,
  defaultPageSize = 10
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current page and page size from URL or use defaults
  const page = parseInt(searchParams.get("page") ?? `${defaultPage}`, 10);
  const pageSize = parseInt(
    searchParams.get("pageSize") ?? `${defaultPageSize}`,
    10
  );

  // Function to update page in URL
  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // Function to update page size in URL
  const setPageSize = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newPageSize.toString());
    // When changing page size, reset to page 1
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // If we have pagination data from the backend, use that to get total pages
  // Otherwise, use a default value of 1 for total pages
  const totalPages = paginationData?.totalPages ?? 1;
  const totalItems = paginationData?.totalItems ?? 0;

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    totalPages,
    totalItems,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}