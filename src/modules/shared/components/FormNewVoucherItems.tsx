"use client";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import Select, { SingleValue } from "react-select";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Account } from "@/modules/account/types/account";
import { VoucherItem } from "../types/sharedTypes";

type FormNewVoucherItemsProps = {
  voucherItems: VoucherItem[];
  setVoucherItems: Dispatch<SetStateAction<VoucherItem[]>>;
  accountData: Account[];
  applyGlossToAll?: boolean;
};
export default function FormNewVoucherItems({
  accountData,
  voucherItems,
  setVoucherItems,
  applyGlossToAll,
}: FormNewVoucherItemsProps) {
  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;

    let listVoucherItem = voucherItems;

    if (name === "debitBs" || name === "assetBs") {
      listVoucherItem[index] = {
        ...listVoucherItem[index],
        [name]: parseFloat(value) || 0,
      };
    } else {
      listVoucherItem[index] = {
        ...listVoucherItem[index],
        [name]: value,
      };
    }

    if (applyGlossToAll && name === "gloss") {
      listVoucherItem = listVoucherItem.map((item, i) =>
        i === index ? { ...item, [name]: value } : { ...item, gloss: value }
      );
    }

    setVoucherItems([...listVoucherItem]);
  }

  function onSelectChange(
    option: SingleValue<{ value: string; label: string }> | null,
    index: number
  ) {
    let listVoucherItem = [...voucherItems];
    listVoucherItem[index] = {
      ...listVoucherItem[index],
      accountId: option ? option.value : "",
    };
    setVoucherItems(listVoucherItem);
  }

  const totalDebitValue = voucherItems.reduce((total, num) => {
    return total + num.debitBs;
  }, 0);

  const totalAssetValue = voucherItems.reduce((total,num) => {
    return total + num.assetBs
  }, 0);

  //console.log(voucherItems);

  function removeVoucherItem(index: number) {
    const updateVoucherItems = voucherItems.filter((_, i) => i != index);
    setVoucherItems([...updateVoucherItems]);
  }

  const accountOptions = accountData.map((item) => ({
    value: item.id.toString(),
    label: `${item.code} - ${item.description}`,
    //...item
  }));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#1F2937' : '#FFFFFF', // dark:bg-neutral-700 or bg-white
      borderColor: state.isFocused ? '#D1D5DB' : '#9CA3AF', // dark:border-neutral-400 or border-neutral-300
      '&:hover': {
        borderColor: state.isFocused ? '#D1D5DB' : '#9CA3AF', // dark:hover:border-neutral-400 or hover:border-neutral-300
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#1F2937', // dark:bg-neutral-700
      borderColor: '#9CA3AF', // dark:border-neutral-600
      zIndex: 9999, // Ensure it appears above other elements
    }),
    option: (base, state) => ({
      ...base,
      color: state.isFocused ? '#E5E7EB' : '#4B5563', // dark:text-neutral-200 or text-neutral-600
      backgroundColor: state.isFocused ? '#374151' : '#F3F4F6', // dark:bg-neutral-800 or bg-neutral-100
      '&:hover': {
        backgroundColor: '#374151', // dark:hover:bg-neutral-800
      },
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#9CA3AF', // dark:bg-neutral-600
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#F3F4F6', // dark:text-neutral-100
    }),
    multiValueRemove: (base) => ({
      ...base,
      backgroundColor: '#6B7280', // dark:bg-neutral-700
      '&:hover': {
        backgroundColor: '#4B5563', // dark:hover:bg-neutral-800
      },
    }),
  };

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
              <TableCell className="h-fit w-72">
                <Select
                  maxMenuHeight={200}
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  menuPosition="absolute"
                  menuPortalTarget={document.body}
                  menuPlacement="top"
                  placeholder="Selecciona una Cuenta.."
                  // styles={{
                  //   menuList: (base) => ({
                  //     ...base,
                  //     height: 100,
                  //     minHeight: 100, // your desired height
                  //   }),
                  // }}
                  styles={customStyles}
                  isSearchable={true}
                  options={accountOptions}
                  value={accountOptions.find(
                    (option) => option.value === item.accountId
                  )}
                  onChange={(option) =>
                    onSelectChange(
                      option as SingleValue<{ value: string; label: string }>,
                      index
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <NumericFormat
                  name="debitBs"
                  value={item.debitBs}
                  onValueChange={(values) => {
                    const event = {
                      target: {
                        name: "debitBs",
                        value: values.floatValue?.toString() || "0",
                      },
                    } as ChangeEvent<HTMLInputElement>;
                    onChange(event, index);
                  }}
                  customInput={Input}
                  thousandSeparator
                  decimalScale={2}
                  defaultValue={0}
                />
              </TableCell>
              <TableCell>
                <NumericFormat
                  name="assetBs"
                  value={item.assetBs}
                  onValueChange={(values) => {
                    const event = {
                      target: {
                        name: "assetBs",
                        value: values.floatValue?.toString() || "0",
                      },
                    } as ChangeEvent<HTMLInputElement>;
                    onChange(event, index);
                  }}
                  customInput={Input}
                  thousandSeparator
                  decimalScale={2}
                  defaultValue={0}
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
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{totalDebitValue}</TableCell>
            <TableCell>{totalAssetValue}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
