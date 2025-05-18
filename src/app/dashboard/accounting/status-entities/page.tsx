"use client";
import { DataTable } from "@/components/ui/data-table";
import useToken from "@/features/accounting/shared/hooks/useToken";
import { IResponseStatus } from "@/features/accounting/status-entities/interface/status-entities";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";

export default function StatusEntitiesPage() {
  const { token, isTokenReady } = useToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ["status-entities"],
    queryFn: async (): Promise<{ data: IResponseStatus[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/CaDocument/pag`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    staleTime: 1000 * 30 * 10,
  });

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  function columns(): ColumnDef<IResponseStatus>[] {
    return [
      {
        accessorKey: "carpeta",
        header: "Carpeta",
      },
      {
        accessorKey: "description",
        header: "Descripción",
      },
      {
        accessorKey: "typeOfExpense",
        header: "Tipo",
      },
      {
        accessorKey: "debit",
        header: "Debito",
      },
      {
        accessorKey: "credit",
        header: "Credito",
      },
      {
        accessorKey: "balance",
        header: "Balance",
      },
    ];
  }

  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Estado de cuentas</h2>
      </div>
      <DataTable columns={columns()} data={data?.data ?? []} />
    </section>
  );
}
