"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { format, formatISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useCostCenter from "@/features/accounting/cost-center/hooks/useCostCenter";
import useAccountingBox from "@/features/accounting/accounting-box/hooks/useAccountingBox";
import { es } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccountingBoxItems, postCompanyOrConcept } from "@/lib/data";
import { AxiosError } from "axios";
import { toast } from "sonner";
import CustomSelect from "@/components/custom/select";
import CreatableSelect from "react-select/creatable";
import { Dispatch, SetStateAction, useState } from "react";
import useAccountingBoxBalance from "@/features/accounting/accounting-box/hooks/useAccountingBoxBalance";
import { Label } from "@/components/ui/label";
import useTrazoInternCodesByCompanyId from "@/features/accounting/shared/hooks/useTrazoInternCodesByCompanyId";
import useTrazoCompanies from "@/features/accounting/shared/hooks/useTrazoCompanies";
import useModelSeatsByType from "@/features/accounting/shared/hooks/useModelSeatsByType";
import { TrazoCompany } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

const newAccountingBoxFormSchema = z.object({
  fecha: z.date().transform((value) => formatISO(value)),
  accountingBoxId: z.string(),
  accountId: z.coerce.number(),
  modelSeatId: z.coerce.number(),
  costCenterId: z.coerce.number().optional(),
  referencia: z.string(),
  hojaDeRuta: z.string().optional(),
  nombre: z.string(),
  detalle: z.string(),
  invoice: z.string().optional(),
  nit: z.string().optional(),
  invoiceNumber: z.string().optional(),
  provider: z.string().optional(),
  valorPagado: z.coerce.number().min(0, "El valor pagado debe ser mayor a 0"),
  // .refine(
  //   (value) => value <= (balance?. ?? 0),
  //   "El valor pagado no puede ser mayor al saldo actual"
  // ),
  //TODO: validar que el valor pagado no sea mayor al saldo actual
});

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

  const [isShowingInvoiceFields, setIsShowingInvoiceFields] = useState<
    boolean | "indeterminate"
  >(false);

  const [isCreatingOption, setIsCreatingOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState<null | {
    value: number;
    label: string;
  }>(null);

  const queryClient = useQueryClient();

  const form = useForm<NewAccountingBox>({
    resolver: zodResolver(newAccountingBoxFormSchema),
    defaultValues: {
      accountId: 0,
      detalle: "",
      provider: "",
      invoiceNumber: "0",
      invoice: "",
      nit: "",
    },
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

  const { data: trazoCompanies, isLoading: isLoadingTrazoCompanies } =
    useTrazoCompanies();

  const caja = 3;

  const { data: modelSeats, isPending: isPendingModelSeats } =
    useModelSeatsByType(caja);
  const { data: costCenter, isPending: isPendingCostCenter } = useCostCenter();
  const { data: accountingBoxType, isPending: isPendingAccountingBoxType } =
    useAccountingBox();
  const { data: trazoInternCodes, isPending: isPendingTrazoInternCodes } =
    useTrazoInternCodesByCompanyId(selectedCompanyId);

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

  const handleCreate = async (inputValue: string) => {
    setIsCreatingOption(true);
    try {
      const dataToSend = {
        name: inputValue,
      };
      const response = await postCompanyOrConcept(dataToSend);
      queryClient.setQueryData(
        ["TrazoCompanies"],
        (oldData: TrazoCompany[]) => [
          ...oldData,
          {
            id: response.id,
            razonSocial: response.name,
            ref: "Contable", // Adapt this to your backend response
          },
        ]
      );

      const newOption = {
        value: response.id,
        label: response.name,
      };

      //FIXME: set the formvalue with setValue so it is synced with react hook form
      setSelectedOption(newOption);
      setSelectedCompanyId(response.id);

      toast.success("Nueva opcion agregada correctamente");
    } catch (error) {
      toast.error("Error al agregar una nueva opcion");
      console.log(error);
    } finally {
      setIsCreatingOption(false);
    }
  };

  function onSubmit(values: NewAccountingBox) {
    console.log(values);
    newAccountingBoxMutation.mutate(values);
  }

  const {
    data: balance,
    isLoading,
    isError,
  } = useAccountingBoxBalance(accountingBoxId);

  const trazoCompaniesOptions = (
    Array.isArray(trazoCompanies) ? trazoCompanies : []
  ).map((company) => ({
    value: company.id,
    label: company.razonSocial,
  }));

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
                  <FormLabel>Encargado(opcional)</FormLabel>
                  <CustomSelect
                    options={costCenter}
                    getOptionLabel={(costCenter) => costCenter.name}
                    getOptionValue={(costCenter) => costCenter.id.toString()}
                    onChange={(value) => {
                      field.onChange(value?.id.toString());
                    }}
                  />
                  <FormDescription>Encargado</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {isPendingTrazoInternCodes ? (
            <div>
              Cargando, Seleccione un cliente para mostrar sus hojas de ruta...
            </div>
          ) : (
            <FormField
              control={form.control}
              name="hojaDeRuta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hoja de ruta(opcional)</FormLabel>
                  <CustomSelect
                    isLoading={isLoadingTrazoCompanies}
                    isDisabled={isLoadingTrazoCompanies}
                    options={trazoInternCodes}
                    getOptionLabel={(trazoInternCodes) =>
                      trazoInternCodes.value
                    }
                    getOptionValue={(trazoInternCodes) =>
                      trazoInternCodes.value
                    }
                    onChange={(value) => {
                      field.onChange(value?.value.toString());
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
          {isLoadingTrazoCompanies ? (
            <div>Cargando Clientes...</div>
          ) : (
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre/Cliente</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      value={selectedOption}
                      isDisabled={isCreatingOption}
                      isLoading={isCreatingOption}
                      options={trazoCompaniesOptions}
                      onCreateOption={handleCreate}
                      onChange={(value) => {
                        setSelectedOption(value);
                        setSelectedCompanyId(value?.value as number);
                        field.onChange(value?.label);
                      }}
                      formatCreateLabel={(inputValue) =>
                        `Crear cliente "${inputValue}"`
                      }
                    />
                  </FormControl>
                  <FormDescription>A quien se paga</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <FormControl>
                  <Input placeholder="Proveedor" {...field} />
                </FormControl>
                <FormDescription>Proveedor</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isShowingInvoiceFields ? (
            <>
              <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT</FormLabel>
                    <FormControl>
                      <Input placeholder="nit" {...field} />
                    </FormControl>
                    <FormDescription>NIT</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Factura</FormLabel>
                    <FormControl>
                      <Input placeholder="valor factura" {...field} />
                    </FormControl>
                    <FormDescription>Valor de la factura</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de Factura</FormLabel>
                    <FormControl>
                      <Input placeholder="num factura" {...field} />
                    </FormControl>
                    <FormDescription>Numero de la factura</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}
          <FormField
            control={form.control}
            name="valorPagado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Pagado</FormLabel>
                <FormControl>
                  <Input
                    disabled={accountingBoxId === null}
                    placeholder="valor"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers and up to 2 decimal places
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        field.onChange(value);
                      } else if (value === "") {
                        field.onChange("");
                      }

                      // Convert to number and validate against balance when there's a value
                      const numValue = parseFloat(value);
                      if (
                        !isNaN(numValue) &&
                        numValue > (balance?.balance ?? 0)
                      ) {
                        toast.info(
                          "El valor pagado no puede ser mayor al saldo actual"
                        );
                        field.onChange("0");
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Valor Pagado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label> Saldo Inicial: </Label>
            {balance
              ? balance.balance
              : "Cargando saldo actual, seleccione un tipo de caja para mostrar el saldo correspondiente"}
          </div>
        </div>
        <Label className="flex items-center gap-2">
          Factura?
          <Checkbox
            checked={isShowingInvoiceFields}
            onCheckedChange={setIsShowingInvoiceFields}
          />
        </Label>
        <div className="flex justify-end">
          <Button className="mt-5" type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
