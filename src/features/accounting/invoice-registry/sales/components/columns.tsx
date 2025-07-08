import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "../schemas/saleSchema";
import { DialogCreateOrUpdateSaleForm } from "./DialogCreateOrUpdateSaleForm";
import { Badge } from "@/components/ui/badge";
import { ApplySaleAccountDialog } from "./ApplySaleAccountDialog";

export const columns: ColumnDef<Sale>[] = [
  { accessorKey: "number", header: "Número" },
  { accessorKey: "specification", header: "Especificación" },
  { accessorKey: "clientNitCi", header: "NIT/CI Cliente" },
  { accessorKey: "clientNameOrBusinessName", header: "Nombre/Razón Social Cliente" },
  { accessorKey: "authorizationCode", header: "Código Autorización" },
  { accessorKey: "invoiceNumber", header: "Nro. Factura" },
  { accessorKey: "invoiceDate", header: "Fecha Factura" },
  { accessorKey: "totalSaleAmount", header: "Monto Total Venta" },
  { accessorKey: "iceAmount", header: "Monto ICE" },
  { accessorKey: "ieHdAmount", header: "Monto IE/HD" },
  { accessorKey: "ipjAmount", header: "Monto IPJ" },
  { accessorKey: "taxesAmount", header: "Monto Impuestos" },
  {
    accessorKey: "otherNonTaxableAmounts",
    header: "Otros No Gravados",
  },
  { accessorKey: "exportsAndExemptOperations", header: "Exportaciones y Exentas" },
  { accessorKey: "zeroRateSales", header: "Ventas Tasa Cero" },
  { accessorKey: "subtotal", header: "Subtotal" },
  {
    accessorKey: "discountsBonusesRebates",
    header: "Descuentos/Bonos/Rebajas",
  },
  { accessorKey: "giftCardAmount", header: "Monto Gift Card" },
  { accessorKey: "taxDebitBaseAmount", header: "Base Débito Fiscal" },
  { accessorKey: "taxDebit", header: "Débito Fiscal" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "saleType", header: "Tipo Venta" },
  { accessorKey: "controlCode", header: "Código Control" },
  { accessorKey: "accountDebit.description", header: "Cuenta Débito" },
  {
    accessorKey: "applyVoucher",
    header: "Asiento Aplicado?",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <Badge variant={sale.applyVoucher ? "default" : "destructive"}>
          {sale.applyVoucher ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <div className="flex gap-2">
          <DialogCreateOrUpdateSaleForm mode="update" sale={sale} />
          <ApplySaleAccountDialog
            saleId={sale.id}
            nit={sale.clientNitCi || ""}
          />
        </div>
      );
    },
  },
];
