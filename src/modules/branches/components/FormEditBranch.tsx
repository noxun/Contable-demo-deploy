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
import { updateBranch } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Branch } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

export type BranchEditForm = z.infer<typeof editBranchFormSchema>;

const editBranchFormSchema = z.object({
  id:z.number(),
  nameSucutsal: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  personInCharge: z.string(),
  status: z.boolean(),
});

type FormEditBranchProps = {
  branch: Branch;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function FormEditBranch(
  { branch, setOpen }: FormEditBranchProps
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const editBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      toast.success("Sucursal Editada correctamente");
      queryClient.invalidateQueries({ queryKey: ["allBranches"] });
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al editar una sucursal");
    },
  });

  function onSubmit(values: BranchEditForm) {
    console.log(values)
    editBranchMutation.mutate(values);
  }

  const branchForm = useForm<BranchEditForm>({
    resolver: zodResolver(editBranchFormSchema),
    defaultValues: {
      id: branch.id,
      nameSucutsal: branch.nameSucutsal,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      personInCharge: branch.personInCharge,
      status: branch.status,
    },
  });

  return (
    <Form {...branchForm}>
      <form onSubmit={branchForm.handleSubmit(onSubmit)} >
        <div className="flex flex-col gap-5 sm:flex-row">
        <div className="w-full">
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
        </div>
        <div className="w-full">
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
            <FormItem >
              <div className="flex items-center gap-2 mt-5">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
             
              <FormDescription>
                Si la sucursal esta activa o no
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        </div>
        <div className="flex justify-end">
          <Button className="mt-5" type="submit" disabled={editBranchMutation.isPending}>
            <span className="mr-2">Guardar Registro</span>
            <Save size={20} />
          </Button>
        </div>
      </form>
    </Form>
  );
}
