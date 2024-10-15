"use client";

import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import { fetchBankExcerptData } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./bank-excerpt-data-columns";

export default function ListBankExcerptData({
  bankExcerptId,
}: {
  bankExcerptId: string | number;
}) {
  const { data, isPending, isLoading } = useQuery({
    queryKey: ["bankExcerpt", bankExcerptId],
    queryFn: () => fetchBankExcerptData(bankExcerptId.toString()),
  });

  if (isLoading || isPending || data === undefined) return <Spinner />;

  return <DataTable data={data} columns={columns} />;
}
