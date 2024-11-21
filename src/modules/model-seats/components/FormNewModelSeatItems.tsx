import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Account } from "@/modules/account/types/account";
import { ModelSeatItem } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type FormNewModelSeatItemsProps = {
  modelSeatItems: ModelSeatItem[];
  setModelSeatItems: Dispatch<SetStateAction<ModelSeatItem[]>>;
  accountData: Account[];
};

export default function FormNewModelSeatItems({
  accountData,
  modelSeatItems,
  setModelSeatItems,
}: FormNewModelSeatItemsProps) {

  function removeVoucherItem(index: number) {
    const updatedModelSeatItems = modelSeatItems.filter((_, i) => i != index);
    setModelSeatItems([...updatedModelSeatItems]);
  }

  function handlePercentageChange(index: number, value: string) {
    const percentage = parseFloat(value);
    if (!isNaN(percentage)) {
      setModelSeatItems((prev) => {
        const updatedItems = [...prev];
        updatedItems[index].percentage = percentage;
        return updatedItems;
      });
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Asiento Modelo</h2>
        <Button
          type="button"
          onClick={() =>
            setModelSeatItems((a) => [
              ...a,
              {
                accountId: "",
                debit: false,
                asset: false,
                percentage: 0
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
            <TableHead>Es Debe</TableHead>
            <TableHead>Es Haber</TableHead>
            <TableHead>Porcentaje</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modelSeatItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="h-fit w-72">
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  // menuPortalTarget={document.body}
                  minMenuHeight={10}
                  maxMenuHeight={300}
                  menuPlacement="top"
                  placeholder="Selecciona una Cuenta.."
                  options={accountData}
                  getOptionLabel={(accountData) =>
                    `${accountData.code} - ${accountData.description}`
                  }
                  getOptionValue={(accountData) => accountData.id.toString()}
                  value={accountData.find(
                    (account) => account.id === parseInt(item.accountId as string)
                  )}
                  onChange={(option) =>
                    setModelSeatItems((prev) => {
                      const updatedItems = [...prev];
                      updatedItems[index].accountId =
                        option?.id.toString() || "";
                      return updatedItems;
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  name="debit"
                  checked={item.debit}
                  onCheckedChange={(checked) =>
                    setModelSeatItems((prev) => {
                      const updatedItems = [...prev];
                      updatedItems[index].debit = !!checked;
                      return updatedItems;
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  name="asset"
                  checked={item.asset}
                  onCheckedChange={(checked) =>
                    setModelSeatItems((prev) => {
                      const updatedItems = [...prev];
                      updatedItems[index].asset = !!checked;
                      return updatedItems;
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.percentage}
                  onChange={(e) => handlePercentageChange(index, e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
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