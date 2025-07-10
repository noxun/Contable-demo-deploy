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
  ApplyAccountFormSchema,
  applyAccountFormSchema,
} from "../schemas/applyAccountSchema";
import { AccountSelect } from "@/features/accounting/account/components/AccountSelect";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { transformForApiApplyAccount } from "../utils/transformForApiApplyAccount";
import { useApplyPurchaseAccount } from "../hooks/useApplyPurchaseAccount";
import { Button } from "@/components/ui/button";

type Props = {
  purchaseId: number;
  nit: number;
};

export function ApplyAccountForm({ purchaseId, nit }: Props) {
  const form = useForm<ApplyAccountFormSchema>({
    resolver: zodResolver(applyAccountFormSchema),
    defaultValues: {
      mode: "one",
      accountDebitId: 0,
      accountAssetId: 0,
      id: purchaseId,
      nit: nit,
      all: false,
    },
  });

  const applyAccountMutation = useApplyPurchaseAccount();

  function onSubmit(data: ApplyAccountFormSchema) {
    console.log("Form submitted with data:", data);
    const apiPayload = transformForApiApplyAccount(data);
    applyAccountMutation.mutate(apiPayload);
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
                  name="accountDebitId"
                  value={field.value ? field.value.toString() : null}
                  onChange={field.onChange}
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
          name="accountAssetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuenta Haber</FormLabel>
              <FormControl>
                <AccountSelect
                  name="accountAssetId"
                  value={field.value ? field.value.toString() : null}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Selecciona la cuenta de haber para aplicar el asiento.
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
          disabled={applyAccountMutation.isPending}
          className="w-full"
        >
          {applyAccountMutation.isPending ? "Aplicando..." : "Aplicar Cuentas"}
        </Button>
      </form>
    </Form>
  );
}
