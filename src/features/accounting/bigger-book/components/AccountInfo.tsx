"use client";

import { useState, useCallback, useEffect } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useDebounce } from "use-debounce";
import { AccountData } from "../types";

interface AccountInfoProps {
  currentAccounts: AccountData[];
  accountCode: string;
  accountDescription: string;
  onSelectedAccountIndex: (index: string) => void;
}

export const AccountInfo = ({
  currentAccounts,
  accountCode,
  accountDescription,
  onSelectedAccountIndex,
}: AccountInfoProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedValue] = useDebounce(searchTerm, 400);
  const [filteredAccounts, setFilteredAccounts] = useState<AccountData[] | []>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const filteredItems = currentAccounts.filter((account) => {
      return account.accountDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    setFilteredAccounts(filteredItems);
    setIsLoading(false);
  }, [currentAccounts, searchTerm]);

  useEffect(() => {
    handleOnSearch();
  }, [debouncedValue, handleOnSearch]);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="space-y-1">
        <p className="text-sm font-medium">Código de cuenta: {accountCode}</p>
        <p className="text-lg font-semibold">
          Descripción: {accountDescription}
        </p>
      </div>
      <div className="flex gap-2 relative">
        <Command shouldFilter={false} className="w-72">
          <CommandInput
            value={searchTerm}
            onValueChange={(value) => {
              console.log("cambiando: ", value.length > 0);
              setSearchTerm(value);
              setOpen(value.length > 0);
            }}
            placeholder="Buscar cuenta..."
          />
          {open && (
            <CommandList className="absolute z-50 top-full bg-white">
              {isLoading && <CommandItem disabled>Cargando...</CommandItem>}
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((item) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={item.accountCode}
                    value={item.accountCode}
                    onSelect={() => {
                      onSelectedAccountIndex(item.accountCode);
                      setSearchTerm(item.accountDescription);
                      setOpen(false);
                    }}
                  >
                    {item.accountDescription}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No hay resultados</CommandItem>
              )}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
};
