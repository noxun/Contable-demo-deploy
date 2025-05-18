"use client";
import {
  InvoiceRegistry,
  InvoiceRegistryResponseByType,
  InvoiceRegistryType,
} from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import InvoiceRegistryDeleteButton from "./InvoiceRegistryDeleteButton";
import EditInvoiceRegistryButton from "./EditInvoiceRegistryButton";
import DialogInvoiceVoucher from "./DialogInvoiceVoucher";
import DialogEditInvoiceVoucher from "./DialogEditInvoiceVoucher";

export const columns: ColumnDef<InvoiceRegistryResponseByType>[] = [
  {
    accessorKey: "nitProvider",
    header: "NIT",
  },
  {
    accessorKey: "businessName",
    header: "Razón Social",
  },
  // {
  //   accessorKey: "authorizationCode",
  //   header: "Cod. Autorización",
  // },
  {
    accessorKey: "invoiceNumber",
    header: "Num Factura",
  },
  // {
  //   accessorKey: "duiNumber",
  //   header: "Num DUI",
  // },
  {
    accessorKey: "invoiceDate",
    header: "Fecha de Factura",
    cell: ({ row }) => {
      const date = new Date(row.getValue("invoiceDate"));
      return date.toLocaleDateString("es-ES");
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Monto Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  { accessorKey: "iva", header: "IVA" },
  {
    accessorKey: "it",
    header: "IT",
    cell: ({ row }) => {
      const invoiceRegistry = row.original;
      return (
        <div>
          {invoiceRegistry.type === "Compras"
            ? "No aplica"
            : invoiceRegistry.it}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "discountOrBonus",
  //   header: "Descuento/Bonificación",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("discountOrBonus"));
  //     return new Intl.NumberFormat("es-ES", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);
  //   },
  // },
  // {
  //   accessorKey: "giftCardAmount",
  //   header: "Monto Gift Card",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("giftCardAmount"));
  //     return new Intl.NumberFormat("es-ES", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);
  //   },
  // },
  // {
  //   accessorKey: "creditBase",
  //   header: "Base de Crédito",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("creditBase"));
  //     return new Intl.NumberFormat("es-ES", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);
  //   },
  // },
  // {
  //   accessorKey: "type",
  //   header: "Tipo",
  // },
  // {
  //   accessorKey: "controlCode",
  //   header: "Código Control",
  // },
  {
    accessorKey: "consolidationStatus",
    header: "Estado de Consolidación",
    cell: ({ row }) => {
      const status = row.getValue("consolidationStatus");
      return status === "pending" ? "Pendiente" : "Consolidado";
    },
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      const invoiceRegistry = row.original;
      return (
        <div className="flex">
          {/* Solo se renderiza si id y type no son falsy */}
          {invoiceRegistry.voucherId && invoiceRegistry.typeTransaction ? (
            <DialogEditInvoiceVoucher
              voucherId={invoiceRegistry.voucherId}
              type={invoiceRegistry.typeTransaction}
            />
          ) : null}
          <DialogInvoiceVoucher invoiceRegistryId={invoiceRegistry.id} />
          <InvoiceRegistryDeleteButton invoiceRegistryId={invoiceRegistry.id} />
          <EditInvoiceRegistryButton invoiceRegistryId={invoiceRegistry.id} />
        </div>
      );
    },
  },
];
