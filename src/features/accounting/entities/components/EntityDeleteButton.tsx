"use client";
import { PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useToken from "@/features/accounting/shared/hooks/useToken";


type EntityDeleteButtonProps = {
  id: number;
} & PropsWithChildren;

export default function EntityDeleteButton({
  children,
  id,
}: EntityDeleteButtonProps) {
  const {token} = useToken();
  const queryClient = useQueryClient();
  const entityDeleteMutation = useMutation({
    mutationFn: async (id:number) => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Entity/${id}`,
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
      toast.success("Entidad borrada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Entities"] });
    },
    onError: (error) => {
      console.log(error)
      toast.error("Error al borrar la entidad");
    },
  });

  return (
    <Button
      onClick={() => {
        entityDeleteMutation.mutate(id);
      }}
    >
      {children}
    </Button>
  );
}
