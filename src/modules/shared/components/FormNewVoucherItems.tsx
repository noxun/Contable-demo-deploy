"use client";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Account } from "@/modules/account/types/account";
import { VoucherItem } from "../types/sharedTypes";

type FormNewVoucherItemsProps = {
  voucherItems: VoucherItem[];
  setVoucherItems: Dispatch<SetStateAction<VoucherItem[]>>;
  accountData: Account[];
};
export default function FormNewVoucherItems({
  accountData,
  voucherItems,
  setVoucherItems,
}: FormNewVoucherItemsProps) {
  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    let listVoucherItem = voucherItems;
    listVoucherItem[index] = {
      ...listVoucherItem[index],
      [name]: value,
    };
    setVoucherItems([...listVoucherItem]);
  }
  function onChangeCombobox(value: string, index: number) {
    let listVoucherItem = voucherItems;
    listVoucherItem[index] = {
      ...listVoucherItem[index],
      accountId: parseInt(value),
    };
    setVoucherItems([...listVoucherItem]);
  }

  function removeVoucherItem(index: number) {
    const updateVoucherItems = voucherItems.filter((_, i) => i != index);
    setVoucherItems([...updateVoucherItems]);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Asiento contable</h2>
        <Button
          type="button"
          onClick={() =>
            setVoucherItems((a) => [
              ...a,
              {
                debitBs: 0,
                debitSus: 0,
                assetBs: 0,
                assetSus: 0,
                gloss: "",
                accountId: "",
                voucherId: "",
              },
            ])
          }
        >
          <span className="mr-2">Adicionar Item</span>
          <Plus size={18} />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cuenta</TableHead>
            <TableHead>Debe Bs.</TableHead>
            <TableHead>Haber Bs.</TableHead>
            <TableHead>Glosa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voucherItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="overflow-hidden">
                <ComboboxVoucherItem
                  list={
                    accountData.map((account) => ({
                      value: `${account.id}`,
                      label: `${account.code} - ${account.description}`,
                    }))!
                  }
                  value={item!.accountId!.toString()}
                  onChange={(value) => onChangeCombobox(value, index)}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="debitBs"
                  onChange={(e) => onChange(e, index)}
                  value={item.debitBs}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="assetBs"
                  onChange={(e) => onChange(e, index)}
                  value={item.assetBs}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="gloss"
                  onChange={(e) => onChange(e, index)}
                  value={item.gloss}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => removeVoucherItem(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
interface PropsCombobox {
  list: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: any) => void;
}

export function ComboboxVoucherItem({ list, value, onChange }: PropsCombobox) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? list.find((item) => item.value === value)?.label
            : "Selecciona una opción..."}
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Busca..." />
          <CommandEmpty>No hay opciones.</CommandEmpty>
          <CommandGroup>
            {list.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
