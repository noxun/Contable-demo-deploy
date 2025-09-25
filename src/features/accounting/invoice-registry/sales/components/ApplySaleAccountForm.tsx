"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ApplySaleAccountFormSchema,
  applySaleAccountFormSchema,
} from "../schemas/applySaleAccountSchema";
import { AccountSelect } from "@/features/accounting/account/components/AccountSelect";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { transformForApiApplySaleAccount } from "../utils/transformForApiApplySaleAccount";
import { useApplySaleAccount } from "../hooks/useApplySaleAccount";
import { Button } from "@/components/ui/button";

type Props = {
  saleId: number;
  nit: string;
};

export function ApplySaleAccountForm({ saleId, nit }: Props) {
  const form = useForm<ApplySaleAccountFormSchema>({
    resolver: zodResolver(applySaleAccountFormSchema),
    defaultValues: {
      mode: "one",
      accountDebitId: 0,
      id: saleId,
      nit: Number(nit),
      all: false,
    },
  });

  const applySaleAccountMutation = useApplySaleAccount();

  function onSubmit(data: ApplySaleAccountFormSchema) {
    console.log("Form submitted with data:", data);
    const apiPayload = transformForApiApplySaleAccount(data);
    applySaleAccountMutation.mutate(apiPayload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountDebitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuenta Débito</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  value={field.value ? field.value.toString() : ""}
                  onChange={(value) => field.onChange(Number(value))}
                />
              </FormControl>
              <FormDescription>
                Selecciona la cuenta de débito para aplicar el asiento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Alcance de la aplicación</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col"
                >
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="one" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Asignar cambios solo a esta factura
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="nit" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Asignar cambios a todas las facturas con el mismo NIT
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Asignar cambios a todas las facturas
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={applySaleAccountMutation.isPending}
          className="w-full"
        >
          {applySaleAccountMutation.isPending ? "Aplicando..." : "Aplicar Cuentas"}
        </Button>
      </form>
    </Form>
  );
}
