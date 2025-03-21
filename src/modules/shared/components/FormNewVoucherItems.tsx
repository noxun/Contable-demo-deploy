import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SingleValue } from "react-select";
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
import NoMenuSelect from "@/components/custom/no-menu-select";

type FormNewVoucherItemsProps = {
  voucherItems: VoucherItem[];
  setVoucherItems: Dispatch<SetStateAction<VoucherItem[]>>;
  accountData: Account[];
  applyGlossToAll?: boolean;
  glossValue?: string;
  totalDebitValue: number;
  totalAssetValue: number;
};

export default function FormNewVoucherItems({
  accountData,
  voucherItems,
  setVoucherItems,
  applyGlossToAll,
  glossValue,
  totalDebitValue,
  totalAssetValue,
}: FormNewVoucherItemsProps) {
  // Function to distribute values based on percentages
  const distributeValuesByPercentage = (
    value: number,
    isDebitField: boolean,
    sourceIndex: number
  ) => {
    // Check if all voucher items have percentage and canAsset/canDebit properties
    const hasRequiredProperties = voucherItems.every(
      (item) => item.percentage !== undefined && 
                (item.canAsset !== undefined && item.canDebit !== undefined)
    );
    
    if (!hasRequiredProperties) {
      return; // Don't perform calculation if any item is missing required properties
    }
    
    // Find the 100% item 
    const hundredPercentItemIndex = voucherItems.findIndex(
      (item) => item.percentage === 100
    );
    
    if (hundredPercentItemIndex === -1) {
      return; // No 100% item found
    }
    
    const hundredPercentItem = voucherItems[hundredPercentItemIndex];
    
    // Check if 100% item has both canAsset and canDebit set to true
    if (hundredPercentItem.canAsset && hundredPercentItem.canDebit) {
      return; // Skip calculation if both flags are true
    }
    
    // Check if the field being changed belongs to the 100% item
    if (sourceIndex !== hundredPercentItemIndex) {
      return; // Only trigger distribution when changing the 100% item
    }
    
    // Determine if we're working with debit or asset field
    const isHundredPercentDebit = hundredPercentItem.canDebit && !hundredPercentItem.canAsset;
    const isHundredPercentAsset = hundredPercentItem.canAsset && !hundredPercentItem.canDebit;
    
    // Only proceed if the field type matches the allowed field for the 100% item
    if ((isDebitField && !isHundredPercentDebit) || (!isDebitField && !isHundredPercentAsset)) {
      return;
    }
    
    // Check if other items have complementary permissions
    const otherItemsHaveComplementaryPermissions = voucherItems.every((item, index) => {
      if (index === hundredPercentItemIndex) return true; // Skip the 100% item
      return isHundredPercentDebit ? item.canAsset : item.canDebit;
    });
    
    if (!otherItemsHaveComplementaryPermissions) {
      return; // Other items don't have complementary permissions
    }
    
    // Check if the sum of percentages for other items equals 100
    const otherItemsPercentageSum = voucherItems.reduce((sum, item, index) => {
      if (index === hundredPercentItemIndex) return sum;
      return sum + (item.percentage || 0);
    }, 0);
    
    if (Math.abs(otherItemsPercentageSum - 100) > 0.01) {
      return; // Sum of other percentages doesn't equal 100
    }
    
    // Update the values for other items based on their percentages
    const updatedItems = voucherItems.map((item, index) => {
      if (index === hundredPercentItemIndex) {
        // The 100% item keeps the original value
        return {
          ...item,
          debitBs: isHundredPercentDebit ? value : null,
          assetBs: isHundredPercentAsset ? value : null,
        };
      } else {
        // Calculate proportional value for other items
        const proportionalValue = (value * (item.percentage || 0)) / 100;
        
        // Update the opposite field of what the 100% item has
        return {
          ...item,
          debitBs: isHundredPercentAsset ? proportionalValue : null,
          assetBs: isHundredPercentDebit ? proportionalValue : null,
        };
      }
    });
    
    setVoucherItems(updatedItems);
  };

  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    
    let listVoucherItem = [...voucherItems];
    
    if (name === "debitBs" || name === "assetBs") {
      const numValue = parseFloat(value) || 0;
      listVoucherItem[index] = {
        ...listVoucherItem[index],
        [name]: numValue,
      };
      
      // Call distribute function if applicable
      if (numValue > 0) {
        distributeValuesByPercentage(numValue, name === "debitBs", index);
        return; // The distributeValuesByPercentage function will update the state if needed
      }
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

  function removeVoucherItem(index: number) {
    const updateVoucherItems = voucherItems.filter((_, i) => i != index);
    setVoucherItems([...updateVoucherItems]);
  }

  const accountOptions = (accountData ?? []).map((item) => ({
    value: item.id.toString(),
    label: item.description,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Asiento contable</h2>
        <Button
          type="button"
          onClick={() => {
            setVoucherItems((a) => [
              ...a,
              {
                debitBs: null,
                debitSus: 0,
                assetBs: null,
                assetSus: 0,
                gloss: glossValue ?? "",
                accountId: "",
                voucherId: "",
                canAsset: true,
                canDebit: true,
                percentage: 0
              },
            ]);
          }}
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
            <TableHead>Porcentaje</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voucherItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="h-fit w-[30%]">
                <NoMenuSelect
                  menuPlacement="top"
                  placeholder="Selecciona una Cuenta.."
                  isSearchable={true}
                  options={accountOptions}
                  value={accountOptions.find(
                    (option) => option.value === item?.accountId?.toString()
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
                  disabled={!item.canDebit}
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
                />
              </TableCell>
              <TableCell>
                <NumericFormat
                  disabled={!item.canAsset}
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
                />
              </TableCell>
              <TableCell className="w-[25%]">
                <Input
                  name="gloss"
                  onChange={(e) => onChange(e, index)}
                  value={item.gloss}
                />
              </TableCell>
              <TableCell>
                <NumericFormat
                  disabled
                  name="percentage"
                  value={item.percentage}
                  onValueChange={(values) => {
                    const event = {
                      target: {
                        name: "percentage",
                        value: values.floatValue?.toString() || "0",
                      },
                    } as ChangeEvent<HTMLInputElement>;
                    onChange(event, index);
                  }}
                  customInput={Input}
                  decimalScale={2}
                  suffix="%"
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
            <TableCell>{totalDebitValue.toFixed(2)}</TableCell>
            <TableCell>{totalAssetValue.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}