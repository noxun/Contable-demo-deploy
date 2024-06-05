"use client";

import { useState } from "react";
import { Voucher, VoucherItem, VoucherType } from "../types/sharedTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IBank } from "@/modules/banks/interface/banks";
import axios from "axios";
import { Account } from "@/modules/account/types/account";
import { toast } from "sonner";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import FormEditVoucherItems from "./FormEditVoucherItems";
import Spinner from "@/components/ui/spinner";
import useToken from "../hooks/useToken";

type FormEditVoucherProps = {
  type: VoucherType;
  voucher: Voucher;
};

export default function FormEditVoucher({
  type,
  voucher,
}: FormEditVoucherProps) {
  const [voucherItems, setVoucherItems] = useState<VoucherItem[]>(
    voucher?.items ?? []
  );
  const {token, isTokenReady} = useToken();

  console.log(voucher)

  const banksQuery = useQuery({
    queryKey: ["banks"],
    queryFn: async (): Promise<{ data: IBank[] }> =>
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Bank`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<{ data: Account[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/Filter?isMotion=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  const queryClient = useQueryClient();

  const editVoucherMutation = useMutation({
    mutationFn: async (data: Voucher) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher`,
        data,
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
        queryKey: ["Vouchers", voucher?.id?.toString() ?? "", type],
      });
      toast.success("Income Edited Succesfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error mientras se editaba el voucher");
    },
  });

  function onSubmit(values: Voucher) {
    values["type"] = parseInt(type);
    values["id"] = voucher!.id; // no sera undefined te lo juro ts :sadface:
    values["voucherDate"] = format(values.voucherDate!, "yyyy-MM-dd");
    console.log(values);
    editVoucherMutation.mutate(values);
  }

  const voucherItemSchema = z.object({
    id: z.number().optional(),
    debitBs: z.number(),
    debitSus: z.number(),
    assetBs: z.number(),
    assetSus: z.number(),
    gloss: z.string(),
    accountId: z.number().optional(),
    voucherId: z.number(),
  });

  const voucherFormSchema = z.object({
    id: z.number().optional(),
    num: z.number().optional(),
    voucherDate: z.string().or(z.date()).optional(),
    exchangeRate: z.coerce.number(),
    coin: z.enum(["USD", "BOB"]),
    checkNum: z.string().optional(),
    canceledTo: z.string({
      required_error: "Fecha requerida.",
    }).optional(),
    gloss: z.string(),
    bankId: z.coerce.string().min(1),
    items: z.array(voucherItemSchema).optional(),
  });

  const voucherForm = useForm<z.infer<typeof voucherFormSchema>>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      voucherDate: format(voucher.voucherDate!, 'MM/dd/yyyy'),
      exchangeRate: voucher.exchangeRate,
      coin: voucher.coin,
      checkNum: voucher.checkNum,
      gloss: voucher.gloss,
      bankId: voucher!.bankId!.toString(),
    },
  });

  if (
    banksQuery.isLoading ||
    banksQuery.data === undefined ||
    accountsQuery.isLoading ||
    accountsQuery.data === undefined
  ) {
    return <Spinner/>;
  }

  return (
    <div>
      <Form {...voucherForm}>
        <form onSubmit={voucherForm.handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-2">
            <FormField
              control={voucherForm.control}
              name="voucherDate"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy/MM/dd")
                          ) : (
                            <span>Seleccione la fecha</span>
                          )}
                          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={es}
                        mode="single"
                        selected={new Date(field.value!)}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="exchangeRate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>T/C</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="coin"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Moneda</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BOB">Bolivianos</SelectItem>
                      <SelectItem value="USD">Dolares</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2 items-center mb-2">
            <FormField
              control={voucherForm.control}
              name="checkNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° de cheque</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un banco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banksQuery.data.data.map((bank) => (
                        <SelectItem key={`${bank.id}`} value={`${bank.id}`}>
                          {bank.sigla} - {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={voucherForm.control}
            name="gloss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Glosa</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          <Button type="submit">
            <span className="mr-2">Guardar Edicion de Registro {}</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
      <br />
      <FormEditVoucherItems
        type={type}
        voucherId={voucher!.id!}
        accountData={accountsQuery.data.data}
        voucherItems={voucherItems}
        setVoucherItems={setVoucherItems}
      />
    </div>
  );
}
