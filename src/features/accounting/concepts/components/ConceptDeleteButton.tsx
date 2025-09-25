"use client";
import { PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useToken from "@/features/accounting/shared/hooks/useToken";


type ConceptDeleteButtonProps = {
  id: number;
} & PropsWithChildren;

export default function ConceptDeleteButton({
  children,
  id,
}: ConceptDeleteButtonProps) {
  const {token} = useToken();
  const queryClient = useQueryClient();
  const conceptDeleteMutation = useMutation({
    mutationFn: async (id:number) => {
      const response = await axios.delete(
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
    onSuccess: () => {
      toast.success("Concepto borrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Concepts"] });
    },
    onError: (error) => {
      console.log(error)
      toast.error("Error al borrar el concepto");
    },
  });

  return (
    <Button
      onClick={() => {
        conceptDeleteMutation.mutate(id);
      }}
    >
      {children}
    </Button>
  );
}
