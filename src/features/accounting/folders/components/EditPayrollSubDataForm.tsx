"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import CustomSelect from "@/components/custom/select";
import useDropdownOptions from "@/features/accounting/shared/hooks/useDropdownOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSubData, putSubData } from "@/lib/trazo-data";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { SubData } from "@/lib/trazoTypes";
import { useEditPayrollSubDataMutation } from "../hooks/useEditPayrollSubDataMutation";

const editPayrollSubDataSchema = z.object({
  label: z.string(),
  description: z.coerce.number(),
  description2: z.coerce.number(),
  observation: z.coerce.number(),
});

export type EditPayrollSubDataFormValues = z.infer<
  typeof editPayrollSubDataSchema
>;

export default function EditPayrollSubDataForm({
  subData,
  procedureId,
  urlLabel,
  subDataId,
}: {
  subData: SubData;
  urlLabel:
    | "atributos"
    | "botrosgastos"
    | "cgastosdeoperaciones"
    | "dhonorariosProfesionales";
  procedureId: number;
  subDataId: number;
}) {
  const form = useForm<EditPayrollSubDataFormValues>({
    resolver: zodResolver(editPayrollSubDataSchema),
    defaultValues: {
      label: subData.label,
      description: parseFloat(subData.description),
      description2: parseFloat(subData.description2),
      observation: parseFloat(subData.observation),
    },
  });

  const queryClient = useQueryClient();

  const {
    data: dropdownOptions,
    isLoading,
    isError,
  } = useDropdownOptions(urlLabel);

  const editPayrollSubDataMutation = useEditPayrollSubDataMutation();

  const onSubmit = (values: EditPayrollSubDataFormValues) => {
    console.log(values);
    editPayrollSubDataMutation.mutate({
      data: values,
      subDataId,
    });
    form.reset();
  };

  const { watch, setValue } = form;
  const description = watch("description");
  const description2 = watch("description2");

  useEffect(() => {
    setValue("observation", description - description2); // Sync description2 with description
  }, [description, description2, setValue]);

  if (isError) {
    return <div>Hubo un error al obtener las opciones del dropdown</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lista de Campos</FormLabel>
              <FormControl>
                <CustomSelect
                  value={dropdownOptions?.find(
                    (option) => option.name === field.value
                  )}
                  options={
                    Array.isArray(dropdownOptions) ? dropdownOptions : []
                  }
                  isLoading={isLoading}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.name}
                  onChange={(option) => field.onChange(option?.name ?? "")}
                />
              </FormControl>
              <FormDescription>La lista de campos</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto Proforma</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Monto del campo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto Planilla</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Monto del campo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
