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
import { FormNewIncomeItems } from "./FormNewIncomeItems";
import { useState } from "react";
import { IIncomeItem } from "../interface/income";
import { Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createIncome } from "../actions/actions";
import { CircularProgress } from "@nextui-org/react";
import { IBank } from "@/modules/banks/interface/banks";
import { useRouter } from "next/navigation";

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
  type: string;
}
const FormNewIncome = ({ type }: Props) => {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [incomeItems, setIncomeItems] = useState<IIncomeItem[]>([
    {
      debitBs: "",
      debitSus: "",
      assetBs: "",
      assetSus: "",
      gloss: "",
      accountId: "",
      voucherId: "",
    },
  ]);

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/All`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    staleTime: 1000 * 60 * 10,
  });

  async function onSubmit(values: z.infer<typeof incomeSchema>) {
    const result = await createIncome(
      {
        ...values,
        type: type,
        canceledTo: format(values.canceledTo, "dd-MM-yyyy"),
      },
      incomeItems.map((item) => ({
        accountId:
          dataAccount?.data.filter(
            (account) =>
              `${account.code} - ${account.description}` === item.accountId
          )[0]?.id || 0,
        debitBs: Number(item.debitBs),
        debitSus: Number(item.debitSus),
        assetBs: Number(item.assetBs),
        assetSus: Number(item.assetSus),
        gloss: item.gloss,
      }))
    );
    if (result?.isSuccess) {
      router.push("/dashboard/income");
    } else {
    }
  }

  const incomeSchema = z.object({
    exchangeRate: z.string(),
    coin: z.string(),
    checkNum: z.string(),
    canceledTo: z.date({
      required_error: "Fecha requerida.",
    }),
    gloss: z.string(),
    bankId: z.string(),
  });

  const incomeForm = useForm<z.infer<typeof incomeSchema>>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      exchangeRate: "",
      coin: "BOB",
      checkNum: "",
      gloss: "",
      bankId: "",
    },
  });

  if (
    isLoading ||
    data === undefined ||
    isLoadingAccount ||
    dataAccount === undefined
  ) {
    return <CircularProgress className="mx-auto" />;
  }

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
                            format(field.value, "PPP")
                          ) : (
                            <span>Seleccione la fecha</span>
                          )}
                          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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
                    <Input placeholder="" {...field}></Input>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
          <FormNewIncomeItems
            data={dataAccount}
            incomeItems={incomeItems}
            setIncomeItems={setIncomeItems}
          />
          <Button type="submit">
            <span className="mr-2">Guardar Registro</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormNewIncome;
