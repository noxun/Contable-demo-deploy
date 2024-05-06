"use client";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { IIncomeItem } from "../interface/income";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";
import { z } from "zod";

const accountsSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string(),
  coin: z.string(),
  active: z.boolean().default(true),
  isBudgetable: z.boolean(),
  isMotion: z.boolean(),
  isCost: z.boolean(),
  accountChild: z.array(
    z.object({
      id: z.number(),
      code: z.string(),
      description: z.string(),
      coin: z.string(),
      active: z.boolean().default(true),
      isBudgetable: z.boolean(),
      isMotion: z.boolean(),
      isCost: z.boolean(),
    })
  ),
});

type Account = z.infer<typeof accountsSchema>;

interface Props {
  incomeItems: IIncomeItem[];
  setIncomeItems: Dispatch<SetStateAction<IIncomeItem[]>>;
}
export const FormNewIncomeItems = (props: Props) => {
  const { incomeItems, setIncomeItems } = props;

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<{ data: Account[] }> =>
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Account/All`),
    staleTime: 1000 * 60 * 10,
  });

  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    let listIncomeItem = incomeItems;
    listIncomeItem[index] = {
      ...listIncomeItem[index],
      [name]: value,
    };
    setIncomeItems([...listIncomeItem]);
  }
  function onChangeCombobox(value: string, index: number) {
    let listIncomeItem = incomeItems;
    listIncomeItem[index] = {
      ...listIncomeItem[index],
      accountId: value,
    };
    setIncomeItems([...listIncomeItem]);
  }

  function removeIncomeItem(index: number) {
    const updateIncomeItems = incomeItems.filter((_, i) => i != index);
    setIncomeItems([...updateIncomeItems]);
  }

  if (isLoading && data === undefined) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Asiento contable</h2>
        <Button
          type="button"
          onClick={() =>
            setIncomeItems((a) => [
              ...a,
              {
                debitBs: "",
                debitSus: "",
                assetBs: "",
                assetSus: "",
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
            {/* <TableHead>Debe Sus.</TableHead> */}
            {/* <TableHead>Haber Sus.</TableHead> */}
            <TableHead>Glosa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomeItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <ComboboxIncomeItem
                  list={
                    data?.data.map((item) => ({
                      value: `${item.code} - ${item.description}`,
                      label: `${item.code} - ${item.description}`,
                    }))!
                  }
                  value={item.accountId}
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
              {/* <TableCell>
                <Input
                  name="debitSus"
                  onChange={(e) => onChange(e, index)}
                  value={item.debitSus}
                />
              </TableCell> */}
              {/* <TableCell>
                <Input
                  name="assetSus"
                  onChange={(e) => onChange(e, index)}
                  value={item.assetSus}
                />
              </TableCell> */}
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
                  onClick={() => removeIncomeItem(index)}
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
};
interface PropsCombobox {
  list: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: any) => void;
}

export function ComboboxIncomeItem({ list, value, onChange }: PropsCombobox) {
  const [open, setOpen] = React.useState(false);

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
