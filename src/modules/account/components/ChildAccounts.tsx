import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AccountCreateButton from "./AccountCreateButton";
import AccountDeleteButton from "./AccountDeleteButton";
import AccountEditButton from "./AccountEditButton";
import { Account } from "../types/account";
import { useState } from "react";

type ChildAccountsProps = {
  accounts: Account[]
}

export default function ChildAccounts({ accounts }: ChildAccountsProps) {

  const getChildCodes = (account: Account): string[] => {
    const childCodes = account.accountChild.map((child) => child.code);
    const grandChildCodes = account.accountChild.flatMap((child) => getChildCodes(child));
    return [...childCodes, ...grandChildCodes];
  };

  return (
    <Accordion type="multiple" className="w-full" defaultValue={accounts.flatMap((account) => [account.code, ...getChildCodes(account)])}>
      {accounts?.map((account, index) => (
        <AccordionItem key={index} value={account.code} className="px-2 border">
          <AccordionTrigger>
            {account.code}:{account.description}
          </AccordionTrigger>
          <AccordionContent>
            <div>
              {account.accountChild.length > 0 && (
                <ChildAccounts accounts={account.accountChild} />
              )}
              <div className="flex items-center justify-end gap-4 pt-4">
                <AccountCreateButton fatherId={account.id}>
                  Nuevo Registro
                </AccountCreateButton>
                <AccountEditButton account={account}>
                  Editar Registro
                </AccountEditButton>
                <AccountDeleteButton
                  accountId={account.id}
                  message="This action cannot be undone. This will
                              permanently delete the account and remove the
                              data from our servers."
                >
                  Borrar Registro
                </AccountDeleteButton>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}