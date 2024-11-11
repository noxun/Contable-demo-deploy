"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, formatISO, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useAccounts from "@/modules/shared/hooks/useAccounts";
import useCostCenter from "@/modules/shared/hooks/useCostCenter";
import useAccountingBox from "@/modules/shared/hooks/useAccountingBox";
import ReactSelect from "react-select";
import useTrazoInternCodes from "@/modules/shared/hooks/useTrazoInternCodes";
import { es } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { createAccountingBoxItems } from "@/lib/data";
import { AxiosError } from "axios";
import { toast } from "sonner";

const newAccountingBoxFormSchema = z
  .object({
    mes: z.string().optional(),
    fecha: z.date().transform((value) => formatISO(value)),
    accountingBoxId: z.string(),
    accountId: z.string(),
    costCenterId: z.string(),
    reciboInterno: z.string(),
    tipoComprobante: z.enum(["RECIBO", "FACTURA", "SIN COMPROBANTE"]), //tipo comprobante
    //voucherProviderNumber: z.string(),
    comprobanteProveedor: z.string(),
    hojaDeRuta: z.string(),
    cliente: z.string(),
    detalle: z.string(),
    ingreso: z.coerce.number(),
    egreso: z.coerce.number(),
    saldo: z.coerce.number(),
  })
  .refine((data) => {
    const parsedDate = parseISO(data.fecha);
    const mesAbreviado = format(parsedDate, "LL", { locale: es }).toUpperCase();
    const anio = format(parsedDate, "yy");
    data.mes = `${mesAbreviado}${anio}`;
    return true;
  });

export type NewAccountingBox = z.infer<typeof newAccountingBoxFormSchema>;

export default function NewAccountingBoxForm() {
  const form = useForm<NewAccountingBox>({
    resolver: zodResolver(newAccountingBoxFormSchema),
    defaultValues: {
      detalle: "",
    },
  });

  const { data: accounts, isPending: isPendingAccounts } = useAccounts();
  const { data: costCenter, isPending: isPendingCostCenter } = useCostCenter();
  const { data: accountingBoxType, isPending: isPendingAccountingBoxType } =
    useAccountingBox();
  const { data: trazoInternCodes, isPending: isPendingTrazoInternCodes } =
    useTrazoInternCodes();

  // console.log(form.formState.errors);

  const newAccountingBoxMutation = useMutation({
    mutationFn: createAccountingBoxItems,
    onError: (error: AxiosError) => {
      console.log(error)
      toast.error("Error al insertar");
    },
    onSuccess: () => {
      toast.success("Registrado!")
      //invalidate aquie
    }
  })

  function onSubmit(values: NewAccountingBox) {
    console.log(values);
    newAccountingBoxMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-4 gap-4"
      >
        {isPendingAccountingBoxType ? (
          <div>Cargando...</div>
        ) : (
          <FormField
            control={form.control}
            name="accountingBoxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Caja</FormLabel>
                <ReactSelect
                  options={accountingBoxType}
                  getOptionLabel={(accountingBoxType) => accountingBoxType.name}
                  getOptionValue={(accountingBoxType) =>
                    accountingBoxType.id.toString()
                  }
                  onChange={(value) => {
                    field.onChange(value?.id.toString());
                  }}
                />
                <FormDescription>Tipo de la caja</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isPendingAccounts ? (
          <div>Cargando...</div>
        ) : (
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta</FormLabel>
                <ReactSelect
                  options={accounts}
                  getOptionLabel={(accounts) =>
                    `${accounts.code} - ${accounts.description}`
                  }
                  getOptionValue={(accounts) => accounts.id.toString()}
                  onChange={(value) => {
                    field.onChange(value?.id.toString());
                  }}
                />
                <FormDescription>Tipo de la caja</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isPendingCostCenter ? (
          <div>Cargando...</div>
        ) : (
          <FormField
            control={form.control}
            name="costCenterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centro de Costos</FormLabel>
                <ReactSelect
                  options={costCenter}
                  getOptionLabel={(costCenter) => costCenter.name}
                  getOptionValue={(costCenter) => costCenter.id.toString()}
                  onChange={(value) => {
                    field.onChange(value?.id.toString());
                  }}
                />
                <FormDescription>Centro de costos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isPendingTrazoInternCodes ? (
          <div>Cargando...</div>
        ) : (
          <FormField
            control={form.control}
            name="hojaDeRuta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hoja de ruta</FormLabel>
                <ReactSelect
                  options={trazoInternCodes}
                  getOptionLabel={(trazoInternCodes) => trazoInternCodes.value}
                  getOptionValue={(trazoInternCodes) => trazoInternCodes.value}
                  onChange={(value) => {
                    field.onChange(value?.id.toString());
                  }}
                />
                <FormDescription>Centro de costos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Fecha de la caja</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reciboInterno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recibo</FormLabel>
              <FormControl>
                <Input placeholder="recibo" {...field} />
              </FormControl>
              <FormDescription>El recibo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Cliente" {...field} />
              </FormControl>
              <FormDescription>El Cliente</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="detalle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalle</FormLabel>
              <FormControl>
                <Input placeholder="detalle" {...field} />
              </FormControl>
              <FormDescription>El detalle</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comprobanteProveedor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <FormControl>
                <Input placeholder="proveedor" {...field} />
              </FormControl>
              <FormDescription>El Proveedor</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingreso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingreso</FormLabel>
              <FormControl>
                <Input placeholder="Ingreso" {...field} />
              </FormControl>
              <FormDescription>El Ingreso</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="egreso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Egreso</FormLabel>
              <FormControl>
                <Input placeholder="egreso" {...field} />
              </FormControl>
              <FormDescription>El egreso</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="saldo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo</FormLabel>
              <FormControl>
                <Input placeholder="saldo" {...field} />
              </FormControl>
              <FormDescription>El saldo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipoComprobante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Comprobante</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo Comprobante" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="RECIBO">RECIBO</SelectItem>
                  <SelectItem value="FACTURA">FACTURA</SelectItem>
                  <SelectItem value="SIN COMPROBANTE">
                    SIN COMPROBANTE
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>El tipo de comprobante</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
