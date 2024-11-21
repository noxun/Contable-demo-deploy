"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { TableUser} from "@/modules/users/components/TableUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IUserResponse } from "@/modules/users/interface/users";
import useToken from "@/modules/shared/hooks/useToken";



function Users() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {token, isTokenReady} = useToken();
  const { data, isLoading, isPending, error } = useQuery({
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


  if (isLoading || isPending) return "Loading...";


  return (
    <div>
    <h1 className="flex  items-center justify-center font-bold text-3xl">USUARIOS</h1>
    
      <section className="px-6">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold"></h2>
          <Link href="/dashboard/users/new">
            <Button>Nuevo Usuario</Button>
          </Link>
        </div>
        <TableUser  data={data?.data!}/>
      </section>
      </div>
    
   
  );
}

export default Users;