import React, { Dispatch, SetStateAction } from "react";
import { IIncomeItem } from "../interface/income";
import { Button } from "@/components/ui/button";

interface Props {
  incomeItems: IIncomeItem[];
  setIncomeItems: Dispatch<SetStateAction<IIncomeItem[]>>;
}
export const FormNewIncomeItems = (props: Props) => {
  const { setIncomeItems } = props;
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2>Asiento contable</h2>
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
          Adicionar Item
        </Button>
      </div>
    </div>
  );
};
