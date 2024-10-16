"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { TableBank } from "@/modules/banks/components/TableBank";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { IIncomeResponse } from "@/modules/income/interface/income";
import { IBank } from "@/modules/banks/interface/banks";
import useToken from "@/modules/shared/hooks/useToken";

function Users() {
  const { token, isTokenReady } = useToken();
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["Bank"],
    queryFn: async (): Promise<{ data: IBank[] }> =>
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Bank`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),

    enabled: isTokenReady,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading || isPending) return "Loading...";

  console.log("ESDATA,", data);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex flex-col items-center">
        <h1 className="font-bold text-3xl">BANCOS</h1>
        <div className="flex w-full items-center gap-4 justify-end">
          <Link href="/files/example_extract_bank.xlsx" download><Button>Descargar Plantilla Extracto</Button></Link>
          <Link href="/dashboard/banks/new">
            <Button>Nuevo Banco</Button>
          </Link>
        </div>
      </div>
      <TableBank data={data?.data! ?? []} />
    </div>
  );
}

export default Users;
