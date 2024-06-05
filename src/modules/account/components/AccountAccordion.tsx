"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Account } from "../types/account";
import ChildAccounts from "./ChildAccounts";
import useToken from "@/modules/shared/hooks/useToken";

function AccountAccordion() {
  
  const {token} = useToken()
  const accountsQuery = useQuery({
    queryKey: ["accountsAll"],
    queryFn: async (): Promise<{ data: Account[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/All`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    staleTime: 1000 * 60 * 10, //volver a hacer fetch luego de 10 min
  });

  if (accountsQuery.isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
    //aca se puede retornar algun skeleton
  }

  return (
    <div>
      <ChildAccounts accounts={accountsQuery.data?.data}/>
    </div>
  );
}

export default AccountAccordion