"use client"

import { DataTable } from "@/components/ui/data-table"
import { fetchAllMotionAccountsWithRelations } from "@/lib/data"
import { useQuery } from "@tanstack/react-query"
import { columns } from "./columns"

export default function LinkAccounts() {

  const {data, isLoading, isPending} = useQuery({
    queryKey: ["AllAccountRelation"],
    queryFn: fetchAllMotionAccountsWithRelations,
  })

  if(data === undefined || isLoading ||isPending)
    return <div>Cargando...</div>

  return (
    <DataTable data={data} columns={columns}/>
  )
}
