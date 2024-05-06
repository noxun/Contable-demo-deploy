"use client";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { IIncomeItem } from "../interface/income";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Props {
  incomeItems: IIncomeItem[];
  setIncomeItems: Dispatch<SetStateAction<IIncomeItem[]>>;
}
export const FormNewIncomeItems = (props: Props) => {
  const { incomeItems, setIncomeItems } = props;

  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    let listIncomeItem = incomeItems;
    listIncomeItem[index] = {
      ...listIncomeItem[index],
      [name]: value,
    };
    setIncomeItems([...listIncomeItem]);
  }

  function removeIncomeItem(index: number) {
    const updateIncomeItems = incomeItems.filter((_, i) => i != index);
    setIncomeItems(updateIncomeItems);
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
            <TableHead>Debe Bs.</TableHead>
            <TableHead>Haber Bs.</TableHead>
            <TableHead>Glosa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomeItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  name="accountId"
                  onChange={(e) => onChange(e, index)}
                  value={item.accountId}
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
                  name="debitSus"
                  onChange={(e) => onChange(e, index)}
                  value={item.debitSus}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="assetSus"
                  onChange={(e) => onChange(e, index)}
                  value={item.assetSus}
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
