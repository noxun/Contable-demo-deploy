"use client";

import { z } from "zod";
import { Concept } from "../types/concept";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account } from "@/modules/account/types/account";
import axios from "axios";
import useToken from "@/modules/shared/hooks/useToken";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Select from "react-select";
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

type FormEditProps = {
  concept: Concept;
};

const editConceptFormSchema = z.object({
  id: z.coerce.number(),
  acronym: z.string(),
  description: z.string(),
  typeOfExpense: z.string(),
  typeOfTax: z.string(),
  order: z.coerce.number(),
  accountId: z.coerce.number().or(z.string()),
});

type EditConceptForm = z.infer<typeof editConceptFormSchema>;

export default function FormEditConcept({ concept }: FormEditProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, isTokenReady } = useToken();

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<Account[]> => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/Filter?isMotion=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  const editConceptForm = useForm<EditConceptForm>({
    resolver: zodResolver(editConceptFormSchema),
    defaultValues: {
      id: concept.id,
      acronym: concept.acronym,
      description: concept.description,
      typeOfExpense: concept.typeOfExpense,
      typeOfTax: concept.typeOfTax,
      order: concept.order,
      accountId: concept.accountId,
    },
  });

  const editConceptMutation = useMutation({
    mutationFn: async (data: EditConceptForm) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ConceptExpense`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error al editar el concepto");
    },
    onSuccess: () => {
      toast.success("Concepto Editado Correctamente");
      queryClient.invalidateQueries({ queryKey: ["Concepts"] });
      router.push("/dashboard/accounting/concepts");
    },
  });

  function onSubmit(values: EditConceptForm) {
    console.log(values);
    editConceptMutation.mutate(values);
  }

  const accountData = accountsQuery.data ?? [];

  const accountOptions = accountData!.map((item) => ({
    value: item.id.toString(),
    label: `${item.code} - ${item.description}`,
  }));

  if (accountsQuery.isLoading || accountsQuery.isPending) {
    return <div>Cargando...</div>;
  }

  //console.log(editConceptForm.formState.errors);

  return (
    <>
      <Form {...editConceptForm}>
        <form
          onSubmit={editConceptForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={editConceptForm.control}
            name="acronym"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acronimo</FormLabel>
                <FormControl>
                  <Input placeholder="acronimo" {...field} />
                </FormControl>
                <FormDescription>Acronimo del concepto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editConceptForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Input placeholder="descripcion" {...field} />
                </FormControl>
                <FormDescription>Descripcion del concepto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editConceptForm.control}
            name="typeOfExpense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Gasto</FormLabel>
                <FormControl>
                  <Input placeholder="tipo de gasto" {...field} />
                </FormControl>
                <FormDescription>El tipo de gasto del concepto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editConceptForm.control}
            name="typeOfTax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Impuesto</FormLabel>
                <FormControl>
                  <Input placeholder="tipo de gasto" {...field} />
                </FormControl>
                <FormDescription>
                  El tipo de impuesto del concepto
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editConceptForm.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden</FormLabel>
                <FormControl>
                  <Input placeholder="orden" {...field} />
                </FormControl>
                <FormDescription>orden</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editConceptForm.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta</FormLabel>
                <FormControl>
                  <Select
                    maxMenuHeight={200}
                    className="my-react-select-container"
                    classNamePrefix="my-react-select"
                    menuPosition="absolute"
                    menuPlacement="top"
                    // styles={{
                    //   menuList: (base) => ({
                    //     ...base,
                    //     height: 50,
                    //     minHeight: 50, // your desired height
                    //   }),
                    // }}
                    isSearchable={true}
                    options={accountOptions}
                    value={accountOptions.find(
                      (option) => option.value === field.value?.toString()
                    )}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value || "")
                    }
                  />
                </FormControl>
                <FormDescription>El nombre de la cuenta</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Guardar</Button>
        </form>
      </Form>
    </>
  );
}
