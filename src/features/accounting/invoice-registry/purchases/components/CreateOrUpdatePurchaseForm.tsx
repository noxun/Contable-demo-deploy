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
  CreatePurchase,
  createPurchaseSchema,
  Purchase,
  UpdatePurchase,
  updatePurchaseSchema,
} from "../schemas/purchaseSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PurchaseTypeSelect } from "./PurchaseTypeSelect";
import { AccountSelect } from "@/features/accounting/account/components/AccountSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreatePurchaseMutation } from "../hooks/useCreatePurchase";
import { format } from "date-fns";
import { useUpdatePurchaseMutation } from "../hooks/useUpdatePurchase";
import { NitSelect } from "../../components/NitSelect";
import { NitSelectInput } from "../../components/NitSelectInput";

type Props = {
  mode: "create" | "update";
  purchase?: Purchase;
};

export function CreateOrUpdatePurchaseForm({ mode, purchase }: Props) {
  const schema =
    mode === "create" ? createPurchaseSchema : updatePurchaseSchema;

  const createPurchaseMutation = useCreatePurchaseMutation();
  const updatePurchaseMutation = useUpdatePurchaseMutation();

  const form = useForm<CreatePurchase | UpdatePurchase>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "create"
        ? {
            specification: 0,
            providerNit: 0,
            providerBusinessName: null,
            authorizationCode: null,
            invoiceNumber: 0,
            duanDimNumber: null,
            invoiceDuanDimDate: "",
            totalPurchaseAmount: 0,
            iceAmount: 0,
            ieHdAmount: 0,
            ipjAmount: 0,
            taxesAmount: 0,
            otherNonVatCreditSubject: 0,
            exemptAmounts: 0,
            zeroRatePurchaseAmount: 0,
            subtotal: 0,
            discountsBonusesRebates: 0,
            giftCardAmount: 0,
            vatCreditBaseAmount: 0,
            vatCredit: 0,
            purchaseType: 1, // Default to "Normal"
            controlCode: null,
            accountAssetId: null, // Default to a valid account ID
            accountDebitId: null, // Default to a valid account ID
          }
        : {
            specification: purchase?.specification || 0,
            providerNit: purchase?.providerNit || 0,
            providerBusinessName: purchase?.providerBusinessName || null,
            authorizationCode: purchase?.authorizationCode || null,
            invoiceNumber: purchase?.invoiceNumber || 0,
            duanDimNumber: purchase?.duanDimNumber || null,
            invoiceDuanDimDate: purchase?.invoiceDuanDimDate || "",
            totalPurchaseAmount: purchase?.totalPurchaseAmount || 0,
            iceAmount: purchase?.iceAmount || 0,
            ieHdAmount: purchase?.ieHdAmount || 0,
            ipjAmount: purchase?.ipjAmount || 0,
            taxesAmount: purchase?.taxesAmount || 0,
            otherNonVatCreditSubject: purchase?.otherNonVatCreditSubject || 0,
            exemptAmounts: purchase?.exemptAmounts || 0,
            zeroRatePurchaseAmount: purchase?.zeroRatePurchaseAmount || 0,
            subtotal: purchase?.subtotal || 0,
            discountsBonusesRebates: purchase?.discountsBonusesRebates || 0,
            giftCardAmount: purchase?.giftCardAmount || 0,
            vatCreditBaseAmount: purchase?.vatCreditBaseAmount || 0,
            vatCredit: purchase?.vatCredit || 0,
            controlCode: purchase?.controlCode || null,
            accountAssetId: purchase?.accountAsset?.id || null, // Default to a valid account ID
            accountDebitId: purchase?.accountDebit?.id || null, // Default to a valid account ID
            updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            purchaseType: purchase?.purchaseType || 1, // Default to "Normal"
          },
  });

  const onSubmit = (data: CreatePurchase | UpdatePurchase) => {
    console.log("Formulario enviado:", data);
    // if (mode === "create") {
    //   createPurchaseMutation.mutate(data as CreatePurchase);
    // } else {
    //   if (purchase?.id) {
    //     updatePurchaseMutation.mutate({
    //       id: purchase.id,
    //       data: data as UpdatePurchase,
    //     });
    //   }
    // }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Purchase Type Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="purchaseType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Compra</FormLabel>
                  <FormControl>
                    <PurchaseTypeSelect
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona el tipo de compra. Este campo es obligatorio.
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
                  <FormDescription>
                    Especificación de la compra.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Información del Proveedor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <FormField
              name="providerNit"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT del Proveedor</FormLabel>
                  <FormControl>
                    <NitSelectInput
                      value={field.value.toString()}
                      filter="byBuy"
                      onChange={(value, companyName) => {
                        field.onChange(value);
                        form.setValue(
                          "providerBusinessName",
                          companyName ?? ""
                        );
                      }}
                      name="providerNit"
                    />
                  </FormControl>
                  <FormDescription>NIT del proveedor.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="providerBusinessName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social del Proveedor</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Razón social del proveedor.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Invoice Information Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Información de Factura</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="authorizationCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Autorización</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>
                    Código de autorización de la factura.
                  </FormDescription>
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

            <FormField
              name="duanDimNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número DUA/DIM</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Número de DUA/DIM.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="invoiceDuanDimDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Factura/DUA/DIM</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Fecha de la factura o DUA/DIM.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Amounts Section */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Importes y Montos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="totalPurchaseAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe Total de la Compra</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Importe total de la compra.</FormDescription>
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
                  <FormDescription>Subtotal de la compra.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="discountsBonusesRebates"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuentos/Bonificaciones/Rebajas</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descuentos, bonificaciones y rebajas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="exemptAmounts"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importes Exentos</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Importes exentos.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="zeroRatePurchaseAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe Compras Tasa Cero</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Importe de compras con tasa cero.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="giftCardAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe Gift Card</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Importe de gift card.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Taxes Section */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Impuestos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="iceAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe ICE</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Importe del ICE.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ieHdAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe IE/HD</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Importe de IE/HD.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ipjAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe IPJ</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Importe del IPJ.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="taxesAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe de Impuestos</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Importe de impuestos.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="otherNonVatCreditSubject"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Otros No Sujetos a Crédito Fiscal</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Otros importes no sujetos a crédito fiscal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* VAT Section */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">IVA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="vatCreditBaseAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base para Crédito Fiscal IVA</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Base para crédito fiscal IVA.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="vatCredit"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crédito Fiscal IVA</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Crédito fiscal IVA.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Accounts Section */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Cuentas Contables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="accountDebitId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuenta Debe</FormLabel>
                  <FormControl>
                    <AccountSelect
                      value={field.value ? field.value.toString() : null}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona la cuenta que se debitará. Este campo es
                    obligatorio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="accountAssetId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuenta Haber</FormLabel>
                  <FormControl>
                    <AccountSelect
                      value={field.value ? field.value.toString() : null}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona la cuenta que se acreditará. Este campo es
                    obligatorio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            type="submit"
            className="w-full"
            disabled={
              form.formState.isSubmitting ||
              createPurchaseMutation.isPending ||
              updatePurchaseMutation.isPending
            }
          >
            {mode === "create" ? "Crear Compra" : "Actualizar Compra"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
