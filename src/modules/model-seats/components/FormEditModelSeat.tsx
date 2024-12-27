"use client";

import { ModelSeatDetailResponse } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoMenuSelect from "@/components/custom/no-menu-select";
import { Checkbox } from "@/components/ui/checkbox";
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
  description: z.string().min(1, "Se requiere una descripción "),
  type: z.coerce.number(),
  // typeTransaction: ,
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
      console.log(error);
      toast.error("Hubo un error al modificar el asiento modelo");
    },
    onSuccess: () => {
      toast.success("Asiento Modelo editado correctamente");
      queryClient.invalidateQueries({ queryKey: ["AllModelSeats"] });
      router.push("/dashboard/model-seats");
    },
  });

  const editModelSeatForm = useForm<EditModelSeat>({
    resolver: zodResolver(editModelSeatSchema),
    defaultValues: {
      modelSeatId: modelSeat.id,
      description: modelSeat.description,
      type: modelSeat.type,
      accounts: modelSeat.accounts,
    },
  });

  console.log(editModelSeatForm.formState.errors);

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
      accountId: 0, //ojo con esto eh
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Traspasos</SelectItem>
                  <SelectItem value="1">Egresos</SelectItem>
                  <SelectItem value="2">Ingresos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLoading && accountsList === undefined ? (
          <div>Cargando cuentas..</div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Asiento Modelo</h2>
              <Button type="button" onClick={handleAdd}>
                <span className="mr-2">Adicionar Item</span>
                <Plus size={18} />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Es Debe</TableHead>
                  <TableHead>Es Haber</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((parentField, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-fit w-72">
                      <FormField
                        name={`accounts.${index}.accountId`}
                        control={editModelSeatForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <NoMenuSelect
                                placeholder="Selecciona una Cuenta.."
                                options={accountsList}
                                getOptionLabel={(account) =>
                                  `${account.code} - ${account.description}`
                                }
                                getOptionValue={(account) =>
                                  account.id.toString()
                                }
                                onChange={(option) => {
                                  field.onChange(option?.id);
                                }}
                                value={(Array.isArray(accountsList)
                                  ? accountsList
                                  : []
                                ).find(
                                  (account) =>
                                    account.id === parentField.accountId
                                )}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={editModelSeatForm.control}
                        name={`accounts.${index}.debit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  editModelSeatForm.setValue(
                                    `accounts.${index}.asset`,
                                    !checked
                                  );
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={editModelSeatForm.control}
                        name={`accounts.${index}.asset`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  editModelSeatForm.setValue(
                                    `accounts.${index}.debit`,
                                    !checked
                                  );
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        name={`accounts.${index}.percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Button type="submit">Guardar Cambios</Button>
      </form>
    </Form>
  );
}
