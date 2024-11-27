import { InvoiceRegistry } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<InvoiceRegistry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nitProvider",
    header: "NIT del Proveedor",
  },
  {
    accessorKey: "businessName",
    header: "Razón Social",
  },
  {
    accessorKey: "authorizationCode",
    header: "Código de Autorización",
  },
  {
    accessorKey: "invoiceNumber",
    header: "Número de Factura",
  },
  {
    accessorKey: "DUINumber",
    header: "Número de DUI",
  },
  {
    accessorKey: "invoiceDate",
    header: "Fecha de Factura",
    cell: ({ row }) => {
      const date = new Date(row.getValue("invoiceDate"));
      return date.toLocaleDateString('es-ES');
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Monto Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    },
  },
  {
    accessorKey: "discountOrBonus",
    header: "Descuento/Bonificación",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("discountOrBonus"));
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    },
  },
  {
    accessorKey: "giftCardAmount",
    header: "Monto Tarjeta Regalo",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("giftCardAmount"));
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    },
  },
  {
    accessorKey: "creditBase",
    header: "Base de Crédito",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("creditBase"));
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    },
  },
  {
    accessorKey: "taxCredit",
    header: "Crédito Fiscal",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("taxCredit"));
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    },
  },
  {
    accessorKey: "purchaseType",
    header: "Tipo de Compra",
  },
  {
    accessorKey: "controlCode",
    header: "Código de Control",
  },
  {
    accessorKey: "consolidationStatus",
    header: "Estado de Consolidación",
    cell: ({ row }) => {
      const status = row.getValue("consolidationStatus");
      return status === 'pending' ? 'Pendiente' : 'Consolidado';
    },
  },
];