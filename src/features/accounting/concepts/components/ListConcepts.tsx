"use client";

import { DataTable } from "@/components/ui/data-table";
import useToken from "../../shared/hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Concept } from "../types/concept";
import { columns } from "./concept-columns";

export default function ListConcepts() {
  const { token, isTokenReady } = useToken();

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["Concepts"],
    queryFn: async (): Promise<Concept[]> => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ConceptExpense`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data;
    },
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  if (isLoading || isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return <DataTable columns={columns} data={data ?? []}/>;
}
