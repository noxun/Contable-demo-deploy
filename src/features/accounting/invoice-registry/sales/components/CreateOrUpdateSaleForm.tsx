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
  CreateSale,
  createSaleSchema,
  Sale,
  UpdateSale,
  updateSaleSchema,
} from "../schemas/saleSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaleTypeSelect } from "./SaleTypeSelect";
import { SaleStatusSelect } from "./SaleStatusSelect";
import { AccountSelect } from "@/features/accounting/account/components/AccountSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateSale } from "../hooks/useCreateSale";
import { format } from "date-fns";
import { useUpdateSale } from "../hooks/useUpdateSale";

type Props = {
  mode: "create" | "update";
  sale?: Sale;
};

export function CreateOrUpdateSaleForm({ mode, sale }: Props) {
  const schema =
    mode === "create" ? createSaleSchema : updateSaleSchema;

  const createSaleMutation = useCreateSale();
  const updateSaleMutation = useUpdateSale();

  const form = useForm<CreateSale | UpdateSale>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "create"
        ? {
            specification: 0,
            invoiceDate: "",
            invoiceNumber: 0,
            authorizationCode: null,
            clientNitCi: null,
            complement: null,
            clientNameOrBusinessName: null,
            totalSaleAmount: 0,
            iceAmount: 0,
            ieHdAmount: 0,
            ipjAmount: 0,
            taxesAmount: 0,
            otherNonTaxableAmounts: 0,
            exportsAndExemptOperations: 0,
            zeroRateSales: 0,
            subtotal: 0,
            discountsBonusesRebates: 0,
            giftCardAmount: 0,
            taxDebitBaseAmount: 0,
            taxDebit: 0,
            status: "V",
            controlCode: null,
            saleType: 1,
            accountDebitId: 0,
          }
        : {
            specification: sale?.specification || 0,
            invoiceDate: sale?.invoiceDate || "",
            invoiceNumber: sale?.invoiceNumber || 0,
            authorizationCode: sale?.authorizationCode || null,
            clientNitCi: sale?.clientNitCi || null,
            complement: sale?.complement || null,
            clientNameOrBusinessName: sale?.clientNameOrBusinessName || null,
            totalSaleAmount: sale?.totalSaleAmount || 0,
            iceAmount: sale?.iceAmount || 0,
            ieHdAmount: sale?.ieHdAmount || 0,
            ipjAmount: sale?.ipjAmount || 0,
            taxesAmount: sale?.taxesAmount || 0,
            otherNonTaxableAmounts: sale?.otherNonTaxableAmounts || 0,
            exportsAndExemptOperations: sale?.exportsAndExemptOperations || 0,
            zeroRateSales: sale?.zeroRateSales || 0,
            subtotal: sale?.subtotal || 0,
            discountsBonusesRebates: sale?.discountsBonusesRebates || 0,
            giftCardAmount: sale?.giftCardAmount || 0,
            taxDebitBaseAmount: sale?.taxDebitBaseAmount || 0,
            taxDebit: sale?.taxDebit || 0,
            status: sale?.status || "V",
            controlCode: sale?.controlCode || null,
            saleType: sale?.saleType || 1,
            accountDebitId: sale?.accountDebit?.id || 0,
            updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          },
  });

  const onSubmit = (data: CreateSale | UpdateSale) => {
    console.log("Formulario enviado:", data);
    if (mode === "create") {
      createSaleMutation.mutate(data as CreateSale);
    } else {
      if (sale?.id) {
        updateSaleMutation.mutate({
          id: sale.id,
          data: data as UpdateSale,
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Sale Type Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="saleType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Venta</FormLabel>
                  <FormControl>
                    <SaleTypeSelect
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona el tipo de venta. Este campo es obligatorio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <SaleStatusSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Estado de la venta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="specification"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especificación</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Especificación de la venta.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="invoiceDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Factura</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>Fecha de la factura.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="invoiceNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Factura</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Número de la factura.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Client Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Información del Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="clientNitCi"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT/CI Cliente</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>NIT o CI del cliente.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="complement"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Complemento del CI.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="clientNameOrBusinessName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre/Razón Social</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Nombre o razón social del cliente.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="authorizationCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Autorización</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Código de autorización.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="controlCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Control</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Código de control.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Amounts Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Montos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="totalSaleAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Total Venta</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Monto total de la venta.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="iceAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto ICE</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Monto del ICE.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ieHdAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto IE/HD</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Monto IE/HD.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ipjAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto IPJ</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Monto IPJ.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="taxesAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Impuestos</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Monto de impuestos.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="otherNonTaxableAmounts"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Otros No Gravados</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Otros montos no gravados.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="exportsAndExemptOperations"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exportaciones y Exentas</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Exportaciones y operaciones exentas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="zeroRateSales"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ventas Tasa Cero</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Ventas con tasa cero.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="subtotal"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Subtotal.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="discountsBonusesRebates"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuentos/Bonos/Rebajas</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Descuentos, bonos y rebajas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="giftCardAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Gift Card</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Monto de gift card.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="taxDebitBaseAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Débito Fiscal</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Base para el débito fiscal.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="taxDebit"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Débito Fiscal</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Débito fiscal.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Cuenta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="accountDebitId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuenta Débito</FormLabel>
                  <FormControl>
                    <AccountSelect
                      value={field.value?.toString() || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona la cuenta de débito.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={createSaleMutation.isPending || updateSaleMutation.isPending}
        >
          {mode === "create" ? "Crear Venta" : "Actualizar Venta"}
        </Button>
      </form>
    </Form>
  );
}
