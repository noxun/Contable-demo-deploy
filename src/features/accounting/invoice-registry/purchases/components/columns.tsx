import { ColumnDef } from "@tanstack/react-table";
import { Purchase } from "../schemas/purchaseSchema";
import { DialogCreateOrUpdatePurchaseForm } from "./DialogCreateOrUpdatePurchaseForm";
import { Badge } from "@/components/ui/badge";
import { ApplyAccountDialog } from "./ApplyAccountDialog";

export const columns: ColumnDef<Purchase>[] = [
  { accessorKey: "number", header: "Número" },
  { accessorKey: "specification", header: "Especificación" },
  { accessorKey: "providerNit", header: "NIT Proveedor" },
  { accessorKey: "providerBusinessName", header: "Razón Social Proveedor" },
  { accessorKey: "authorizationCode", header: "Código Autorización" },
  { accessorKey: "invoiceNumber", header: "Nro. Factura" },
  { accessorKey: "duanDimNumber", header: "Nro. DUAN/DIM" },
  { accessorKey: "invoiceDuanDimDate", header: "Fecha Factura/DUAN/DIM" },
  { accessorKey: "totalPurchaseAmount", header: "Monto Total Compra" },
  { accessorKey: "iceAmount", header: "Monto ICE" },
  { accessorKey: "ieHdAmount", header: "Monto IE/HD" },
  { accessorKey: "ipjAmount", header: "Monto IPJ" },
  { accessorKey: "taxesAmount", header: "Monto Impuestos" },
  {
    accessorKey: "otherNonVatCreditSubject",
    header: "Otros No Sujeto a Crédito Fiscal",
  },
  { accessorKey: "exemptAmounts", header: "Importes Exentos" },
  { accessorKey: "zeroRatePurchaseAmount", header: "Compras Tasa Cero" },
  { accessorKey: "subtotal", header: "Subtotal" },
  {
    accessorKey: "discountsBonusesRebates",
    header: "Descuentos/Bonos/Rebajas",
  },
  { accessorKey: "giftCardAmount", header: "Monto Gift Card" },
  { accessorKey: "vatCreditBaseAmount", header: "Base Crédito Fiscal" },
  { accessorKey: "vatCredit", header: "Crédito Fiscal" },
  { accessorKey: "purchaseType", header: "Tipo Compra" },
  { accessorKey: "controlCode", header: "Código Control" },
  { accessorKey: "accountDebit.description", header: "Cuenta Debe" },
  { accessorKey: "accountAsset.description", header: "Cuenta Haber" },
  {
    accessorKey: "applyVoucher",
    header: "Asiento Aplicado?",
    cell: ({ row }) => {
      const purchase = row.original;
      return (
        <Badge variant={purchase.applyVoucher ? "default" : "destructive"}>
          {purchase.applyVoucher ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      const purchase = row.original;
      return (
        <div className="flex gap-2">
          <DialogCreateOrUpdatePurchaseForm mode="update" purchase={purchase} />
          <ApplyAccountDialog
            purchaseId={purchase.id}
            nit={purchase.providerNit}
          />
        </div>
      );
    },
  },
];
