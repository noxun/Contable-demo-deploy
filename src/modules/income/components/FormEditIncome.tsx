"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { FormEditIncomeItems } from "./FormEditIncomeItems";
import { useState } from "react";
import { IIncomeItem } from "../interface/income";
import { Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IBank } from "@/modules/banks/interface/banks";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Account } from "@/modules/account/types/account";
import { Voucher } from "@/modules/shared/types/sharedTypes";
import Spinner from "@/components/ui/spinner";

type FormEditIncomeProps = {
  type: string;
  income: any; //for now
};

const FormEditIncome = ({ type, income }: FormEditIncomeProps) => {
  const token = localStorage.getItem("token");
  const [incomeItems, setIncomeItems] = useState<IIncomeItem[]>(income.items);

  const { data, isLoading } = useQuery({
    queryKey: ["banks"],
    queryFn: async (): Promise<{ data: IBank[] }> =>
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Bank`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    staleTime: 1000 * 60 * 10,
  });

  const { data: dataAccount, isLoading: isLoadingAccount } = useQuery({
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
    staleTime: 1000 * 60 * 10,
  });

  const queryClient = useQueryClient();

  const editIncomeMutation = useMutation({
    mutationFn: async (data: any) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VoucherIncome"] });
      queryClient.invalidateQueries({
        queryKey: ["VoucherIncome", income.id.toString()],
      });
      toast.success("Income Edited Succesfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("There was an error while editing the income");
    },
  });

  function onSubmit(values: Voucher) {
    values["type"] = parseInt(type);
    values["id"] = income.id;
    values["canceledTo"] = format(values.canceledTo, "dd-MM-yyyy");
    console.log(values);
    editIncomeMutation.mutate(values);
  }

  const incomeItemSchema = z.object({
    debitBs: z.number(),
    debitSus: z.number(),
    assetBs: z.number(),
    assetSus: z.number(),
    gloss: z.string(),
    accoutId: z.number(),
    voucherId: z.number(),
  });

  const incomeFormSchema = z.object({
    exchangeRate: z.coerce.number(),
    coin: z.enum(["USD", "BOB"]),
    checkNum: z.string().min(1),
    canceledTo: z.coerce.date({
      required_error: "Fecha requerida.",
    }),
    gloss: z.string(),
    bankId: z.coerce.string().min(1),
    items: z.array(incomeItemSchema).optional(),
  });

  const incomeForm = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      canceledTo: income.canceledTo,
      exchangeRate: income.exchangeRate,
      coin: income.coin,
      checkNum: income.checkNum,
      gloss: income.gloss,
      bankId: income.bankId.toString(),
    },
  });

  if (
    isLoading ||
    data === undefined ||
    isLoadingAccount ||
    dataAccount === undefined
  ) {
    return <Spinner/>;
  }

  console.log(incomeForm.formState.errors);

  return (
    <div>
      <Form {...incomeForm}>
        <form onSubmit={incomeForm.handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-2">
            <FormField
              control={incomeForm.control}
              name="canceledTo"
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
                            format(field.value, "dd/MM/yyyy")
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
                        selected={field.value}
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
              control={incomeForm.control}
              name="exchangeRate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>T/C</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={incomeForm.control}
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
              control={incomeForm.control}
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
              control={incomeForm.control}
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
                      {data?.data.map((item) => (
                        <SelectItem key={`${item.id}`} value={`${item.id}`}>
                          {item.sigla} - {item.name}
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
            control={incomeForm.control}
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
            <span className="mr-2">Guardar Edicion de Registro</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
      <br />
      <FormEditIncomeItems
        voucherId={income.id}
        data={dataAccount}
        incomeItems={incomeItems}
        setIncomeItems={setIncomeItems}
      />
    </div>
  );
};

export default FormEditIncome;
