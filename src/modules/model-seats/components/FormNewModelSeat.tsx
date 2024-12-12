"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Plus, Save, Trash2 } from "lucide-react";
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
import { postModelSeat } from "@/lib/data";
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

const modelSeatItemSchema = z.object({
  debit: z.boolean(),
  asset: z.boolean(),
  percentage: z.coerce.number().min(0).max(100),
  accountId: z.coerce.number(),
});

const modelSeatFormSchema = z.object({
  description: z.string(),
  typeTransaction: z.enum(["ingresos", "egresos", "diarios"]),
  accounts: z.array(modelSeatItemSchema).min(1),
});

export type ModelSeatForm = z.infer<typeof modelSeatFormSchema>;

export default function FormNewModelSeat() {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  function onSubmit(values: ModelSeatForm) {
    console.log(values)
    newModelSeatMutation.mutate(values);
  }

  const modelSeatForm = useForm<ModelSeatForm>({
    resolver: zodResolver(modelSeatFormSchema),
    defaultValues: {
      description: "",
      typeTransaction: "ingresos",
    },
  });

  console.log(modelSeatForm.formState.errors)

  const { fields, append, remove } = useFieldArray({
    control: modelSeatForm.control,
    name: "accounts",
  });

  const handleAdd = () => {
    append({
      accountId: 0,
      debit: false,
      asset: false,
      percentage: 0,
    });
  };

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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripción" {...field}></Input>
                    </FormControl>
                    <FormDescription>
                      La descripción del asiento a guardar
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                        control={modelSeatForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <NoMenuSelect
                                placeholder="Selecciona una Cuenta.."
                                options={motionAccounts}
                                getOptionLabel={(motionAccount) =>
                                  `${motionAccount.code} - ${motionAccount.description}`
                                }
                                getOptionValue={(motionAccount) =>
                                  motionAccount.id.toString()
                                }
                                onChange={(option) => {
                                  field.onChange(option?.id);
                                }}
                                value={(Array.isArray(motionAccounts)
                                  ? motionAccounts
                                  : []
                                ).find(
                                  (motionAccount) =>
                                    motionAccount.id === parentField.accountId
                                )}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={modelSeatForm.control}
                        name={`accounts.${index}.debit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  modelSeatForm.setValue(`accounts.${index}.asset`, !checked)
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={modelSeatForm.control}
                        name={`accounts.${index}.asset`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  modelSeatForm.setValue(`accounts.${index}.debit`, !checked)
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
          <Button type="submit" disabled={newModelSeatMutation.isPending}>
            <span className="mr-2">Guardar Registro</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
    </div>
  );
}
