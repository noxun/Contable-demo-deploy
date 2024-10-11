"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createNewBranch } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";

export default function FormNewBranch() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const newBranchMutation = useMutation({
    mutationFn: createNewBranch,
    onSuccess: () => {
      toast.success("Sucursal Creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["allBranches"] });
      router.push(`/dashboard/branches`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al crear una sucursal");
    },
  });

  function onSubmit(values: BranchForm) {
    console.log(values)
    newBranchMutation.mutate(values);
  }

  type BranchForm = z.infer<typeof branchFormSchema>;

  const branchFormSchema = z.object({
    nameSucutsal: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string().email(),
    personInCharge: z.string(),
    status: z.boolean(),
  });

  const branchForm = useForm<BranchForm>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      nameSucutsal: "",
      address: "",
      phone: "",
      email: "",
      personInCharge: "",
      status: true,
    },
  });

  return (
    <Form {...branchForm}>
      <form onSubmit={branchForm.handleSubmit(onSubmit)}>
        <FormField
          control={branchForm.control}
          name="nameSucutsal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la sucursal</FormLabel>
              <FormControl>
                <Input  {...field}></Input>
              </FormControl>
              <FormDescription>
                El nombre de la sucursal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={branchForm.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direccion</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormDescription>
                La direccion de la sucursal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={branchForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefono</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormDescription>
                El telefono de la sucursal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={branchForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electronico</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormDescription>
                Correo Electronico de la sucursal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={branchForm.control}
          name="personInCharge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona a Cargo</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormDescription>
                Persona a cargo de la sucursal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={branchForm.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Si la sucursal esta activa o no
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={newBranchMutation.isPending}>
          <span className="mr-2">Guardar Registro</span>
          <Save size={20} />
        </Button>
      </form>
    </Form>
  );
}
