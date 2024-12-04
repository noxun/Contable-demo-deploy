"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import useMotionAccounts from "@/modules/shared/hooks/useMotionAccounts";
import { ModelSeatItem } from "@/lib/types";
import FormNewModelSeatItems from "./FormNewModelSeatItems";
import { postModelSeat } from "@/lib/data";

export default function FormNewModelSeat() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [modelSeatItems, setModelSeatItems] = useState<ModelSeatItem[]>([
    {
      accountId: "",
      debit: false,
      asset: false,
      percentage: 0,
    },
  ]);

  const {
    data: motionAccounts,
    isLoading: isLoadingAccounts,
    isPending: isPendingAccounts,
  } = useMotionAccounts();

  const newModelSeatMutation = useMutation({
    mutationFn: postModelSeat,
    onSuccess: () => {
      toast.success("Asiento Modelo Creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["AllModelSeats"] });
      router.push(`/dashboard/model-seats`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al crear un asiento modelo");
    },
  });

  function onSubmit(values: z.infer<typeof modelSeatFormSchema>) {
    const newValues = {
      description: values.description,
      typeTransaction: values.typeTransaction,
      accounts: modelSeatItems
    }
    console.log(newValues)
    newModelSeatMutation.mutate(newValues);
  }

  const modelSeatItemSchema = z.object({
    debit: z.boolean(),
    asset: z.boolean(),
    accountId: z.coerce.number().optional(),
  });

  const modelSeatFormSchema = z.object({
    description: z.string(),
    typeTransaction: z.enum(["ingresos", "egresos", "diarios"]),
    accounts: z.array(modelSeatItemSchema).optional(),
  });

  const modelSeatForm = useForm<z.infer<typeof modelSeatFormSchema>>({
    resolver: zodResolver(modelSeatFormSchema),
    defaultValues: {
      description: "",
      typeTransaction: "ingresos",
    },
  });

  if (motionAccounts === undefined || isLoadingAccounts || isPendingAccounts) {
    return <Spinner />;
  }

  return (
    <div>
      <Form {...modelSeatForm}>
        <form onSubmit={modelSeatForm.handleSubmit(onSubmit)}>
          <div className="flex flex-col sm:flex-row gap-5 mb-5">
          <div className="w-full">
          <FormField
            control={modelSeatForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Input placeholder="Descripcion" {...field}></Input>
                </FormControl>
                <FormDescription>
                  La descripcion del asiento a guardar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="w-full">
            
          <FormField
            control={modelSeatForm.control}
            name="typeTransaction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Transacción</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de transacción" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ingresos">Ingresos</SelectItem>
                    <SelectItem value="egresos">Egresos</SelectItem>
                    <SelectItem value="traspasos">Traspasos</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seleccione el tipo de transacción para este asiento modelo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          </div>
          <FormNewModelSeatItems
            modelSeatItems={modelSeatItems}
            setModelSeatItems={setModelSeatItems}
            accountData={motionAccounts}
          />
          <Button type="submit" disabled={newModelSeatMutation.isPending}>
            <span className="mr-2">Guardar Registro</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
    </div>   
  );
}