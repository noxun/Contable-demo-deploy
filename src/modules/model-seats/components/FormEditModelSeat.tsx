"use client";

import { ModelSeatDetailResponse } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import useAccounts from "@/modules/shared/hooks/useAccounts";
import CustomSelect from "@/components/custom/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putModelSeat } from "@/lib/data";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const accountSchema = z.object({
  accountId: z.number(),
  debit: z.boolean(),
  asset: z.boolean(),
  percentage: z.number().min(0).max(100),
});

const editModelSeatSchema = z.object({
  modelSeatId: z.number(),
  description: z.string().min(1, "Se requiere un descripcion "),
  typeTransaction: z.enum(["ingresos", "egresos", "diarios"]),
  accounts: z.array(accountSchema).min(1, "Se requiere al menos una cuenta"),
});

export type EditModelSeat = z.infer<typeof editModelSeatSchema>;

export default function FormEditModelSeat({
  modelSeat,
}: {
  modelSeat: ModelSeatDetailResponse;
}) {
  const { data: accountsList, isLoading, isError } = useAccounts();

  const queryClient = useQueryClient();
  const router = useRouter();

  const editModelSeatMutation = useMutation({
    mutationFn: putModelSeat,
    onError: (error: AxiosError) => {
      console.log(error)
      toast.error("Hubo un error al modificar el asiento modelo");
    },
    onSuccess: () => {
      toast.error("Asiento Modelo editado correctamente");
      queryClient.invalidateQueries({queryKey:["AllModelSeats"]});
      router.push("/dashboard/model-seats");
    }
  })


  const editModelSeatForm = useForm<EditModelSeat>({
    resolver: zodResolver(editModelSeatSchema),
    defaultValues: {
      modelSeatId: modelSeat.id,
      description: modelSeat.description,
      typeTransaction: modelSeat.typeTransaction,
      accounts: modelSeat.accounts,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: editModelSeatForm.control,
    name: "accounts",
  });

  function onSubmit(values: EditModelSeat) {
    console.log(values);
    editModelSeatMutation.mutate(values);
  }

  const handleAdd = () => {
    append({
      //TODO: agregar mejor validacion a esto
      accountId: 0,//ojo con esto eh
      debit: false,
      asset: false,
      percentage: 0,
    });
  };

  return (
    <Form {...editModelSeatForm}>
      <form
        onSubmit={editModelSeatForm.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={editModelSeatForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={editModelSeatForm.control}
          name="typeTransaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ingresos">Ingresos</SelectItem>
                  <SelectItem value="egresos">Egresos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading && accountsList === undefined ? (
          <div>Cargando cuentas..</div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Cuentas</h3>
              <Button type="button" variant="outline" onClick={handleAdd}>
                Agregar Cuenta
              </Button>
            </div>

            {fields.map((fieldTop, index) => (
              <div key={fieldTop.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <FormField
                  control={editModelSeatForm.control}
                  name={`accounts.${index}.accountId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuenta</FormLabel>
                      <FormControl>
                        <CustomSelect
                          value={(accountsList ?? []).find(
                            (account) => account.id === fieldTop.accountId
                          ) ?? []}
                          onChange={(option) => {
                            field.onChange(option?.id);
                          }}
                          options={accountsList}
                          getOptionLabel={(account) => account.description}
                          getOptionValue={(account) => account.id.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editModelSeatForm.control}
                    name={`accounts.${index}.debit`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel>Es Debe</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editModelSeatForm.control}
                    name={`accounts.${index}.asset`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel>Es haber</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editModelSeatForm.control}
                  name={`accounts.${index}.percentage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <Button type="submit">Guardar Cambios</Button>
      </form>
    </Form>
  );
}
