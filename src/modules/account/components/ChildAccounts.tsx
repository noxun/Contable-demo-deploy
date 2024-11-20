"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccountCreateButton from "./AccountCreateButton";
import AccountDeleteButton from "./AccountDeleteButton";
import AccountEditButton from "./AccountEditButton";
import { Account } from "../types/account";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ChildAccountsProps = {
  accounts: Account[] | undefined;
};

export default function ChildAccounts({ accounts }: ChildAccountsProps) {
  const getChildCodes = (account: Account): string[] => {
    const childCodes = account.accountChild!.map((child) => child.code);
    const grandChildCodes = account.accountChild!.flatMap((child) =>
      getChildCodes(child)
    );
    return [...childCodes, ...grandChildCodes];
  };

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={
        accounts?.flatMap((account) => [
          account.code,
          ...getChildCodes(account),
        ]) ?? []
      }
    >
      {accounts?.map((account, index) => (
        <AccordionItem key={index} value={account.code} className="px-2 border">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir Menu de Opciones</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-1">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <AccountCreateButton fatherId={account.id}>
                    Nuevo Registro
                  </AccountCreateButton>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AccountEditButton account={account}>
                    Editar Registro
                  </AccountEditButton>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AccountDeleteButton
                    accountId={account.id}
                    message="Esta accion no puede revertirse. Esto borrara
                    permanentemente la cuenta"
                  >
                    Borrar Registro
                  </AccountDeleteButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AccordionTrigger className="w-full">
              {account.code}:{account.description}
            </AccordionTrigger>
            <section>
              {account.isMotion ? <Badge>Movimiento</Badge> : ""}
              {account.isCost ? <Badge>Costo</Badge> : ""}
              {account.isBudgetable ? <Badge>Presupuestable</Badge> : ""}
            </section>
          </div>
          <AccordionContent>
            <div>
              {account.accountChild!.length > 0 && (
                <ChildAccounts accounts={account.accountChild} />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
