import Select, {
  ControlProps,
  CSSObjectWithLabel,
  GroupBase,
  StylesConfig,
} from "react-select";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Voucher, VoucherItem, VoucherType } from "../types/sharedTypes";
import { Account } from "@/features/accounting/account/types/account";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useToken from "../hooks/useToken";
import CustomSelect from "@/components/custom/select";

type FormEditVoucherItemsProps = {
  type: VoucherType;
  voucherId: number | undefined;
  voucherItems: VoucherItem[];
  setVoucherItems: Dispatch<SetStateAction<VoucherItem[]>>;
  accountData: Account[];
  voucher: Voucher;
  accountDate?: string; //para invalidar la query
};

export default function FormEditVoucherItems({
  type,
  voucherId,
  voucherItems,
  setVoucherItems,
  accountData,
  voucher,
  accountDate,
}: FormEditVoucherItemsProps) {
  const { token } = useToken();

  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    let listVoucherItem = voucherItems;
  
    // Check if the field name is "gloss" to handle it as a string
    const newValue = name === "gloss" 
      ? value 
      : (value === "" || value === "." || value === "-" || value === "-." || /^-?\d*\.?\d*$/.test(value))
        ? value  // Keep as string while typing
        : 0;
  
    listVoucherItem[index] = {
      ...listVoucherItem[index],
      [name]: newValue,
    };
  
    setVoucherItems([...listVoucherItem]);
  }
  const queryClient = useQueryClient();

  const deleteVoucherItemMutation = useMutation({
    mutationFn: async ({
      voucherItemId,
      type,
    }: {
      voucherItemId: number;
      type: VoucherType;
    }) => {
      return await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?id=${voucherItemId}&type=${type}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    mutationFn: async ({
      voucherItem,
      type,
      voucherId,
    }: {
      voucherItem: VoucherItem;
      type: VoucherType;
      voucherId: number | undefined;
    }) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?type=${type}`,
        { ...voucherItem, voucherId },
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
      if (accountDate) {
        console.log("llego aca?");
        queryClient.invalidateQueries({
          queryKey: ["bookBiggerData", accountDate],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["Vouchers", type] });
      queryClient.invalidateQueries({
        queryKey: ["Vouchers", voucherId?.toString(), type],
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
    deleteVoucherItemMutation.mutate({ voucherItemId, type });
  }

  //ESTO SE MUERE
  //FIXME:
  const accountOptions = (Array.isArray(accountData) ? accountData : []).map(
    (item) => ({
      value: item.id.toString(),
      label: item.description,
      //...item
    })
  );

  //const formatOptionLabel = ({ label }) => <div>{label}</div>;
  //const getOptionValue = (option) => option.value;

  const addVoucherItemSchema = z.object({
    debitBs: z.coerce.number(),
    debitSus: z.number().optional().default(0),
    assetBs: z.coerce.number(),
    assetSus: z.number().optional().default(0),
    gloss: z.string(),
    accountId: z.coerce.number().or(z.string()),
    voucherId: z.number(),
  });

  type NewVoucherItem = z.infer<typeof addVoucherItemSchema>;

  const addVoucherItemForm = useForm<NewVoucherItem>({
    resolver: zodResolver(addVoucherItemSchema),
    defaultValues: {
      voucherId: voucherId,
      accountId: "",
    },
  });

  const addVoucherItemMutation = useMutation({
    mutationFn: async ({
      data,
      type,
    }: {
      data: NewVoucherItem;
      type: VoucherType;
    }) => {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/Item?type=${type}&voucherId=${data.voucherId}&Date=${voucher.voucherDate}`,
        [data],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Vouchers", type] });
      queryClient.resetQueries({
        queryKey: ["Vouchers", voucherId?.toString(), type],
      });
      toast.success("item creado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error al crear el item");
    },
  });

  function onSubmit(values: NewVoucherItem) {
    console.log(values);
    addVoucherItemMutation.mutate({ data: values, type });
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
          <DialogContent className="sm:max-w-[800px] flex flex-col ">
            <DialogHeader>
              <DialogTitle>Adicionar item</DialogTitle>
              <DialogDescription>
                Agrega un nuevo item al voucher actual
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <Form {...addVoucherItemForm}>
                <form
                  onSubmit={addVoucherItemForm.handleSubmit(onSubmit)}
                  className="flex gap-8"
                >
                  <FormField
                    control={addVoucherItemForm.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem className="w-72">
                        <FormLabel>Cuenta</FormLabel>
                        <FormControl>
                          <CustomSelect
                            menuPlacement="top"
                            isSearchable={true}
                            options={accountOptions}
                            value={accountOptions.find(
                              (option) =>
                                option.value === field.value?.toString()
                            )}
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption?.value || "")
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          El nombre de la cuenta
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
                        <FormDescription>El debe en Bolivianos</FormDescription>
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
                          <Input placeholder="haber" {...field} />
                        </FormControl>
                        <FormDescription>
                          El haber en bolivianos
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
                          <Input placeholder="glosa" {...field} />
                        </FormControl>
                        <FormDescription>La glosa del voucher</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogClose asChild>
                    {/* <Button type="button" variant="secondary">
                      Close
                    </Button> */}
                    <Button type="submit">Guardar</Button>
                  </DialogClose>
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
            <TableHead>Debe Sus.</TableHead>
            <TableHead>Haber Sus.</TableHead>
            <TableHead>Glosa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voucherItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="w-[35%]">
                <CustomSelect
                  menuPlacement="top"
                  isSearchable={true}
                  options={accountOptions}
                  value={accountOptions.find(
                    (option) => option.value === item.accountId!.toString()
                  )}
                  onChange={(selectedOption) => {
                    const updatedItem = {
                      ...item,
                      accountId: parseInt(selectedOption?.value || "0"),
                    };
                    const updatedItems = [...voucherItems];
                    updatedItems[index] = updatedItem;
                    setVoucherItems(updatedItems);
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="debitBs"
                  onChange={(e) => onChange(e, index)}
                  value={item?.debitBs ?? ""}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="assetBs"
                  onChange={(e) => onChange(e, index)}
                  value={item?.assetBs ?? ""}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="debitSus"
                  onChange={(e) => onChange(e, index)}
                  value={item?.debitSus ?? ""}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="assetSus"
                  onChange={(e) => onChange(e, index)}
                  value={item?.assetSus ?? ""}
                />
              </TableCell>
              <TableCell className="w-[30%]">
                <Input
                  type="text"
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
                    console.log(item);
                    editIncomeItemMutation.mutate({
                      voucherItem: item,
                      type,
                      voucherId,
                    });
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
