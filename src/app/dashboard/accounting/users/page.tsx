"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { TableUser } from "@/modules/users/components/TableUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IUserResponse } from "@/modules/users/types/users";
import useToken from "@/modules/shared/hooks/useToken";


function Users() {
  const { token, isTokenReady } = useToken();
  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["User"],
    queryFn: async (): Promise<{ data: IUserResponse[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Users/All`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    enabled: isTokenReady,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading || isPending) return <span>Loading...</span>;

  if (isError) return <span>Ocurrio un error...</span>;

  return (
    <section className="flex flex-col justify-between mb-2 gap-2 px-6">
      <h2 className="text-start text-lg font-semibold">Usuarios</h2>
      <Link href="/dashboard/accounting/users/new">
        <Button>Nuevo Usuario</Button>
      </Link>
      <TableUser data={data?.data!} />
    </section>
  );
}

export default Users