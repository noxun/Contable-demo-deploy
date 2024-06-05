"use client";
import { useState } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { getListInvoices } from "../actions/actionsInvoice";
import { IResponseInvoice } from "../interface/invoice";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const ListInvoices = () => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [invoices, setInvoices] = useState<IResponseInvoice[]>([]);

  const next = async () => {
    setLoading(true);
    const response = await getListInvoices("/invoices/siat/v2/invoices", page);
    setInvoices((prev) => [...prev, ...response?.data]);
    setPage((prev) => prev + 1);
    if (response?.data.length < 3) {
      setHasMore(false);
    }
    setLoading(false);
  };

  function columns(): ColumnDef<IResponseInvoice>[] {
    return [
      {
        accessorKey: "invoice_number",
        header: "Nro.",
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
          const value = row.getValue("status");
          return value === "issued" ? (
            <Badge variant="secondary">VALIDA</Badge>
          ) : value === "void" ? (
            <Badge variant="destructive">ANULADA</Badge>
          ) : (
            value
          );
        },
      },
      {
        accessorKey: "numRef",
        header: "Carpeta",
      },
      {
        accessorKey: "customer",
        header: "Cliente",
      },
      {
        accessorKey: "total",
        header: "Factura",
      },
      {
        accessorKey: "totalSheet",
        header: "Planilla",
      },
      {
        accessorKey: "invoice_date_time",
        header: "Fecha",
      },
      {
        accessorKey: "siat_url",
        header: "SIAT",
        cell: ({ row }) => {
          return (
            <a
              href={row.getValue("siat_url") || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Abrir
            </a>
          );
        },
      },
      {
        accessorKey: "Acciones",
        header: "Planilla",
        cell: ({ row }) => {
          return <div className="flex gap-2"></div>;
        },
      },
    ];
  }

  return (
    <div className="max-h-[75vh] w-full overflow-y-auto px-2">
      <div className="flex w-full flex-col gap-2">
        <DataTable columns={columns()} data={invoices ?? []} />
        <InfiniteScroll
          hasMore={hasMore}
          isLoading={loading}
          next={next}
          threshold={1}
        >
          {hasMore && <Loader2 className="mt-2 mx-auto h-8 w-8 animate-spin" />}
        </InfiniteScroll>
      </div>
    </div>
  );
};
