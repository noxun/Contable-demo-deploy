import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IResponseConceptFolder,
  IResponseDispatchDocument,
  IResponseFolder,
} from "../interface/folders";
import { IFactura } from "../interface/invoice";
import { handleCreateInvoices } from "../actions/action-invoice";
import { invoiceDispatchDocument } from "../actions/action";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface Props {
  data: IResponseConceptFolder[];
  dataFolder: IResponseFolder;
  dispatchDocument: IResponseDispatchDocument;
}
export const MakeInvoiceButton = (props: Props) => {
  const { data, dataFolder, dispatchDocument } = props;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const onSubmit: SubmitHandler<{}> = async () => await handleGenerate();

  async function handleGenerate() {
    const bodyFactura: IFactura = {
      customer_id: Number(dataFolder.clienteCodigo),
      customer: dataFolder.clienteNombre,
      nit_ruc_nif: dataFolder.nitCi ?? "",
      subtotal: dispatchDocument.totalInvoice,
      total_tax: dispatchDocument.totalInvoice,
      discount: "0",
      monto_giftcard: "0",
      total: dispatchDocument.totalInvoice,
      invoice_date_time: "",
      currency_code: "",
      codigo_sucursal: 0,
      punto_venta: 0,
      codigo_documento_sector: 1,
      tipo_documento_identidad: 5,
      codigo_metodo_pago: 13,
      codigo_moneda: 1,
      complemento: null,
      numero_tarjeta: null,
      tipo_cambio: 1,
      tipo_factura_documento: 1,
      items: data
        .filter((item) => item.typeOfExpense === "Factura")
        .map((item) => ({
          product_id: Number(item.id),
          // product_id: Number(item.expenseId),
          product_code: item.acronym,
          product_name: item.description,
          price: item.assetBs,
          quantity: 1,
          total: item.assetBs,
          unidad_medida: 58,
          numero_serie: "",
          numero_imei: "",
          codigo_producto_sin: 62191,
          codigo_actividad: "473020",
          // codigo_producto_sin: 67910,
          // codigo_actividad: "522922",
          discount: 0,
        })),
      data: {},
    };
    try {
      const result = await handleCreateInvoices("/invoices", bodyFactura);
      if (result) {
        console.log("🚀 ~ handleGenerate ~ result:", result);
        if (result && !result.hasError) {
          const documentResponse = await invoiceDispatchDocument(
            dataFolder.numRef,
            result.data.invoice_number,
            result.data.siat_url,
            result.data.print_url
          );
          console.log(
            "🚀 ~ handleGenerate ~ documentResponse:",
            documentResponse
          );
          if (documentResponse?.status === 200) {
            location.reload();
          }
        } else {
        }
      }
    } catch (error) {}
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" variant="destructive">
          Enviar factura
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center p-4 border-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <h4 className="font-semibold text-lg">Generar Factura</h4>
            <p className="mb-2">
              ¿Estas seguro que quieres enviar la factura se guardara en el SIN?
            </p>
          </div>
          <DialogFooter className="sm:justify-start">
            <div className="w-full flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isSubmitting} type="submit" variant="default">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                <span>Enviar</span>
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
