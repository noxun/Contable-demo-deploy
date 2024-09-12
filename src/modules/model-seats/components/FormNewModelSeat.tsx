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
//import FormNewVoucherItems from "./FormNewVoucherItems";
import Spinner from "@/components/ui/spinner";
import useMotionAccounts from "@/modules/shared/hooks/useMotionAccounts";
import { ModelSeatItem, PostModelSeat } from "@/lib/types";
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
      router.push(`/dashboard/model-seats`); //de momento, luego pasar el route
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al crear un asiento modelo");
    },
  });

  function onSubmit(values: z.infer<typeof modelSeatFormSchema>) {
    const newValues = {
      description: values.description,
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
    accounts: z.array(modelSeatItemSchema).optional(),
  });

  const modelSeatForm = useForm<z.infer<typeof modelSeatFormSchema>>({
    resolver: zodResolver(modelSeatFormSchema),
    defaultValues: {
      description: "",
    },
  });

  if (motionAccounts === undefined || isLoadingAccounts || isPendingAccounts) {
    return <Spinner />;
  }

  return (
    <div>
      <Form {...modelSeatForm}>
        <form onSubmit={modelSeatForm.handleSubmit(onSubmit)}>
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
