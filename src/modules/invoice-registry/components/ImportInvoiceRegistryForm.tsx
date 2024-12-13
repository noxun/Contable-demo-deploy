"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importInvoiceRegistryExcel } from "@/lib/data";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const importInvoiceRegistryFormSchema = z.object({
  InvoiceRegistryType: z.string(), //provisional
  File: z.instanceof(File).nullable(),
});

type ImportInvoiceRegistry = z.infer<typeof importInvoiceRegistryFormSchema>;

export default function ImportInvoiceRegistryForm() {

  const queryClient = useQueryClient();

  const importInvoiceRegistryForm = useForm<ImportInvoiceRegistry>({
    resolver: zodResolver(importInvoiceRegistryFormSchema),
    defaultValues: {
      File: null,
    },
  });

  function onSubmit(values: ImportInvoiceRegistry) {
    console.log(values);
    const importInvoiceRegistryFormData = new FormData();
    importInvoiceRegistryFormData.append(
      "InvoiceRegistryType",
      values.InvoiceRegistryType
    );
    importInvoiceRegistryFormData.append("File", values.File!);

    importInvoiceRegistryMutation.mutate(importInvoiceRegistryFormData);
    //console.log([...importAccountFormData]);
  }

  const importInvoiceRegistryMutation = useMutation({
    mutationFn: importInvoiceRegistryExcel,
    onSuccess: () => {
      toast.success("Archivo enviado correctamente");
      //cerrar modal tambien
      //el proceso podria tomar un rato asi que tal vez un settimeout
      if(importInvoiceRegistryForm.getValues("InvoiceRegistryType") === "0"){
        queryClient.invalidateQueries({queryKey:["invoiceRegistry", 0]})
      }else{
        queryClient.invalidateQueries({queryKey:["invoiceRegistry", 1]})
      }
    },
    onError: () => {
      toast.error("Hubo un error al enviar el archivo");
    },
  });

  return (
    <Form {...importInvoiceRegistryForm}>
      <form onSubmit={importInvoiceRegistryForm.handleSubmit(onSubmit)}>
        <FormField
          control={importInvoiceRegistryForm.control}
          name="InvoiceRegistryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Compras</SelectItem>
                    <SelectItem value="1">Ventas</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Si el archivo es de compras o ventas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={importInvoiceRegistryForm.control}
          name="File"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Archivo</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormDescription>Archivo en formato .xlsx</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={importInvoiceRegistryMutation.isPending}
          type="submit"
        >
          Guardar
        </Button>
      </form>
    </Form>
  );
}
