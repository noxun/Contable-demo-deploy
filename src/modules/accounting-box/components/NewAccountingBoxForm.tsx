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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccountingBoxItems } from "@/lib/data";
import { AxiosError } from "axios";
import { toast } from "sonner";
import CustomSelect from "@/components/custom/select";
import useModelSeats from "@/modules/shared/hooks/useModelSeats";
import { Dispatch, SetStateAction, useState } from "react";
import useAccountingBoxBalance from "@/modules/shared/hooks/useAccountingBoxBalance";
import { Label } from "@/components/ui/label";

const newAccountingBoxFormSchema = z.object({
  fecha: z.date().transform((value) => formatISO(value)),
  accountingBoxId: z.string(),
  accountId: z.coerce.number(),
  modelSeatId: z.coerce.number(),
  costCenterId: z.coerce.number(),
  referencia: z.string(),
  hojaDeRuta: z.string(),
  nombre: z.string(),
  detalle: z.string(),
  valorPagado: z.coerce.number(),
});
// .refine((data) => {
//   const parsedDate = parseISO(data.fecha);
//   const mesAbreviado = format(parsedDate, "LL", { locale: es }).toUpperCase();
//   const anio = format(parsedDate, "yy");
//   data.mes = `${mesAbreviado}${anio}`;
//   return true;
// });

export type NewAccountingBox = z.infer<typeof newAccountingBoxFormSchema>;

type NewAccountingBoxFormProps = {
  // accountingBoxId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function NewAccountingBoxForm({
  setOpen,
}: NewAccountingBoxFormProps) {
  const [accountingBoxId, setAccountingBoxId] = useState<
    number | null | undefined
  >(null);

  const queryClient = useQueryClient();

  const form = useForm<NewAccountingBox>({
    resolver: zodResolver(newAccountingBoxFormSchema),
    defaultValues: {
      accountId: 0,
      detalle: "",
    },
  });

  const { data: modelSeats, isPending: isPendingModelSeats } = useModelSeats();
  const { data: costCenter, isPending: isPendingCostCenter } = useCostCenter();
  const { data: accountingBoxType, isPending: isPendingAccountingBoxType } =
    useAccountingBox();
  const { data: trazoInternCodes, isPending: isPendingTrazoInternCodes } =
    useTrazoInternCodes();

  // console.log(form.formState.errors);
  console.log(accountingBoxId);

  const newAccountingBoxMutation = useMutation({
    mutationFn: createAccountingBoxItems,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Error al insertar");
    },
    onSuccess: () => {
      toast.success("Registrado!");
      //invalidate aquie
      queryClient.invalidateQueries({
        queryKey: ["accountingBox", accountingBoxId],
      });
      setOpen(false); //cierra el modal
    },
  });

  function onSubmit(values: NewAccountingBox) {
    console.log(values);
    newAccountingBoxMutation.mutate(values);
  }

  const {
    data: balance,
    isLoading,
    isError,
  } = useAccountingBoxBalance(accountingBoxId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col ">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {isPendingAccountingBoxType ? (
            <div>Cargando...</div>
          ) : (
            <FormField
              control={form.control}
              name="accountingBoxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Caja</FormLabel>
                  <CustomSelect
                    options={accountingBoxType}
                    getOptionLabel={(accountingBoxType) =>
                      accountingBoxType.name
                    }
                    getOptionValue={(accountingBoxType) =>
                      accountingBoxType.id.toString()
                    }
                    onChange={(value) => {
                      setAccountingBoxId(value?.id);
                      field.onChange(value?.id.toString());
                    }}
                  />
                  <FormDescription>Tipo de la caja</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {isPendingModelSeats ? (
            <div>Cargando...</div>
          ) : (
            <FormField
              control={form.control}
              name="modelSeatId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asientos Modelo</FormLabel>
                  <CustomSelect
                    options={modelSeats}
                    getOptionLabel={(modelSeat) => modelSeat.description}
                    getOptionValue={(modelSeat) => modelSeat.id.toString()}
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
                  <FormLabel>Gestor</FormLabel>
                  <CustomSelect
                    options={costCenter}
                    getOptionLabel={(costCenter) => costCenter.name}
                    getOptionValue={(costCenter) => costCenter.id.toString()}
                    onChange={(value) => {
                      field.onChange(value?.id.toString());
                    }}
                  />
                  <FormDescription>Gestor del centro de costos</FormDescription>
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
                  <CustomSelect
                    options={trazoInternCodes}
                    getOptionLabel={(trazoInternCodes) =>
                      trazoInternCodes.value
                    }
                    getOptionValue={(trazoInternCodes) =>
                      trazoInternCodes.value
                    }
                    onChange={(value) => {
                      field.onChange(value?.id.toString());
                    }}
                  />
                  <FormDescription>Hoja de ruta del trazo</FormDescription>
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
            name="referencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referencia</FormLabel>
                <FormControl>
                  <Input placeholder="Referencia" {...field} />
                </FormControl>
                <FormDescription>Nro de documento de respaldo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Cliente" {...field} />
                </FormControl>
                <FormDescription>A quien se paga</FormDescription>
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
                  <Input placeholder="Detalle" {...field} />
                </FormControl>
                <FormDescription>Glosa de referencia</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valorPagado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Pagado</FormLabel>
                <FormControl>
                  <Input
                    disabled={
                      form.getValues("valorPagado") > (balance?.balance ?? 0) ||
                      balance?.balance === 0 ||
                      accountingBoxId === null
                    }
                    placeholder="valor"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Valor Pagado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
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
                <Input placeholder="Egreso" {...field} />
              </FormControl>
              <FormDescription>El egreso</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
          <div>
            <Label> Saldo Inicial: </Label>
            {balance ? balance.balance : "Cargando saldo actual"}
          </div>
          {/* <FormField
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
        /> */}
        </div>
        <div className="flex justify-end">
          <Button className="mt-5" type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
