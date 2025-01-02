"use client";

import { Button } from "@/components/ui/button";
import { registerToTrazo } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PlaneIcon } from "lucide-react";
import { toast } from "sonner";

export default function RegisterTrazoButton({
  bankId,
  disabled,
  bankExtractId,
}: {
  bankId: string | number;
  bankExtractId: number;
  disabled: boolean;
}) {
  const queryClient = useQueryClient();

  const registerTrazoMutation = useMutation({
    mutationFn: registerToTrazo,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Error al registrar al Trazo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankExcerpt", bankId] });
      toast.success("Registrado al Trazo Correctamente!");
    },
  });

  function handleClick() {
    registerTrazoMutation.mutate(bankExtractId);
  }

  return (
    <Button
      className={cn("bg-red-500", { "bg-green-500": disabled })}
      disabled={disabled}
      variant="outline"
      size="icon"
      title="Registrar en el trazo"
      onClick={handleClick}
    >
      <PlaneIcon />
    </Button>
  );
}
