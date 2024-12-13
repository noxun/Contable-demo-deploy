"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { editInvoiceRegistryById } from "@/lib/data";
import { InvoiceRegistry } from "@/lib/types";
import { useRouter } from "next/navigation";

const editInvoiceFormSchema = z.object({
  id: z.number(),
  nitProvider: z.coerce.number(),
  businessName: z.string(),
  authorizationCode: z.string(),
  invoiceNumber: z.coerce.number(),
  DUINumber: z.coerce.number(),
  invoiceDate: z.string(),
  totalAmount: z.coerce.number(),
  discountOrBonus: z.coerce.number(),
  giftCardAmount: z.coerce.number(),
  creditBase: z.coerce.number(),
  taxCredit: z.coerce.number(),
  purchaseType: z.string(),
  controlCode: z.coerce.number(),
  consolidationStatus: z.string(),
});

export type EditInvoiceForm = z.infer<typeof editInvoiceFormSchema>;

export default function FormEditInvoiceRegistry({
  invoiceRegistry,
}: {
  invoiceRegistry: InvoiceRegistry;
}) {

  console.log(invoiceRegistry)

  const router = useRouter()
  const queryClient = useQueryClient()

  const invoiceEditForm = useForm<EditInvoiceForm>({
    resolver: zodResolver(editInvoiceFormSchema),
    defaultValues: {
      id: invoiceRegistry.id,
      nitProvider: invoiceRegistry.nitProvider as number,
      businessName: invoiceRegistry.businessName,
      authorizationCode: invoiceRegistry.authorizationCode as string,
      invoiceNumber: invoiceRegistry.invoiceNumber as number,
      DUINumber: invoiceRegistry.DUINumber,
      invoiceDate: invoiceRegistry.invoiceDate,
      totalAmount: invoiceRegistry.totalAmount,
      discountOrBonus: invoiceRegistry.discountOrBonus,
      giftCardAmount: invoiceRegistry.giftCardAmount,
      creditBase: invoiceRegistry.creditBase,
      taxCredit: invoiceRegistry.taxCredit,
      purchaseType: invoiceRegistry.purchaseType,
      controlCode: invoiceRegistry.controlCode as number,
      consolidationStatus: invoiceRegistry.consolidationStatus
    },
  });

  function onSubmit(values: EditInvoiceForm) {
    // console.log(values);
    // toast(JSON.stringify(values));
    editInvoiceRegistryMutation.mutate(values);
  }

  const editInvoiceRegistryMutation = useMutation({
    mutationFn: editInvoiceRegistryById,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al editar el registro");
    },
    onSuccess: () => {
      toast.success("Registro editado correctamente");

      if(invoiceEditForm.getValues("purchaseType") === "Compras"){
        queryClient.invalidateQueries({queryKey:["invoiceRegistry", 0]})
        router.push("/dashboard/invoice-registry/purchases")
      }else{
        queryClient.invalidateQueries({queryKey:["invoiceRegistry", 1]})
        router.push("/dashboard/invoice-registry/sells")
      }

    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edición de Factura</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...invoiceEditForm}>
          <form
            className="space-y-4"
            onSubmit={invoiceEditForm.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={invoiceEditForm.control}
                name="nitProvider"
                render={({ field }) => (
                  <FormItem className="md: col-span-2">
                    <FormLabel>NIT del Proveedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el NIT" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número de identificación tributaria
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Name */}
              <FormField
                control={invoiceEditForm.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Razón Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese la razón social" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nombre legal de la empresa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Authorization Code */}
              <FormField
                control={invoiceEditForm.control}
                name="authorizationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Autorización</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el código" {...field} />
                    </FormControl>
                    <FormDescription>
                      Código único de autorización de la factura
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Invoice Number */}
              <FormField
                control={invoiceEditForm.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Factura</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el número de factura"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DUI Number */}
              <FormField
                control={invoiceEditForm.control}
                name="DUINumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de DUI</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingrese el número DUI"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Invoice Date */}
              <FormField
                control={invoiceEditForm.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Factura</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Total Amount */}
              <FormField
                control={invoiceEditForm.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Monto total de la factura</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount or Bonus */}
              <FormField
                control={invoiceEditForm.control}
                name="discountOrBonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descuento o Bonificación</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Gift Card Amount */}
              <FormField
                control={invoiceEditForm.control}
                name="giftCardAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto de Tarjeta Regalo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Credit Base */}
              <FormField
                control={invoiceEditForm.control}
                name="creditBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base de Crédito</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Tax Credit */}
              <FormField
                control={invoiceEditForm.control}
                name="taxCredit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crédito Fiscal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Purchase Type */}
              <FormField
                control={invoiceEditForm.control}
                name="purchaseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Compra</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Estándar</SelectItem>
                        <SelectItem value="special">Especial</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Control Code */}
              <FormField
                control={invoiceEditForm.control}
                name="controlCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Control</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el código de control"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Consolidation Status */}
              <FormField
                control={invoiceEditForm.control}
                name="consolidationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Consolidación</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="consolidated">
                          Consolidado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Guardar Factura
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
