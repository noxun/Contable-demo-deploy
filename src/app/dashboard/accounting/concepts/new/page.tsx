"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import useToken from "@/features/accounting/shared/hooks/useToken";
import { Account } from "@/features/accounting/account/types/account";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Concept } from "@/features/accounting/concepts/types/concept";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/custom/select";

const newConceptFormSchema = z.object({
  acronym: z.string(),
  description: z.string(),
  typeOfExpense: z.string(),
  typeOfTax: z.string(),
  order: z.coerce.number(),
  accountId: z.coerce.number().or(z.string()),
});

export default function NewConceptPage() {

  const router = useRouter();
  const queryClient = useQueryClient();

  const newConceptForm = useForm<z.infer<typeof newConceptFormSchema>>({
    resolver: zodResolver(newConceptFormSchema),
    defaultValues: {
      acronym: "",
      description: "",
      typeOfExpense: "",
      typeOfTax: "",
      order: 0,
      accountId: "",
    },
  });

  function onSubmit(values: z.infer<typeof newConceptFormSchema>) {
    console.log(values);
    newConceptMutation.mutate(values);
  }

  const {token, isTokenReady} = useToken();

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
      )
      return response.data;
    },
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  const newConceptMutation = useMutation({
    mutationFn: async (data: Concept) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ConceptExpense`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data;
    },
    onSuccess: () => {
      toast.success("Concepto creado exitosamente");
      queryClient.invalidateQueries({queryKey:["Concepts"]});
      router.push("/dashboard/accounting/concepts");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error al crear el concepto")
    }
  })

  const accountData = accountsQuery.data ?? [];

  const accountOptions = accountData!.map((item) => ({
    value: item.id.toString(),
    label: `${item.code} - ${item.description}`,
    //...item
  }));

  if (accountsQuery.isLoading || accountsQuery.isPending) {
    return <div>Cargando...</div>
  }

  return (
    <main>
      <Form {...newConceptForm}>
        <h2 className="text-xl font-bold mb-5 text-center">
          Formulario para crear una nuevo concepto
        </h2>
        <form
          onSubmit={newConceptForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full">
          
          <FormField
            control={newConceptForm.control}
            name="acronym"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acronimo</FormLabel>
                <FormControl>
                  <Input placeholder="Acronimo" {...field} />
                </FormControl>
                <FormDescription>Acronimo del concepto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newConceptForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Input placeholder="Descripcion" {...field} />
                </FormControl>
                <FormDescription>Descripcion del concepto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newConceptForm.control}
            name="typeOfExpense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Gasto</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo de gasto" {...field} />
                </FormControl>
                <FormDescription>El tipo de gasto del concepto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="w-full">
          <FormField
            control={newConceptForm.control}
            name="typeOfTax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Impuesto</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo de impuesto" {...field} />
                </FormControl>
                <FormDescription>
                  El tipo de impuesto del concepto
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newConceptForm.control}
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
            control={newConceptForm.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta</FormLabel>
                <FormControl>
                  <CustomSelect
                    menuPlacement="top"
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
          </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
