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
import { registerPayment } from "@/lib/data";
import { toast } from "sonner";

const importBankExcerptFormSchema = z.object({
  BankDetailId: z.string(),
  File: z.instanceof(File).nullable(),
  Number: z.coerce.number(),
  Status: z.string(),
  Providor: z.string(),
});

type ImportBankExcerpt = z.infer<typeof importBankExcerptFormSchema>;

export default function ImportBankExcerptRegisterPaymentForm({
  bankExtractId,
}: {
  bankExtractId: string | number;
}) {
  const importBankExcerptForm = useForm<ImportBankExcerpt>({
    resolver: zodResolver(importBankExcerptFormSchema),
    defaultValues: {
      BankDetailId: bankExtractId.toString(),
      File: null,
    },
  });

  const queryClient = useQueryClient();

  function onSubmit(values: ImportBankExcerpt) {
    console.log(values);
    const importBankExcerptFormData = new FormData();
    importBankExcerptFormData.append("BankDetailId", values.BankDetailId);
    importBankExcerptFormData.append("File", values.File!);

    importBankExcerptMutation.mutate(importBankExcerptFormData);
    //console.log([...importAccountFormData]);
  }

  const importBankExcerptMutation = useMutation({
    mutationFn: registerPayment,
    onSuccess: () => {
      toast.success("Archivo enviado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["bankExtractPaymentFiles", bankExtractId],
      });
    },
    onError: () => {
      toast.error("Hubo un error al enviar el archivo");
    },
  });

  return (
    <Form {...importBankExcerptForm}>
      <form onSubmit={importBankExcerptForm.handleSubmit(onSubmit)}>
        <FormField
          control={importBankExcerptForm.control}
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
        <FormField
          control={importBankExcerptForm.control}
          name="Number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero</FormLabel>
              <FormControl>
                <Input placeholder="Numero" {...field} />
              </FormControl>
              <FormDescription>Numero del documento</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={importBankExcerptForm.control}
          name="Status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="Estado" {...field} />
              </FormControl>
              <FormDescription>Estado del documento</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={importBankExcerptForm.control}
          name="Providor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <FormControl>
                <Input placeholder="Proveedor" {...field} />
              </FormControl>
              <FormDescription>Proveedor</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={importBankExcerptMutation.isPending} type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  );
}
