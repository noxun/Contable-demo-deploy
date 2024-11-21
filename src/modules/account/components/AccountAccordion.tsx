"use client";
import ChildAccounts from "./ChildAccounts";
import { useState } from "react";
import ImportAccountDialog from "./ImportAccountDialog";
import useAccountsByType from "@/modules/shared/hooks/useAccountsByType";
import useTypeCompanies from "@/modules/shared/hooks/useTypeCompanies";
import AccountLayoutSkeleton from "./AccountLayoutSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AccountAccordion() {
  const [type, setType] = useState(1);

  const typeCompanyQuery = useTypeCompanies();

  const accountsQuery = useAccountsByType(type);

  if (accountsQuery.isPending || typeCompanyQuery.isPending) {
    return <AccountLayoutSkeleton />;
    //aca se puede retornar algún skeleton
  }

  function handleChange(value: string){
    setType(parseInt(value ?? 1))
  }

  return (
    <div>
      <div className="w-full flex justify-between">
        <Select onValueChange={handleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecciona un Tipo" />
          </SelectTrigger>
          <SelectContent>
            {typeCompanyQuery.data?.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ImportAccountDialog />
      </div>
      <br />
      <ChildAccounts accounts={accountsQuery.data} />
    </div>
  );
}

export default AccountAccordion;
