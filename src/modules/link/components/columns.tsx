"use client";

import { AccountRelation } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import LinkAccountDialog from "./LinkAccountDialog";
import UnlinkAccountDialog from "./UnlinkAccountDialog";

export const columns: ColumnDef<AccountRelation>[] = [
  {
    accessorKey: "accountDescription",
    header: "Descripción",
  },
  {
    accessorKey: "accountCode",
    header: "Código",
  },
  // {
  //   accessorKey: "accountCodeRef",
  //   header: "Codigo Cuenta Relacionada",
  // },
  // {
  //   accessorKey: "accountDescriptionRef",
  //   header: "Descripcion Cuenta Relacionada",
  // },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const account = row.original;
      return (
        <>
          {account.accountCodeRef ? (
            <UnlinkAccountDialog
              accountId={account.accountId}
              siatAccountId={account.accountIdRef}
            />
          ) : (
            <LinkAccountDialog account={account} />
          )}
        </>
      );
    },
  },
];
