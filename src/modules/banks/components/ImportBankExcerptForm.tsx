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
import { useMutation } from "@tanstack/react-query";
import { importBankExcerptFromExcel } from "@/lib/data";
import { toast } from "sonner";

const importBankExcerptFormSchema = z.object({
  BankId: z.string(),
  File: z.instanceof(File).nullable(),
});

type ImportBankExcerpt = z.infer<typeof importBankExcerptFormSchema>;

export default function ImportBankExcerptForm({
  bankId,
}: {
  bankId: string | number;
}) {
  const importBankExcerptForm = useForm<ImportBankExcerpt>({
    resolver: zodResolver(importBankExcerptFormSchema),
    defaultValues: {
      BankId: bankId.toString(),
      File: null,
    },
  });



  function onSubmit(values: ImportBankExcerpt) {
    console.log(values);
    const importBankExcerptFormData = new FormData();
    importBankExcerptFormData.append("BankId", values.BankId);
    importBankExcerptFormData.append("File", values.File!);

    importBankExcerptMutation.mutate(importBankExcerptFormData);
    //console.log([...importAccountFormData]);
  }

  const importBankExcerptMutation = useMutation({
    mutationFn: importBankExcerptFromExcel,
    onSuccess: () =>{
      toast.success("Archivo enviado correctamente")
    },
    onError: () => {
      toast.error("Hubo un error al enviar el archivo")
    }
  })

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
              <FormDescription>
                Archivo en formato .xlsx
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={importBankExcerptMutation.isPending} type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
