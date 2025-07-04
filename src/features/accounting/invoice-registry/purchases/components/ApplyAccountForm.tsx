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
  ApplyAccountSchema,
  applyAccountSchema,
} from "../schemas/applyAccountSchema";
import { AccountSelect } from "@/features/accounting/account/components/AccountSelect";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  purchaseId: number;
};

export function ApplyAccountForm({ purchaseId }: Props) {
  const form = useForm<ApplyAccountSchema>({
    resolver: zodResolver(applyAccountSchema),
    defaultValues: {
      accountDebitId: 0,
      accountAssetId: 0,
      id: purchaseId,
      nit: null,
      all: false,
    },
  });

  function onSubmit(data: ApplyAccountSchema) {
    console.log("Form submitted with data:", data);
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
          name="nit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIT</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="NIT del proveedor"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Ingresa el NIT del proveedor si es necesario.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="all"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Todos</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Marca esta opción si deseas aplicar el asiento a todas las
                compras.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
