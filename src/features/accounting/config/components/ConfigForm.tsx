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
import { postUfvValues } from "@/lib/data";
import useConfigValues from "@/features/accounting/shared/hooks/useConfigValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const configFormSchema = z.object({
  ufvValue: z.coerce.number(),
  dollarValue: z.coerce.number(),
  stateMain: z.boolean(),
  ivaValue: z.coerce.number(),
  itValue: z.coerce.number(),
  iceValue: z.coerce.number(),
  iehdValue: z.coerce.number(),
  itfValue: z.coerce.number(),
  tributosAduaneros: z.coerce.number(),
  ufvDate: z.string(),
  minimumWage: z.coerce.number()
});

type ConfigForm = z.infer<typeof configFormSchema>;

export default function ConfigForm() {
  const { data: configValues, isLoading, isError } = useConfigValues();

  const configForm = useForm<ConfigForm>({
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
      minimumWage: 0
    },
    values: configValues,
  });

  const queryClient = useQueryClient();

  const updateConfigValuesMutation = useMutation({
    mutationFn: postUfvValues,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configValues"] });
      toast.success("Valores actualizados correctamente!");
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al actualizar los valores");
    },
  });

  function onSubmit(values: ConfigForm) {
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
        className="grid grid-col-4 gap-4"
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
        <Button type="submit" className="col-start-3 col-end-4">
          Guardar
        </Button>
      </form>
    </Form>
  );
}
