"use client";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { VoucherItem, VoucherType } from "../types/sharedTypes";
import { Account } from "@/modules/account/types/account";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { token } from "../constants/token";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Pencil, Plus, Trash2 } from "lucide-react";

type FormEditVoucherItemsProps = {
  type: VoucherType;
  voucherId: number | undefined;
  voucherItems: VoucherItem[];
  setVoucherItems: Dispatch<SetStateAction<VoucherItem[]>>;
  accountData: Account[];
};

export default function FormEditVoucherItems({
  type,
  voucherId,
  voucherItems,
  setVoucherItems,
  accountData,
}: FormEditVoucherItemsProps) {

  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    let listVoucherItem = voucherItems;
    listVoucherItem[index] = {
      ...listVoucherItem[index],
      [name]: value,
    };
    setVoucherItems([...listVoucherItem]);
  }
  function onChangeCombobox(value: string, index: number) {
    let listVoucherItem = voucherItems;
    listVoucherItem[index] = {
      ...listVoucherItem[index],
      accountId: parseInt(value),
    };
    setVoucherItems([...listVoucherItem]);
  }
  const queryClient = useQueryClient();

  const deleteVoucherItemMutation = useMutation({
    mutationFn: async ({ voucherItemId, type }: { voucherItemId: number; type: VoucherType }) => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?id=${voucherItemId}&type=${type}`,
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
      queryClient.invalidateQueries({ queryKey: ["Vouchers", type] });
      queryClient.invalidateQueries({
        queryKey: ["Vouchers", voucherId?.toString(), type],
      });
      toast.success("Elemento eliminado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al editar el elemento");
    },
  });

  const editIncomeItemMutation = useMutation({
    mutationFn: async ({ voucherItem, type }: { voucherItem: VoucherItem; type: VoucherType }) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?type=${type}`,
        voucherItem,
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
      queryClient.invalidateQueries({ queryKey: ["Vouchers", type] });
      queryClient.invalidateQueries({
        queryKey: ["VoucherIncome", voucherId?.toString(), type],
      });
      toast.success("Elemento editado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al editar el elemento");
    },
  });

  function removeVoucherItem(index: number, voucherItemId: number) {
    const updateVoucherItems = voucherItems.filter((_, i) => i != index);
    setVoucherItems([...updateVoucherItems]);
    deleteVoucherItemMutation.mutate({voucherItemId, type});
  }

  const addVoucherItemSchema = z.object({
    debitBs: z.coerce.number(),
    debitSus: z.number().optional().default(0),
    assetBs: z.coerce.number(),
    assetSus: z.number().optional().default(0),
    gloss: z.string(),
    accountId: z.number(),
    voucherId: z.number(),
  });

  type NewVoucherItem = z.infer<typeof addVoucherItemSchema>;

  const addVoucherItemForm = useForm<NewVoucherItem>({
    resolver: zodResolver(addVoucherItemSchema),
    defaultValues: {
      voucherId: voucherId,
    },
  });

  const addVoucherItemMutation = useMutation({
    mutationFn: async ({data, type}: {data: NewVoucherItem, type: VoucherType}) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?type=${type}&voucherId=${data.voucherId}`,
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
      queryClient.invalidateQueries({queryKey:["Vouchers", type]});
      queryClient.resetQueries({queryKey:["Vouchers", voucherId?.toString(), type]})
      toast.success("item creado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error al crear el item");
    },
  });

  function onSubmit(values: NewVoucherItem) {
    console.log(values);
    addVoucherItemMutation.mutate({data:values, type});
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
              <Form {...addVoucherItemForm}>
                <form
                  onSubmit={addVoucherItemForm.handleSubmit(onSubmit)}
                  className="flex"
                >
                  <FormField
                    control={addVoucherItemForm.control}
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
                                  ? accountData.find(
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
                                {accountData.map((account) => (
                                  <CommandItem
                                    value={account.id.toString()}
                                    key={account.id}
                                    onSelect={() => {
                                      addVoucherItemForm.setValue(
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
                    control={addVoucherItemForm.control}
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
                    control={addVoucherItemForm.control}
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
                    control={addVoucherItemForm.control}
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
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cuenta</TableHead>
            <TableHead>Debe Bs.</TableHead>
            <TableHead>Haber Bs.</TableHead>
            <TableHead>Glosa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voucherItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <ComboboxVoucherItem
                  list={
                    accountData.map((item) => ({
                      value: `${item.id}`,
                      label: `${item.code} - ${item.description}`,
                    }))!
                  }
                  value={item.accountId!.toString()}
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
                    editIncomeItemMutation.mutate({voucherItem: item, type});
                  }}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => {
                    removeVoucherItem(index, item.id!);
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
}

type ComboboxVoucherItemProps = {
  list: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: any) => void;
}

export function ComboboxVoucherItem({ list, value, onChange }: ComboboxVoucherItemProps) {
  const [open, setOpen] = useState(false);

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