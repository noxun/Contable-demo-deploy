"use client";

import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import { fetchBankExcerpt } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./bank-excerpt-columns";

export default function ListBankExcerpt({
  bankId,
}: {
  bankId: string | number;
}) {
  const { data, isPending, isLoading } = useQuery({
    queryKey: ["bankExcerpt", bankId],
    queryFn: () => fetchBankExcerpt(bankId.toString()),
  });

  if (isLoading || isPending || data === undefined) return <Spinner />;

  return <DataTable data={data} columns={columns} />;
}
