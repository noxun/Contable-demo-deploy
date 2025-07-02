"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  CreateVoucher,
  createVoucherSchema,
  createVoucherSchemaWithValidations,
  UpdateVoucher,
  updateVoucherSchema,
  VoucherItemCreate,
} from "../schemas/voucherSchema";
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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NumericFormat } from "react-number-format";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMemo } from "react";

type Props = {
  mode: "create" | "update";
  items?: VoucherItemCreate[];
};

export function FormCreateOrUpdateVoucher({ mode }: Props) {
  const schema =
    mode === "create"
      ? createVoucherSchemaWithValidations
      : updateVoucherSchema;
  const form = useForm<CreateVoucher | UpdateVoucher>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 0,
      voucherDate: format(new Date(), "yyyy-MM-dd"),
      provider: "",
      invoice: "",
      invoiceNumber: "",
      nit: "",
      exchangeRate: 6.97,
      coin: "BOB",
      checkNum: "0",
      gloss: "",
      items: [],
      typeDocument: null,
      canceledTo: null,
      num: 0,
      createdById: null,
      costCenterId: null,
      bankId: null,
      hojaDeRuta: null,
      bankItemRef: 0,
      accountingBoxItemRef: 0,
      bookSBRef: 0,
      sucursalId: 0,// agregar el select de sucursales
    },
  });

  console.log(form.formState.errors);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
  });

  const {totalDebitBs, totalAssetBs, isBalanced} = useMemo(() => {
    const debitTotal = (watchedItems || []).reduce((sum, item) => {
      return sum + (Number(item?.debitBs) || 0);
    }, 0)

    const assetTotal = (watchedItems || []).reduce((sum, item) => {
      return sum + (Number(item?.assetBs) || 0);
    }, 0)

    return {
      totalDebitBs: debitTotal,
      totalAssetBs: assetTotal,
      isBalanced: Math.abs(debitTotal - assetTotal) < 0.01, // Tolerancia para errores de redondeo
    }

  }, [watchedItems])

  const onSubmit = (data: CreateVoucher | UpdateVoucher) => {
    console.log("Form submitted with data:", data);
    // Handle form submission logic here
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">
          {mode === "create" ? "Crear Nuevo Voucher" : "Actualizar Voucher"}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Header Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-muted rounded-lg">
              <h3 className="col-span-full text-lg font-medium mb-4">
                Información General
              </h3>

              <FormField
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de Transacción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Traspaso</SelectItem>
                        <SelectItem value="1">Egreso</SelectItem>
                        <SelectItem value="2">Ingreso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el tipo de voucher.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="voucherDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Seleccione la fecha.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="coin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BOB">Bolivianos</SelectItem>
                        <SelectItem value="USD">Dolares</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el tipo de moneda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Provider and Invoice Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-muted rounded-lg">
              <h3 className="col-span-full text-lg font-medium mb-4">
                Información del Proveedor y Factura
              </h3>

              <FormField
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <FormControl>
                      <Input value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>Nombre del proveedor</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="invoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de la Factura</FormLabel>
                    <FormControl>
                      <Input value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Valor de la factura asociada al voucher
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de la Factura</FormLabel>
                    <FormControl>
                      <Input value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Numero de la factura asociada al voucher
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT</FormLabel>
                    <FormControl>
                      <Input value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      NIT del proveedor asociado al voucher
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cambio</FormLabel>
                    <FormControl>
                      <Input value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Tipo de cambio utilizado para la transacción
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="checkNum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N de Cheque</FormLabel>
                    <FormControl>
                      <Input value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Numero de cheque asociado al voucher (si aplica)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* General Description Section */}
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-4">Descripción General</h3>

              <FormField
                name="gloss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Glosa General</FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Ingrese una glosa general"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Glosa general del voucher, puede ser una descripción breve
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Accounts Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Cuentas del Voucher</h3>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      accountId: 0,
                      debitBs: 0,
                      assetBs: 0,
                      gloss: "",
                      description: "",
                      debitSus: 0,
                      assetSus: 0,
                      conceptExpenseId: null,
                      createdAt: "",
                      carpeta: null,
                      voucherId: 0,
                      typeOfExpense: null,
                    })
                  }
                >
                  + Agregar Cuenta
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cuenta</TableHead>
                      <TableHead>Debe Bs.</TableHead>
                      <TableHead>Haber Bs.</TableHead>
                      <TableHead>Glosa</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.accountId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Cuenta"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.debitBs`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <NumericFormat
                                  value={field.value}
                                  onValueChange={(values) => {
                                    field.onChange(values.floatValue || 0);
                                  }}
                                  customInput={Input}
                                  thousandSeparator
                                  decimalScale={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.assetBs`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <NumericFormat
                                  value={field.value}
                                  onValueChange={(values) => {
                                    field.onChange(values.floatValue || 0);
                                  }}
                                  customInput={Input}
                                  thousandSeparator
                                  decimalScale={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.gloss`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="Glosa"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => remove(index)}
                          size="icon"
                          variant="outline"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              {/* <Button type="button" variant="outline">
                Cancelar
              </Button> */}
              <Button type="submit">
                {mode === "create" ? "Crear Voucher" : "Actualizar Voucher"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div>
        totalAssetBs: {totalAssetBs} <br />
        totalDebitBs: {totalDebitBs} <br />
      </div>
    </div>
  );
}
