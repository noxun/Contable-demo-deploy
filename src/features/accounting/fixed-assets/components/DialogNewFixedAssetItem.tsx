import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Zod schema for form validation
const formSchema = z.object({
  tipoActivo: z.string().min(1, { message: "Tipo de activo es requerido" }),
  year: z.number().min(1900, { message: "Año debe ser válido" }),
});

export function DialogNewFixedAssetItem() {
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoActivo: "",
      year: new Date().getFullYear(),
    },
  });

  // Mutation for creating fixed assets
  const createFixedAssetMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await api.post("/FixedAssets/FixedAseets", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Activo fijo creado correctamente");
      form.reset();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al crear activo fijo");
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createFixedAssetMutation.mutate(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Crear Activo Fijo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Activo Fijo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tipoActivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Activo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese tipo de activo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ingrese año"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createFixedAssetMutation.isPending}>
              {createFixedAssetMutation.isPending
                ? "Creando..."
                : "Crear Activo"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogNewFixedAssetItem;
