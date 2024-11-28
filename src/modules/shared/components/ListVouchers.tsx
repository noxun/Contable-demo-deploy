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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  return (
    <section className="flex flex-col gap-4">
      <Button asChild className="w-fit">
        <Link href={`/dashboard/${voucherTypeRoute}/new`}>Crear Nuevo</Link>
      </Button>
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
            {[...Array(pagination.TotalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setPage(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
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
