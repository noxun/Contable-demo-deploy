"use client";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IResponseFolder } from "../interface/folders";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

export const ListFolders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Folders"],
    queryFn: async (): Promise<{ data: IResponseFolder[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_TRAZO_URL}/Procedure/GeneralData`,
        { headers: { "Content-Type": "application/json" } }
      ),
    staleTime: 1000 * 30 * 10,
  });

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  function columns(): ColumnDef<IResponseFolder>[] {
    return [
      {
        accessorKey: "numRef",
        header: "Carpeta",
      },
      {
        accessorKey: "dim",
        header: "DIM",
      },
      {
        accessorKey: "clienteNombre",
        header: "Cliente",
      },
      {
        accessorKey: "mercaderia",
        header: "Mercadería",
      },
      {
        id: "actions",
        header: "Pagos",
        enableHiding: false,
        cell: ({ row }) => {
          const procedure = row.original;
          return (
            <div className="flex gap-2">
              <Link href={`/dashboard/folders/${procedure.numRef}`}>
                <Button>
                  Ver Pagos <SquareArrowOutUpRight className="ml-2" size={15} />
                </Button>
              </Link>
              {/* <Link
                href={`/dashboard/folders/${procedure.numRef}/register-payment`}
              >
                <Button>
                  Registrar Pagos{" "}
                  <SquareArrowOutUpRight className="ml-2" size={15} />
                </Button>
              </Link>
              <Link
                href={`/dashboard/folders/${procedure.numRef}/close-payment`}
              >
                <Button variant="destructive">
                  Planillar <SquareArrowOutUpRight className="ml-2" size={15} />
                </Button>
              </Link> */}
            </div>
          );
        },
      },
    ];
  }

  return (
    <div>
      <DataTable columns={columns()} data={data?.data ?? []} />
    </div>
  );
};
