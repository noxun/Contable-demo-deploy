"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useConfigValues from "@/features/accounting/config/hooks/useConfigValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ConfigFormType, configFormSchema } from "../schemas/configFormSchema";
import { useUpdateConfigValues } from "../hooks/useUpdateConfigValues";
import { AccountSelect } from "../../account/components/AccountSelect";

export default function ConfigForm() {
  const { data: configValues, isLoading, isError } = useConfigValues();
  const updateConfigValuesMutation = useUpdateConfigValues();

  const configForm = useForm<ConfigFormType>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      ufvValue: 0,
      dollarValue: 6.96,
      stateMain: true,
      ivaValue: 0,
      itValue: 0,
      iceValue: 0,
      iehdValue: 0,
      itfValue: 0,
      tributosAduaneros: 0,
      ufvDate: "",
      minimumWage: 0,
    },
    values: configValues,
  });

  function onSubmit(values: ConfigFormType) {
    console.log(values);
    updateConfigValuesMutation.mutate(values);
  }

  if (isError) {
    return <div>Hubo un error al obtener los valores por defecto</div>;
  }

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <Form {...configForm}>
      <form
        className="grid grid-cols-4 gap-4 w-full"
        onSubmit={configForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={configForm.control}
          name="ufvValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UFVs</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Unidad de Fomento a la Vivienda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="dollarValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dolar</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="ivaValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IVA</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Impuesto al Valor Agregado</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="itValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IT</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Impuesto a las transacciones</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="iceValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ICE</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Impuesto a los consumos específicos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="iehdValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IEHD</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Impuesto especial a los hidrocarburos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="itfValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ITF</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Impuesto a las transacciones financieras
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="minimumWage"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Salario minimo nacional</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Salario minimo nacional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="tributosAduaneros"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Tributos Aduaneros</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Tributos Aduaneros</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountImpId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Impuesto a las transacciones</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountImpId"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para el impuesto a las transacciones
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountSaleId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Ventas y/o Servicios</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountSaleId"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para ventas y/o servicios
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountDebitIvaId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Débito Fiscal IVA</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountDebitIvaId"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para el débito fiscal IVA
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountImpByPayId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Impuesto a las trans. por pagar</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountImpByPayId"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para el impuesto a las transacciones por pagar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountCreditIvaId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Crédito Fiscal IVA</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountCreditIvaId"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para el crédito fiscal IVA
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountBuyId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Cuenta de Compras</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountBuyId"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para las compras de inventario o mercadería
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountSalariesAndWages"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Cuenta de Sueldos y Salarios</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountSalariesAndWages"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para los sueldos y salarios del personal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={configForm.control}
          name="accountFixedAsset"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Cuenta de Activo Fijo</FormLabel>
              <FormControl>
                <AccountSelect
                  usePortal={false}
                  name="accountFixedAsset"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Cuenta contable para los activos fijos de la empresa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="col-span-4 justify-self-end mt-6 w-1/3"
        >
          Guardar
        </Button>
      </form>
    </Form>
  );
}
