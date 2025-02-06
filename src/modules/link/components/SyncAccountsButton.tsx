"use client";

import { Button } from "@/components/ui/button";
import { synchronizeAccounts } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function SyncAccountsButton() {
  const syncAccountsMutation = useMutation({
    mutationFn: synchronizeAccounts,
    onError: (error) => {
      toast.error("Ocurrió un error al sincronizar las cuentas");
      console.log(error);
    },
    onSuccess: () => {
      toast.success("Cuentas sincronizadas correctamente");
    },
  });

  const handleClick = () => {
    syncAccountsMutation.mutate();
  };

  return (
    <Button onClick={handleClick}>
      {syncAccountsMutation.isPending ? "Sincronizando" : "Sincronizar"}
    </Button>
  );
}
