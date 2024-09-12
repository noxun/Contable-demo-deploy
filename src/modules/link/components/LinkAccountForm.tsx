"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AccountRelation } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllSiatMotionAccounts, postConciliation } from "@/lib/data";
import { toast } from "sonner";
import { AxiosError } from "axios";

const linkAccountFormSchema = z.object({
  accountId: z.coerce.number(), //id cuenta empresa
  accountRef: z.coerce.number(), //id cuenta siat
});

export type LinkAccountForm = z.infer<typeof linkAccountFormSchema>;

type LinkAccountFormProps = {
  accountToLink: AccountRelation;
};

export default function LinkAccountForm({
  accountToLink,
}: LinkAccountFormProps) {
  const linkAccountForm = useForm<LinkAccountForm>({
    resolver: zodResolver(linkAccountFormSchema),
    defaultValues: {
      accountId: accountToLink.accountId,
      accountRef: undefined,
    },
  });

  const queryClient = useQueryClient();

  const linkAccountMutation = useMutation({
    mutationFn: postConciliation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllAccountRelation"] });
      toast.success("Cuentas enlazadas correctamente");
    },
    onError: (error: AxiosError) => {
      toast.error("Hubo un error al conciliar las cuentas");
      console.log(error);
    },
  });

  function onSubmit(values: LinkAccountForm) {
    console.log(values);
    linkAccountMutation.mutate(values);
  }

  const {
    data: siatAccounts,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["AllSiatMotionAccounts"],
    queryFn: fetchAllSiatMotionAccounts,
  });

  if (siatAccounts === undefined || isLoading || isPending)
    return <div>Cargando...</div>;

  return (
    <Form {...linkAccountForm}>
      <form
        onSubmit={linkAccountForm.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div>
          Cuenta Seleccionada: {accountToLink.accountDescription} -{" "}
          {accountToLink.accountCode}
        </div>
        <FormField
          control={linkAccountForm.control}
          name="accountRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuentas Siat</FormLabel>
              <FormControl>
                <Select
                  options={siatAccounts}
                  getOptionLabel={(siatAccounts) =>
                    `${siatAccounts.code} - ${siatAccounts.description}`
                  }
                  getOptionValue={(siatAccounts) => siatAccounts.id.toString()}
                  onChange={(selectedAccount) =>
                    field.onChange(selectedAccount?.id)
                  }
                  maxMenuHeight={200}
                  minMenuHeight={10}
                />
              </FormControl>
              <FormDescription>
                Seleccione una cuenta del SIAT con la cual se va a relacionar la
                cuenta seleccionada
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
