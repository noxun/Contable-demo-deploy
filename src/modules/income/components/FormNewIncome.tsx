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

const FormNewIncome = () => {
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

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
  }

  const loginSchema = z.object({
    exchangeRate: z.string(),
    coin: z.string(),
    checkNum: z.string(),
    canceledTo: z.date({
      required_error: "Fecha requerida.",
    }),
    gloss: z.string(),
    bankId: z.string(),
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      exchangeRate: "",
      coin: "BOB",
      checkNum: "",
      gloss: "",
      bankId: "",
    },
  });

  return (
    <div>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-2">
            <FormField
              control={loginForm.control}
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
              control={loginForm.control}
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
            <FormField
              control={loginForm.control}
              name="checkNum"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>N° de cheque</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="checkNum"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>N° de cheque</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2 items-center mb-2">
            <FormField
              control={loginForm.control}
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
              control={loginForm.control}
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
                      <SelectItem value="BOB">Bolivianos</SelectItem>
                      <SelectItem value="USD">Dolares</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={loginForm.control}
            name="gloss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Glosa</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          <FormNewIncomeItems
            incomeItems={incomeItems}
            setIncomeItems={setIncomeItems}
          />
          <Button type="submit">
            <span className="mr-2">Guardar Ingreso</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormNewIncome;
