"use client";

import { Button } from "@/components/ui/button";
import { changeReceiptStatus } from "@/lib/trazo-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ChangeReceiptStatusButton(
  {subDataId, procedureId}: {subDataId: number, procedureId: number}
) {

  const queryClient = useQueryClient();

  const changeReceiptStatusMutation = useMutation({
    mutationFn: changeReceiptStatus,
    onError: (error: AxiosError) => {
      console.error(error);
      toast.error("Error al cambiar el estado del recibo");
    },
    onSuccess: () => {
      toast.success("Estado del recibo cambiado correctamente");
      //invalidate queries here later
      queryClient.invalidateQueries({queryKey: ["procedureDataset", procedureId]});
    }
  })

  function handleClick(){
    changeReceiptStatusMutation.mutate(subDataId);
  }

  return (
    <Button title="Cambiar estado del recibo" variant="outline" size="icon" onClick={handleClick}>
      <ShieldCheck className="size-4" />
    </Button>
  );
}
