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
import { postSubData } from "@/lib/trazo-data";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

const addPayrollSubDataSchema = z.object({
  label: z.string(),
  description: z.coerce.number(),
  description2: z.coerce.number(),
});

export type AddPayrollSubDataFormValues = z.infer<
  typeof addPayrollSubDataSchema
>;

export default function AddPayrollSubDataForm({
  procedureId,
  fieldId,
  urlLabel,
}: {
  urlLabel:
    | "atributos"
    | "botrosgastos"
    | "cgastosdeoperaciones"
    | "dhonorariosProfesionales";
  procedureId: number;
  fieldId: 531 | 532 | 533 | 534;
}) {
  const form = useForm<AddPayrollSubDataFormValues>({
    resolver: zodResolver(addPayrollSubDataSchema),
    defaultValues: {
      label: "",
      description: 0,
      description2: 0,
    },
  });

  const queryClient = useQueryClient();

  const { data: dropdownOptions, isLoading, isError } = useDropdownOptions(urlLabel);

  const addPayrollSubDataMutation = useMutation({
    mutationFn: postSubData,
    onSuccess: () => {
      form.reset();
      toast.success("Campo agregado correctamente");
      queryClient.invalidateQueries({queryKey: ["procedureDataset", procedureId]});
    },
    onError: (error: AxiosError) => {
      console.error(error);
      toast.error("Error al agregar el campo");
    }
  })

  const onSubmit = (values: AddPayrollSubDataFormValues) => {
    console.log(values);
    addPayrollSubDataMutation.mutate({
      procedureId,
      fieldId,
      data: values
    })
  };

  const { watch, setValue } = form;
  const description = watch("description"); 

  useEffect(() => {
    setValue("description2", description); // Sync description2 with description
  }, [description, setValue]);


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
                  options={Array.isArray(dropdownOptions) ? dropdownOptions : []}
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
              <FormLabel>Monto</FormLabel>
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
