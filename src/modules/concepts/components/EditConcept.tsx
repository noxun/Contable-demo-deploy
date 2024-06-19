"use client";

import useToken from "@/modules/shared/hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FormEditConcept from "./FormEditConcept";
import { Concept } from "../types/concept";

export default function EditConcept({ id }: { id: string }) {
  const { token, isTokenReady } = useToken();

  const {
    data: concept,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["Concepts", id],
    queryFn: async (): Promise<Concept> => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ConceptExpense/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: isTokenReady
  });

  if (isLoading || isPending === true) {
    return <div>Cargando</div>;
  }

  return <FormEditConcept concept={concept!}/>;
}
