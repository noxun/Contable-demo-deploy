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
import useToken from "@/modules/shared/hooks/useToken";
import { Account } from "@/modules/account/types/account";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/custom/select";

const newEntityFormSchema = z.object({
  code: z.coerce.number().or(z.string()),
  name: z.string(),
  nitCi: z.string(),
  acronym: z.string(),
  email: z.string().email(),
  phone: z.string(),
  accountId: z.coerce.number().or(z.string()),
});

export default function NewEntityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const newEntityForm = useForm<z.infer<typeof newEntityFormSchema>>({
    resolver: zodResolver(newEntityFormSchema),
    defaultValues: {
      code: "",
      name: "",
      nitCi: "",
      acronym: "",
      email: "",
      phone: "",
      accountId: "",
    },
  });

  function onSubmit(values: z.infer<typeof newEntityFormSchema>) {
    console.log(values);
    newEntityMutation.mutate(values);
  }

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

  const newEntityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Entity`, // Actualiza la URL según sea necesario
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
    onSuccess: () => {
      toast.success("Entidad creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Entities"] }); // Actualiza la key según sea necesario
      router.push("/dashboard/entities"); // Actualiza la ruta según sea necesario
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error al crear la entidad");
    },
  });

  const accountData = accountsQuery.data ?? [];

  const accountOptions = accountData!.map((item) => ({
    value: item.id.toString(),
    label: `${item.code} - ${item.description}`,
    //...item
  }));

  if (accountsQuery.isLoading || accountsQuery.isPending) {
    return <div>Cargando...</div>;
  }

  return (
    <main>
      <Form {...newEntityForm}>
        <form
          onSubmit={newEntityForm.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={newEntityForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="nombre" {...field} />
                </FormControl>
                <FormDescription>Nombre de la entidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newEntityForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="codigo
                  "
                    {...field}
                  />
                </FormControl>
                <FormDescription>Codigo de la entidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newEntityForm.control}
            name="nitCi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIT/CI</FormLabel>
                <FormControl>
                  <Input placeholder="NIT o CI" {...field} />
                </FormControl>
                <FormDescription>NIT o CI de la entidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newEntityForm.control}
            name="acronym"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acrónimo</FormLabel>
                <FormControl>
                  <Input placeholder="acrónimo" {...field} />
                </FormControl>
                <FormDescription>Acrónimo de la entidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newEntityForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormDescription>Email de la entidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newEntityForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="teléfono" {...field} />
                </FormControl>
                <FormDescription>Teléfono de la entidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={newEntityForm.control}
            name="accountId"
            render={({ field }) => (
              <FormItem className="col-span-2">
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
          <Button className="col-span-2" type="submit">Guardar</Button>
        </form>
      </Form>
    </main>
  );
}
