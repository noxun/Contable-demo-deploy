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
import Select from "react-select";
import useTypeCompanies from "@/features/accounting/shared/hooks/useTypeCompanies";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { importAccountFromExcel } from "@/lib/data";
import { toast } from "sonner";

const importAccountFormSchema = z.object({
  Position: z.string(),
  Data: z.instanceof(File).nullable(),
  TypeCompanyId: z.coerce.string(),
});

type ImportAccount = z.infer<typeof importAccountFormSchema>;

export default function ImportAccountForm() {
  const importAccountForm = useForm<ImportAccount>({
    resolver: zodResolver(importAccountFormSchema),
    defaultValues: {
      Position: "",
      TypeCompanyId: "",
      Data: null,
    },
  });

  const { data: typeCompanies, isPending } = useTypeCompanies();

  function onSubmit(values: ImportAccount) {
    console.log(values);
    const importAccountFormData = new FormData();
    importAccountFormData.append("Position", values.Position);
    importAccountFormData.append("TypeCompanyId", values.TypeCompanyId);
    importAccountFormData.append("Data", values.Data!);

    importAccountMutation.mutate(importAccountFormData);
    //console.log([...importAccountFormData]);
  }

  const importAccountMutation = useMutation({
    mutationFn: importAccountFromExcel,
    onSuccess: () =>{
      toast.success("Archivo enviado correctamente")
    },
    onError: () => {
      toast.error("Hubo un error al enviar el archivo")
    }
  })


  if (isPending || typeCompanies === undefined) return <Spinner />;

  return (
    <Form {...importAccountForm}>
      <form onSubmit={importAccountForm.handleSubmit(onSubmit)}>
        <FormField
          control={importAccountForm.control}
          name="Data"
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
        <FormField
          control={importAccountForm.control}
          name="Position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posicion de...</FormLabel>
              <FormControl>
                <Input placeholder="1-2..." {...field} />
              </FormControl>
              <FormDescription>TBD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={importAccountForm.control}
          name="TypeCompanyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Compania</FormLabel>
              <FormControl>
                <Select
                  options={typeCompanies}
                  getOptionLabel={(typeCompanies) => typeCompanies.name}
                  getOptionValue={(typeCompanies) =>
                    typeCompanies.id.toString()
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.id)
                  }
                />
              </FormControl>
              <FormDescription>
                Si el documento es de la empresa, siat u otro
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={importAccountMutation.isPending} type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
