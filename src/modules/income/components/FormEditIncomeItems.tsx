"use client";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { IIncomeItem } from "../interface/income";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";
import { z } from "zod";
import { IBank } from "@/modules/banks/interface/banks";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const accountsSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string(),
  coin: z.string(),
  active: z.boolean().default(true),
  isBudgetable: z.boolean(),
  isMotion: z.boolean(),
  isCost: z.boolean(),
  accountChild: z.array(
    z.object({
      id: z.number(),
      code: z.string(),
      description: z.string(),
      coin: z.string(),
      active: z.boolean().default(true),
      isBudgetable: z.boolean(),
      isMotion: z.boolean(),
      isCost: z.boolean(),
    })
  ),
});

type Account = z.infer<typeof accountsSchema>;

interface Props {
  voucherId: number;
  incomeItems: IIncomeItem[];
  setIncomeItems: Dispatch<SetStateAction<IIncomeItem[]>>;
  data: {
    data: Account[];
  };
}
export const FormEditIncomeItems = (props: Props) => {
  const { data, incomeItems, setIncomeItems, voucherId } = props;

  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    let listIncomeItem = incomeItems;
    listIncomeItem[index] = {
      ...listIncomeItem[index],
      [name]: value,
    };
    setIncomeItems([...listIncomeItem]);
  }
  function onChangeCombobox(value: string, index: number) {
    let listIncomeItem = incomeItems;
    listIncomeItem[index] = {
      ...listIncomeItem[index],
      accountId: value,
    };
    setIncomeItems([...listIncomeItem]);
  }

  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const deleteIncomeItemMutation = useMutation({
    mutationFn: async (incomeItemId: number) => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?id=${incomeItemId}&type=2`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VoucherIncome"] });
      queryClient.invalidateQueries({
        queryKey: ["VoucherIncome", voucherId.toString()],
      });
      toast.success("Elemento eliminado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al editar el elemento");
    },
  });

  const editIncomeItemMutation = useMutation({
    mutationFn: async (incomeItem: IIncomeItem) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?type=2`,
        incomeItem,
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
      queryClient.invalidateQueries({ queryKey: ["VoucherIncome"] });
      queryClient.invalidateQueries({
        queryKey: ["VoucherIncome", voucherId.toString()],
      });
      toast.success("Elemento editado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al editar el elemento");
    },
  });

  function removeIncomeItem(index: number, incomeItemId: number) {
    const updateIncomeItems = incomeItems.filter((_, i) => i != index);
    setIncomeItems([...updateIncomeItems]);
    deleteIncomeItemMutation.mutate(incomeItemId);
  }

  console.log(incomeItems);

  const addIncomeItemSchema = z.object({
    debitBs: z.coerce.number(),
    debitSus: z.number().optional().default(0),
    assetBs: z.coerce.number(),
    assetSus: z.number().optional().default(0),
    gloss: z.string(),
    accountId: z.number(),
    voucherId: z.number(),
  });

  type NewIncomeItem = z.infer<typeof addIncomeItemSchema>;

  const addIncomeItemForm = useForm<NewIncomeItem>({
    resolver: zodResolver(addIncomeItemSchema),
    defaultValues: {
      voucherId: voucherId,
    },
  });

  const addIncomeItemMutation = useMutation({
    mutationFn: async (data: NewIncomeItem) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?type=2&voucherId=${data.voucherId}`,
        [data],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.resetQueries({queryKey:["VoucherIncome", voucherId.toString()]})
      queryClient.invalidateQueries({queryKey:["VoucherIncome"]});
      toast.success("item creado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error al crear el item");
    },
  });

  function onSubmit(values: NewIncomeItem) {
    console.log(values);
    addIncomeItemMutation.mutate(values);
    //setIncomeItems((previousItems) => [...previousItems, values]);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Asiento contable</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <span className="mr-2">Adicionar Item</span>
              <Plus size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar item</DialogTitle>
              <DialogDescription>
                Agrega un nuevo item al ingreso actual
              </DialogDescription>
            </DialogHeader>
            <div>
              <Form {...addIncomeItemForm}>
                <form
                  onSubmit={addIncomeItemForm.handleSubmit(onSubmit)}
                  className="flex"
                >
                  <FormField
                    control={addIncomeItemForm.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Account</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? data.data.find(
                                      (account) => account.id === field.value
                                    )?.description
                                  : "Select Account"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search language..." />
                              <CommandEmpty>No language found.</CommandEmpty>
                              <CommandGroup>
                                {data.data.map((account) => (
                                  <CommandItem
                                    value={account.id.toString()}
                                    key={account.id}
                                    onSelect={() => {
                                      addIncomeItemForm.setValue(
                                        "accountId",
                                        account.id
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        account.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {account.description}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          This is the language that will be used in the
                          dashboard.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addIncomeItemForm.control}
                    name="debitBs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Debe Bs</FormLabel>
                        <FormControl>
                          <Input placeholder="debe" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addIncomeItemForm.control}
                    name="assetBs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Haber Bs:</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addIncomeItemForm.control}
                    name="gloss"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Glosa</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
            {/* <DialogFooter>
              <DialogClose asChild>
                <Button>Cerrar</Button>
              </DialogClose>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cuenta</TableHead>
            <TableHead>Debe Bs.</TableHead>
            <TableHead>Haber Bs.</TableHead>
            {/* <TableHead>Debe Sus.</TableHead> */}
            {/* <TableHead>Haber Sus.</TableHead> */}
            <TableHead>Glosa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomeItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <ComboboxIncomeItem
                  list={
                    data?.data.map((item) => ({
                      value: `${item.id}`,
                      label: `${item.code} - ${item.description}`,
                    }))!
                  }
                  value={item.accountId.toString()}
                  onChange={(value) => onChangeCombobox(value, index)}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="debitBs"
                  onChange={(e) => onChange(e, index)}
                  value={item.debitBs}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="assetBs"
                  onChange={(e) => onChange(e, index)}
                  value={item.assetBs}
                />
              </TableCell>
              {/* <TableCell>
                <Input
                  name="debitSus"
                  onChange={(e) => onChange(e, index)}
                  value={item.debitSus}
                />
              </TableCell> */}
              {/* <TableCell>
                <Input
                  name="assetSus"
                  onChange={(e) => onChange(e, index)}
                  value={item.assetSus}
                />
              </TableCell> */}
              <TableCell>
                <Input
                  name="gloss"
                  onChange={(e) => onChange(e, index)}
                  value={item.gloss}
                />
              </TableCell>
              <TableCell className="flex justify-center gap-2 items-center">
                <Button
                  variant="secondary"
                  size="icon"
                  type="button"
                  onClick={() => {
                    editIncomeItemMutation.mutate(item);
                  }}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => {
                    removeIncomeItem(index, item?.id);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
interface PropsCombobox {
  list: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: any) => void;
}

export function ComboboxIncomeItem({ list, value, onChange }: PropsCombobox) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? list.find((item) => item.value === value)?.label
            : "Selecciona una opción..."}
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Busca..." />
          <CommandEmpty>No hay opciones.</CommandEmpty>
          <CommandGroup>
            {list.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
