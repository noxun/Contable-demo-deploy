"use client"
import { Button } from "@/components/ui/button";
import { postConvertAccountToBank } from "@/lib/data";
import useAccounts from "@/modules/shared/hooks/useAccounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Select from 'react-select'


export const FormConvertBank = () => {
  const { data: accounts } = useAccounts();
  const queryClient = useQueryClient()
  const { handleSubmit, setValue } = useForm<{ accountId: string }>();

  const bankMutation = useMutation({
    mutationFn: postConvertAccountToBank,
    onMutate: () => {
      toast('Cargando...');
    },
    onSuccess: () => {
      toast.success("Cuenta creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Bank"] });
    },
    onError: (error) => {
      toast.error("Error al crear la cuenta");
      console.error('ocurrio un error: ', error)
    }
  })

  const accountsOptions = accounts?.map(({ description, id }) => {
    return { label: description, value: id };
  });

  const onSubmit = (data: { accountId: string }) => {
    bankMutation.mutate(data.accountId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full gap-4 items-start justify-center mx-auto">
      <Select
        className="min-w-60 md:min-w-96 max-h-[100px]"
        placeholder="Seleccione una cuenta..."
        options={accountsOptions}
        onChange={(e) => { setValue("accountId", String(e?.value)) }}
      />
      <Button>Enviar</Button>
    </form>
  );
};
